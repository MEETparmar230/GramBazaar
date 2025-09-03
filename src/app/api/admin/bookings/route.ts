// app/api/admin/bookings/route.ts
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking";
import User from "@/models/user"; // ✅ Import User model so it gets registered
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Build filter object
    const filter: Record<string, any> = {};
    if (status && status !== "All") {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email") // ✅ Works now, User schema registered
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: "No bookings found" }, { status: 404 });
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (err) {
    console.error("Internal server error while fetching Bookings:", err);
    return NextResponse.json(
      { message: "Internal server error, unable to fetch Bookings" },
      { status: 500 }
    );
  }
}
