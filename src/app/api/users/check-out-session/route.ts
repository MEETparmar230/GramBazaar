import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil", // Always specify the API version
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "inr" } = await req.json();

    // Validate amount
    if (!amount || amount < 50) { // Minimum amount for Stripe is 50 INR
      return NextResponse.json(
        { error: "Invalid amount. Minimum payment is 0.50 INR" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is an integer
      currency: currency.toLowerCase(),
      payment_method_types: ["card"],
      metadata: {
        // Add any metadata you need for your application
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create payment intent" }, 
      { status: 500 }
    );
  }
}