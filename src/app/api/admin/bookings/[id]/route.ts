// app/api/admin/bookings/[id]/route.ts
import { connectDB } from "@/lib/db";
import Booking from '@/models/booking';
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const booking = await Booking.findById(id)
      .populate('user', 'name email');
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}