'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';

interface BookingItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface BookingDetails {
  _id: string;
  items: BookingItem[];
  totalAmount: number;
  createdAt: string;
  status: string;
  paymentStatus: string;
}

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const bookingId = searchParams.get('booking_id');
  const error = searchParams.get('error');
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const Skeleton = ({ className = "", width = "w-full", height = "h-4", rounded = "rounded" }) => (
  <div className={`${width} ${height} bg-gray-200 ${rounded} animate-pulse ${className}`}></div>
);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (error === 'booking_creation') {
          setFetchError('Payment succeeded but booking creation failed. Please contact support.');
          setLoading(false);
          return;
        }

        if (!bookingId) {
          setFetchError('No booking information found');
          setLoading(false);
          return;
        }

        // Fetch booking details by booking ID
        const response = await fetch(`/api/users/bookings/${bookingId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        
        const data = await response.json();
        setBookingDetails(data.booking);
      } catch (err) {
        console.error('Failed to fetch booking details:', err);
        setFetchError('Failed to load booking details. Please contact support if this persists.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Success Header Skeleton */}
        <div className="text-center mb-8">
          {/* Icon placeholder */}
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          
          {/* Title skeleton */}
          <div className="mb-4">
            <Skeleton width="w-80" height="h-8" className="mx-auto mb-2" />
          </div>
          
          {/* Description skeleton */}
          <div className="mb-2">
            <Skeleton width="w-96" height="h-6" className="mx-auto mb-2" />
          </div>
          
          {/* Booking ID skeleton */}
          <div>
            <Skeleton width="w-48" height="h-4" className="mx-auto" />
          </div>
        </div>

        {/* Booking Summary Card Skeleton */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Header section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <Skeleton width="w-32" height="h-6" className="mb-3" />
            <div className="flex space-x-4">
              <div className="flex items-center space-x-1">
                <Skeleton width="w-12" height="h-4" />
                <Skeleton width="w-16" height="h-4" />
              </div>
              <div className="flex items-center space-x-1">
                <Skeleton width="w-16" height="h-4" />
                <Skeleton width="w-20" height="h-4" />
              </div>
            </div>
          </div>
          
          {/* Items section */}
          <div className="px-6 py-4">
            <div className="space-y-4">
              {/* Booking items skeleton */}
              {[1, 2, 3].map((item, index) => (
                <div key={item} className="flex justify-between items-center">
                  <div className="flex-1">
                    <Skeleton 
                      width="w-2/3" 
                      height="h-5" 
                      className="mb-2"
                    />
                    <Skeleton 
                      width="w-20" 
                      height="h-4"
                    />
                  </div>
                  <div className="ml-4">
                    <Skeleton 
                      width="w-16" 
                      height="h-5"
                    />
                  </div>
                </div>
              ))}
              
              {/* Total section */}
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <Skeleton width="w-12" height="h-5" />
                <Skeleton width="w-20" height="h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton width="w-40" height="h-12" rounded="rounded-md" />
          <Skeleton width="w-40" height="h-12" rounded="rounded-md" />
        </div>
      </div>
    </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8 text-center">
          <div className="flex justify-center">
            <Package className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Booking Retrieval Failed</h1>
          <p className="mt-2 text-gray-600">{fetchError}</p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your payment. Your booking has been confirmed.
          </p>
          {bookingDetails && (
            <p className="mt-2 text-sm text-gray-500">
              Booking #: {bookingDetails._id}
            </p>
          )}
        </div>

        {/* Booking Summary */}
        {bookingDetails && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Booking Summary</h2>
              <div className="mt-1 flex space-x-4 text-sm text-gray-500">
                <span>Status: 
                  <span className={`ml-1 font-medium ${
                    bookingDetails.status === 'Approved' ? 'text-green-600' : 
                    bookingDetails.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {bookingDetails.status}
                  </span>
                </span>
                <span>Payment: 
                  <span className={`ml-1 font-medium ${
                    bookingDetails.paymentStatus === 'Completed' ? 'text-green-600' : 
                    bookingDetails.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {bookingDetails.paymentStatus}
                  </span>
                </span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {bookingDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    ₹{bookingDetails.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <Link
            href="/users/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}