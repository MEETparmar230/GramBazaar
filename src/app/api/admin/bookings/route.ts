import { connectDB } from "@/lib/db";
import Booking from '@/models/booking'
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDB();
        const bookings = await Booking.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: 'No bookings found' }, { status: 404 });
    }

    return NextResponse.json(bookings, { status: 200 });
  }
    catch(err){
        console.error("Internal server error while fetching Bookings",err)
        return NextResponse.json({message:"Internal server error, unable to fetch Bookings"},{status:500})
    }
}