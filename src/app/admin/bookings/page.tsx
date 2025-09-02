'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface BookingItem {
  name: string;
  price: number;
  quantity: number;
  _id: string;
}

interface BookingType {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null; 
  items: BookingItem[];
  createdAt: string;
  updatedAt: string;
  status?: string; 
}

export default function AllBookings() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter()

  useEffect(() => {
    axios.get("/api/admin/bookings")
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while fetching bookings", err);
        setError('Failed to load bookings');
        setLoading(false);
      });
  }, []);

  const calculateTotal = (items: BookingItem[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Booking ID</th>
                <th className="py-2 px-4 border">Customer</th>
                <th className="py-2 px-4 border">Items</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td className="py-2 px-4 border">{booking._id.substring(0, 8)}...</td>
                  <td className="py-2 px-4 border">
                    {/* Add null check for booking.user */}
                    {booking.user ? (
                      <>
                        <div>{booking.user.name}</div>
                        <div className="text-sm text-gray-600">{booking.user.email}</div>
                      </>
                    ) : (
                      <div className="text-red-500 text-sm">User deleted</div>
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {booking.items.map(item => (
                      <div key={item._id}>
                        {item.quantity} × {item.name} (₹{item.price})
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border">₹{calculateTotal(booking.items)}</td>
                  <td className="py-2 px-4 border">{formatDate(booking.createdAt)}</td>
                  <td className="py-2 px-4 border">{booking.status || 'Confirmed'}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => console.log('Cancel booking', booking._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {router.push(`/admin/bookings/${booking._id}`)}}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}