import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface Stats {
  users: number;
  products: number;
  bookings: number;
  newsCount: number;
  revenue: number;
}

interface Activity {
  type: string;
  userName?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount?: number;
  title?: string;
  date: string;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

interface ActivityItemProps {
  activity: Activity;
}

interface SimplePieChartProps {
  stats: Stats;
}

const AdminDashboard = () => {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    users: 0,
    products: 0,
    bookings: 0,
    newsCount: 0,
    revenue: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from your API endpoint
        const response = await axios.get('/api/admin/overview');
        
        setStats({
          users: response.data.userCount,
          products: response.data.productCount,
          bookings: response.data.bookingsCount,
          newsCount: response.data.newsCount,
          revenue: response.data.revenue
        });
        
        setRecentActivities(response.data.activities || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.users} icon="👥" color="blue" />
        <StatCard title="Total Products" value={stats.products} icon="📦" color="green" />
        <StatCard title="Total Bookings" value={stats.bookings} icon="📅" color="purple" />
        <StatCard title="Total News" value={stats.newsCount} icon="📰" color="red" />
        <StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon="💰" color="yellow" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2  rounded-md">
          <div className="bg-white rounded-lg shadow p-6">
            <div className='sticky shadow-bottom'>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b border-green-500 pb-2">Recent Activities</h2>
            </div>
            
            <div className="space-y-4 h-128 overflow-y-scroll">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))
              ) : (
                <p className="text-gray-500">No recent activities</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Stats Charts */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Distribution</h2>
            <SimplePieChart stats={stats} />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={()=>{router.push("/admin/products/add")}} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200">
                Add New Product
              </button>
              <button onClick={()=>{router.push("/admin/bookings")}} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200">
                View All Bookings
              </button>
              <button onClick={()=>{router.push("/admin/users")}} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-200">
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={`rounded-full p-3 mr-4 ${colorClasses[color]}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const getActivityText = () => {
    switch(activity.type) {
      case 'user':
        return `New user registered: ${activity.userName}`;
      case 'booking':
        const itemsText = activity.items && activity.items.length > 1 
          ? `${activity.items.length} items` 
          : activity.items && activity.items.length === 1 
            ? `${activity.items[0].quantity} × ${activity.items[0].name}`
            : 'items';
        return `New booking: ${activity.userName} purchased ${itemsText} for ₹${activity.totalAmount || 0}`;
      case 'news':
        return `New news article published: ${activity.title}`;
      default:
        return 'New activity';
    }
  };

  const getActivityIcon = () => {
    switch(activity.type) {
      case 'user':
        return '👤';
      case 'booking':
        return '📦';
      case 'news':
        return '📰';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="text-2xl mr-3">{getActivityIcon()}</div>
      <div className="flex-1">
        <p className="text-gray-800">{getActivityText()}</p>
        <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
      </div>
    </div>
  );
};

const SimplePieChart = ({ stats }: SimplePieChartProps) => {
  // Calculate percentages for the pie chart visualization
  const total = stats.users + stats.products + stats.bookings;
  const userPercentage = total > 0 ? Math.round((stats.users / total) * 100) : 0;
  const productPercentage = total > 0 ? Math.round((stats.products / total) * 100) : 0;
  const bookingPercentage = total > 0 ? 100 - userPercentage - productPercentage : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 mb-4">
        <div className="absolute inset-0 rounded-full border-8 border-blue-500" 
             style={{ clipPath: `inset(0 0 0 ${100 - userPercentage}%)` }}></div>
        <div className="absolute inset-0 rounded-full border-8 border-green-500" 
             style={{ clipPath: `inset(0 0 ${100 - productPercentage}% 0)` }}></div>
        <div className="absolute inset-0 rounded-full border-8 border-purple-500" 
             style={{ clipPath: `inset(${100 - bookingPercentage}% 0 0 0)` }}></div>
      </div>
      <div className="space-y-2 w-full">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Users: {userPercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Products: {productPercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Bookings: {bookingPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;