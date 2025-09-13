'use client';

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const Skeleton = ({ className = "", width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
);

const CheckoutForm = ({ 
  clientSecret, 
  totalAmount, 
  cartItems 
}: { 
  clientSecret: string; 
  totalAmount: number;
  cartItems: any[];
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!stripe) return;

    const checkStatus = async () => {
      const { error } = await stripe.retrievePaymentIntent(clientSecret);
      
      if (error) {
        setMessage(error.message || "An unexpected error occurred.");
      }
    };

    checkStatus();
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { 
          return_url: `${window.location.origin}/users/payment-success` 
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setMessage(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        
        try {
          // Create booking after successful payment
          const bookingItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }));

          const bookingResponse = await axios.post("/api/users/bookings", { 
            items: bookingItems
          });

          // Update booking with payment information
          if (bookingResponse.data.booking) {
            const bookingId = bookingResponse.data.booking._id;
            
            // Update the booking with payment status
            await axios.patch(`/api/users/bookings/${bookingId}`, {
              paymentStatus: 'Completed',
              status: 'Approved',
              paymentIntentId: paymentIntent.id
            });
          }

          // Clear the cart after successful booking
          await axios.delete("/api/users/cart");

          // Redirect to success page
          router.push(`/users/payment-success?payment_intent=${paymentIntent.id}&booking_id=${bookingResponse.data.booking._id}`);
        } catch (bookingError) {
          console.error("Failed to create booking:", bookingError);
          toast.error("Payment succeeded but failed to create booking. Please contact support.");
          // Still redirect but with error flag
          router.push(`/users/payment-success?payment_intent=${paymentIntent.id}&error=booking_creation`);
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment processing failed");
      setMessage("Payment processing failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Complete Payment</h2>
      
      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3 text-gray-700">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          {cartItems.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          {cartItems.length > 3 && (
            <div className="text-gray-500 text-center">
              +{cartItems.length - 3} more items
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>₹{(totalAmount / 100).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
        
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </span>
          ) : (
            `Pay ₹${(totalAmount / 100).toLocaleString()}`
          )}
        </button>
      </form>
      
      {message && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {message}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Your payment is secured by Stripe
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        
        // First get cart items
        const cartRes = await axios.get("/api/users/cart");
        const items = cartRes.data.items;
        
        if (!items || items.length === 0) {
          toast.error("Your cart is empty");
          router.push("/users/cart");
          return;
        }
        
        setCartItems(items);
        
        const total = items.reduce(
          (sum: number, item: any) => sum + (item.price * item.quantity), 
          0
        );
        
        setTotalAmount(total * 100); // Convert to paise for Stripe
        
        // Then create payment intent
        const intentRes = await axios.post("/api/users/check-out-session", { 
          amount: Math.round(total * 100), // Ensure integer value
          currency: 'inr'
        });
        
        if (!intentRes.data.clientSecret) {
          throw new Error("Failed to get payment client secret");
        }
        
        setClientSecret(intentRes.data.clientSecret);
      } catch (err: any) {
        console.error("Payment setup error:", err);
        const errorMessage = err.response?.data?.error || "Failed to initialize payment";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header skeleton */}
      <div className="mb-6 text-center">
        <Skeleton width="w-48" height="h-8" className="mx-auto" />
      </div>
      
      {/* Order Summary skeleton */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-3">
          <Skeleton width="w-32" height="h-5" />
        </div>
        <div className="space-y-3">
          {/* Cart items skeleton */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between items-center">
              <div className="flex-1">
                <Skeleton width="w-3/4" height="h-4" />
              </div>
              <div className="ml-4">
                <Skeleton width="w-16" height="h-4" />
              </div>
            </div>
          ))}
          
          {/* More items indicator skeleton */}
          <div className="text-center py-1">
            <Skeleton width="w-20" height="h-3" className="mx-auto" />
          </div>
          
          <hr className="my-2" />
          
          {/* Total skeleton */}
          <div className="flex justify-between items-center pt-2">
            <Skeleton width="w-12" height="h-6" />
            <Skeleton width="w-20" height="h-6" />
          </div>
        </div>
      </div>
      
      {/* Payment form skeleton */}
      <div className="space-y-4">
        {/* Payment tabs skeleton */}
        <div className="border rounded-lg p-4">
          <div className="flex space-x-4 mb-4">
            <Skeleton width="w-16" height="h-8" className="rounded-md" />
            <Skeleton width="w-16" height="h-8" className="rounded-md" />
            <Skeleton width="w-16" height="h-8" className="rounded-md" />
          </div>
          
          {/* Payment fields skeleton */}
          <div className="space-y-4">
            <div>
              <Skeleton width="w-24" height="h-4" className="mb-2" />
              <Skeleton width="w-full" height="h-10" className="rounded border" />
            </div>
            
            <div className="flex space-x-3">
              <div className="flex-1">
                <Skeleton width="w-16" height="h-4" className="mb-2" />
                <Skeleton width="w-full" height="h-10" className="rounded border" />
              </div>
              <div className="flex-1">
                <Skeleton width="w-12" height="h-4" className="mb-2" />
                <Skeleton width="w-full" height="h-10" className="rounded border" />
              </div>
            </div>
            
            <div>
              <Skeleton width="w-20" height="h-4" className="mb-2" />
              <Skeleton width="w-full" height="h-10" className="rounded border" />
            </div>
          </div>
        </div>
        
        {/* Payment button skeleton */}
        <Skeleton width="w-full" height="h-12" className="rounded-lg bg-gray-300" />
      </div>
      
      {/* Security text skeleton */}
      <div className="mt-4 text-center">
        <Skeleton width="w-40" height="h-3" className="mx-auto" />
      </div>
    </div>
      </div>
    </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Setup Failed</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/users/cart")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }
  
  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Failed to initialize payment</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#16a34a',
              },
            },
          }}
        >
          <CheckoutForm 
            clientSecret={clientSecret} 
            totalAmount={totalAmount}
            cartItems={cartItems}
          />
        </Elements>
      </div>
    </div>
  );
}