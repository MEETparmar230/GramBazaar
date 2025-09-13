import { connectDB } from '@/lib/db';
import Booking from '@/models/booking';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface JwtPayload {
  userId: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    const bookingId = params.id;
    
    // Find the booking and ensure it belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, user: userId })
      .populate("items.productId", "name price");
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking }, { status: 200 });

  } catch (error) {
    console.error("Error fetching booking:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    const bookingId = params.id;
    const updates = await req.json();

    // Find the booking and ensure it belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update allowed fields
    const allowedUpdates = ['paymentStatus', 'status', 'paymentIntentId', 'shippingAddress', 'trackingNumber'];
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        booking[key] = updates[key];
      }
    });

    await booking.save();

    return NextResponse.json({ 
      message: "Booking updated successfully", 
      booking 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating booking:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}