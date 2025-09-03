import { connectDB } from "@/lib/db";
import Booking from "@/models/booking";
import User from "@/models/user"; // ✅ Needed for populate("user")
import { NextResponse } from "next/server";

const validStatuses = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];

// ✅ PATCH: Update booking status
export async function PATCH(
  request: Request,
  context: { params: { id: string } } // <-- FIXED signature
) {
  try {
    await connectDB();

    const { id } = context.params;
    const { status, cancellationReason } = await request.json();

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: Record<string, any> = { status };
    if (status === "Cancelled" && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    const booking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("user", "name email");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ GET: Fetch single booking
export async function GET(
  request: Request,
  context: { params: { id: string } } // <-- FIXED signature
) {
  try {
    await connectDB();

    const booking = await Booking.findById(context.params.id)
      .populate("user", "name email")
      .populate("items.productId");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}
