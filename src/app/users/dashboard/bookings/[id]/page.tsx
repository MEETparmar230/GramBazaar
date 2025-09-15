"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import EmbeddedCheckoutWrapper from "@/components/EmbeddedCheckout";

interface BookingItem {
  name: string;
  price: number;
  quantity: number;
}

interface Booking {
  _id: string;
  items: BookingItem[];
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function BookingDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`/api/users/bookings/${id}`);
      setBooking(res.data.booking || res.data);
    } catch (err) {
      console.error("Error fetching booking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  // Handle Stripe checkout session confirmation
  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (session_id && !processingPayment) {
      setProcessingPayment(true);
      
      axios
        .post("/api/stripe/confirm", { session_id, bookingId: id })
        .then(async (res) => {
          console.log("✅ Payment confirmed:", res.data);
          
          // Refresh booking data
          await fetchBooking();
          
          // Redirect to success page after a short delay
          setTimeout(() => {
            router.push(`/users/payment-success?booking_id=${id}&payment_intent=${session_id}`);
          }, 1000);
        })
        .catch((err) => {
          console.error("❌ Confirm failed:", err);
          setProcessingPayment(false);
        });
    }
  }, [id, searchParams, router, processingPayment]);

  // Show processing state when confirming payment
  if (processingPayment) {
    return (
      <div className="max-w-2xl md:mx-auto mx-2 mt-10 bg-white shadow rounded-xl ring-2 ring-green-200 mb-6">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl md:mx-auto mx-2 md:my-10 my-4 bg-white shadow rounded-xl ring-2 ring-green-200">
        <div className="p-6">
          <div className="mb-4 h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse w-60 rounded"></div>
          <div className="mb-2 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse w-48 rounded"></div>
          <div className="mb-2 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse w-32 rounded"></div>
          <div className="mb-4 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse w-28 rounded"></div>
          
          <ul className="divide-y divide-gray-100 mb-4">
            {[1, 2, 3].map((item) => (
              <li key={item} className="flex justify-between py-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse w-32 rounded"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse w-20 rounded"></div>
              </li>
            ))}
          </ul>
          
          <div className="text-right mb-4">
            <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-pulse w-24 rounded ml-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return <p className="text-center text-2xl font-bold my-20">Booking not found.</p>;
  }

  return (
    <div className="max-w-2xl md:mx-auto mx-2 md:my-10 my-4 bg-white shadow rounded-xl ring-2 ring-green-200  ">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Booking Details</h1>
        <p className="text-gray-500 mb-2">Booking ID: {booking._id}</p>
        <p className="text-gray-500 mb-2">
          Date: {new Date(booking.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500 mb-4">
          Status: <span className="font-semibold">{booking.status}</span> | 
          Payment: <span className={`font-semibold ml-1 ${
            booking.paymentStatus === 'Completed' ? 'text-green-600' : 
            booking.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {booking.paymentStatus}
          </span>
        </p>
        
        <ul className="divide-y divide-gray-100 mb-4">
          {booking.items.map((item, idx) => (
            <li key={idx} className="flex justify-between py-2">
              <span>{item.name}</span>
              <span>
                ₹{item.price} × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
        
        <p className="text-right font-semibold mb-4">
          Total: ₹
          {booking.items.reduce((t, i) => t + i.price * i.quantity, 0)}
        </p>
      </div>
      
      {/* Only show checkout if payment is still pending/failed */}
      {["Pending", "Failed"].includes(booking.paymentStatus) && (
        <div className="rounded-xl overflow-hidden">
          <EmbeddedCheckoutWrapper bookingId={booking._id} />
        </div>
      )}
      
      {booking.paymentStatus === 'Completed' && (
        <div className="pb-6">
        <div className="mx-6 p-6 bg-green-50 border border-green-200 rounded-xl ">
          <div className="flex items-center">
            <div className="text-green-500 text-2xl mr-3">✅</div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Payment Completed!</h3>
              <p className="text-green-600">Your booking has been confirmed and payment processed successfully.</p>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}