// app/admin/bookings/[id]/page.tsx
'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus?: string;
}

export default function BookingDetails() {
  const params = useParams();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      axios.get(`/api/admin/bookings/${bookingId}`)
        .then(res => {
          setBooking(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching booking details:", err);
          setError('Failed to load booking details');
          setLoading(false);
        });
    }
  }, [bookingId]);

  const calculateTotal = (items: BookingItem[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
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

  if (error || !booking) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Booking not found'}
        </div>
        <Link href="/admin/bookings" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          &larr; Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/admin/bookings" className="text-blue-600 hover:text-blue-800">
          &larr; Back to all bookings
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Booking Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Booking ID:</span> {booking._id}</p>
              <p><span className="font-medium">Date:</span> {formatDate(booking.createdAt)}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  booking.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status || 'Confirmed'}
                </span>
              </p>
              <p><span className="font-medium">Payment Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.paymentStatus || 'Pending'}
                </span>
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
            {booking.user ? (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {booking.user.name}</p>
                <p><span className="font-medium">Email:</span> {booking.user.email}</p>
                <p><span className="font-medium">Customer ID:</span> {booking.user._id}</p>
              </div>
            ) : (
              <p className="text-red-500">User account deleted</p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        {booking.shippingAddress && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
            <div className="space-y-1">
              <p>{booking.shippingAddress.address}</p>
              <p>{booking.shippingAddress.city}, {booking.shippingAddress.state} - {booking.shippingAddress.pincode}</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Order Items</h2>
          <div className="border rounded">
            {booking.items.map(item => (
              <div key={item._id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                </div>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="flex justify-between items-center p-3 bg-gray-50">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">₹{calculateTotal(booking.items)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Update Status
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Cancel Order
          </button>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}