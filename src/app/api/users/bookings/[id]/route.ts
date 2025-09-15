// src/app/api/users/bookings/[id]/route.ts

import { connectDB } from '@/lib/db';
import Booking from '@/models/booking';
import User from '@/models/user'; // Add User import to register schema
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface JwtPayload {
  userId: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;
    const {id} = await params
    const bookingId = id;
    
    // Find the booking and ensure it belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, user: userId })
      .populate("user", "name email")
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;
    const {id} = await params
    const bookingId = id;
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
    
    // Populate user data after save
    await booking.populate("user", "name email");
    
    return NextResponse.json({
      message: "Booking updated successfully",
      booking
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: "Invalid update data" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}