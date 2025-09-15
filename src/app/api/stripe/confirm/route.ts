// /api/stripe/confirm/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import Booking from "@/models/booking";
import { connectDB } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { session_id, bookingId } = await req.json();
    
    if (!session_id || !bookingId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      // Update booking status in database
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'Completed',
        status: 'Approved', // or whatever status you want
        stripeSessionId: session_id,
        paidAt: new Date()
      });

      return NextResponse.json({ 
        success: true, 
        paymentStatus: 'completed',
        message: 'Payment confirmed and booking updated' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        paymentStatus: session.payment_status,
        message: 'Payment not completed' 
      }, { status: 400 });
    }
    
  }  catch (error: unknown) {
    console.error("Payment confirmation error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}