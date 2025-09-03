import { connectDB } from "@/lib/db";
import Booking from "@/models/booking";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

const validStatuses = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"] as const;

type BookingStatus = (typeof validStatuses)[number];

interface UpdateData {
  status: BookingStatus;
  cancellationReason?: string;
}

// ✅ PATCH: Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { status, cancellationReason }: UpdateData = await request.json();

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: UpdateData = { status };
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const booking = await Booking.findById(params.id)
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
