  import { NextResponse } from "next/server";
  import Stripe from "stripe";
  import Booking from "@/models/booking";
  import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

  export interface BookingItem {
  name: string;
  price: number;
  quantity: number;
  productId: Types.ObjectId;
}

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      await connectDB();
      
      // Get bookingId from URL params
      const { id: bookingId } = await params;
      
      if (!bookingId) {
        return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
      }

      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",
        payment_method_types: ["card"],
        line_items: booking.items.map((item: BookingItem) => ({
          price_data: {
            currency: "inr",
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/dashboard/bookings/${bookingId}?session_id={CHECKOUT_SESSION_ID}`,
      });

      return NextResponse.json({ clientSecret: session.client_secret });
    } catch (err: unknown) {
      console.error("Stripe error:", err);
      const errorMessage = err instanceof Error ? err.message:"An unexpected error occurred"
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }