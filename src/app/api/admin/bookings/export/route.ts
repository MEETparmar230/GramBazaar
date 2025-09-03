// app/api/admin/bookings/export/route.ts
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking";
import User from "@/models/user"; // ✅ Register User schema
import { NextResponse } from "next/server";

interface BookingItem {
  name: string;
  price: number;
  quantity: number;
}

export async function GET(request: Request) {
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
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Convert to CSV
    const csvData: (string | number)[][] = [];

    // Headers
    csvData.push([
      "Booking ID",
      "Customer",
      "Email",
      "Items",
      "Total Amount",
      "Status",
      "Date",
      "Payment Status",
    ]);

    // Rows
    bookings.forEach((booking) => {
      const itemsString = (booking.items as BookingItem[])
        .map(
          (item) => `${item.quantity} × ${item.name} (₹${item.price})`
        )
        .join("; ");

      csvData.push([
        booking._id.toString(),
        booking.user?.name || "User Deleted",
        booking.user?.email || "N/A",
        itemsString,
        `₹${booking.totalAmount}`,
        booking.status,
        new Date(booking.createdAt).toLocaleDateString("en-IN"),
        booking.paymentStatus,
      ]);
    });

    // Convert to CSV string
    const csvContent = csvData
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create response
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="bookings.csv"',
      },
    });
  } catch (error) {
    console.error("Error exporting bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
