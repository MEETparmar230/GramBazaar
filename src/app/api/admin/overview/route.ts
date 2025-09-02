import { connectDB } from '@/lib/db'
import Product from '@/models/product'
import User from '@/models/user'
import Bookings from '@/models/booking'
import News from '@/models/news' // Import your News model
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'

// Define interfaces for type safety
interface ActivityItem {
  name: string;
  quantity: number;
  price: number;
}

interface BookingActivity {
  type: 'booking';
  id: string;
  userName: string;
  items: ActivityItem[];
  totalAmount: number;
  date: Date;
}

interface UserActivity {
  type: 'user';
  id: string;
  userName: string;
  date: Date;
}

interface NewsActivity {
  type: 'news';
  id: string;
  title: string;
  description: string;
  date: Date;
}

type Activity = BookingActivity | UserActivity | NewsActivity;

export async function GET() {
  try {
    await connectDB()
    
    // Get counts
    const productCount = await Product.estimatedDocumentCount()
    const userCount = await User.estimatedDocumentCount()
    const bookingsCount = await Bookings.estimatedDocumentCount()
    const newsCount = await News.estimatedDocumentCount() // Get news count

    // Calculate revenue
    const revenueResult = await Bookings.aggregate([
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] }
          }
        }
      }
    ])

    const revenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0

    // Get recent bookings (last 5)
    const recentBookings = await Bookings.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')

    // Get recent user registrations (last 5)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)

    // Get recent news articles (last 5)
    const recentNews = await News.find()
      .sort({ date: -1 })
      .limit(5)

    // Define activities with proper type
    const activities: Activity[] = []

    // Add bookings to activities
    recentBookings.forEach(booking => {
      const bookingId = booking._id instanceof Types.ObjectId 
        ? booking._id.toString() 
        : String(booking._id);
        
      activities.push({
        type: 'booking',
        id: bookingId,
        userName: booking.user?.name || 'Unknown User',
        items: booking.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: booking.items.reduce((sum: number, item: any) => 
          sum + (item.price * item.quantity), 0),
        date: booking.createdAt
      })
    })

    // Add user registrations to activities
    recentUsers.forEach(user => {
      const userId = user._id instanceof Types.ObjectId 
        ? user._id.toString() 
        : String(user._id);
        
      activities.push({
        type: 'user',
        id: userId,
        userName: user.name,
        date: user.createdAt
      })
    })

    // Add news articles to activities
    recentNews.forEach(news => {
      const newsId = news._id instanceof Types.ObjectId 
        ? news._id.toString() 
        : String(news._id);
        
      activities.push({
        type: 'news',
        id: newsId,
        title: news.title,
        description: news.description,
        date: news.date
      })
    })

    // Sort activities by date (newest first)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Return activities along with other data
    return NextResponse.json({
      message: "fetched counts successfully",
      productCount,
      userCount,
      bookingsCount,
      newsCount, // Include news count in response
      revenue,
      activities
    }, { status: 200 })

  } catch (err) {
    console.error("Error while fetching Overview Data", err)
    return NextResponse.json({
      message: "Internal server Error while fetching Overview data"
    }, { status: 500 })
  }
}