import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil", 
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "inr" } = await req.json();

    // Validate amount
    if (!amount || amount < 30) { 
      return NextResponse.json(
        { error: "Invalid amount. Minimum payment is 0.50 INR" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), 
      currency: currency.toLowerCase(),
      payment_method_types: ["card"],
      metadata: {
        
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err: unknown) {
    console.error("Stripe error:", err);
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
    return NextResponse.json(
      { error: errorMessage || "Failed to create payment intent" }, 
      { status: 500 }
    );
  }
}