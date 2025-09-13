"use client";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function EmbeddedCheckoutWrapper({ bookingId }: { bookingId: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fixed API endpoint - matches your actual route
        const { data } = await axios.post(`/api/users/bookings/${bookingId}/create-checkout-session`);
        
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creating session:", err);
        setError(err.response?.data?.error || "Failed to create checkout session");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      createSession();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Unable to load payment form</p>
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <div className="shadow-md">
        <EmbeddedCheckout />
      </div>
    </EmbeddedCheckoutProvider>
  );
}