"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface BookingItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface BookingType {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  items: BookingItem[];
  createdAt: string;
  updatedAt: string;
  status?: string;
  cancellationReason?: string;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus?: string;
  totalAmount?: number;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId =
    typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [booking, setBooking] = useState<BookingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // local state for status update
  const [status, setStatus] = useState<string>("Pending");
  const [cancellationReason, setCancellationReason] = useState<string>("");

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/api/admin/bookings/${bookingId}`);
        setBooking(res.data);

        if (res.data.status) setStatus(res.data.status);
        if (res.data.cancellationReason) setCancellationReason(res.data.cancellationReason);
      } catch (err) {
        console.error("Error fetching booking:", err);
        toast.error("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleStatusUpdate = async () => {
    if (!booking) return;

    if (status === "Cancelled" && !cancellationReason.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }

    try {
      setUpdating(true);
      const res = await axios.patch(`/api/admin/bookings/${booking._id}`, {
        status,
        cancellationReason: status === "Cancelled" ? cancellationReason : undefined,
      });
      setBooking(res.data);
      toast.success("Status updated successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      console.error("Error updating status:", axiosError);
      toast.error(axiosError.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-4">Loading booking...</p>;
  if (!booking) return <p className="p-4">Booking not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Booking Details</h1>

      {/* Customer */}
      <div className="mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold">Customer</h2>
        <p>{booking.user?.name || "User Deleted"}</p>
        <p>{booking.user?.email || "N/A"}</p>
      </div>

      {/* Items */}
      <div className="mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold">Items</h2>
        <ul className="list-disc ml-6">
          {booking.items.map((item) => (
            <li key={item._id}>
              {item.quantity} × {item.name} (₹{item.price})
            </li>
          ))}
        </ul>
      </div>

      {/* Payment & total */}
      <div className="mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold">Payment</h2>
        <p>Status: {booking.paymentStatus || "N/A"}</p>
        <p>Total: ₹{booking.totalAmount || 0}</p>
      </div>

      {/* Shipping address */}
      {booking.shippingAddress && (
        <div className="mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <p>{booking.shippingAddress.address}</p>
          <p>
            {booking.shippingAddress.city}, {booking.shippingAddress.state} -{" "}
            {booking.shippingAddress.pincode}
          </p>
        </div>
      )}

      {/* Current status */}
      <div className="mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold">Current Status</h2>
        <p>{booking.status || "Pending"}</p>
      </div>

      {/* Status update section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Update Status</h2>
        <div className="flex space-x-2 mb-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || status === booking.status}
            className={`px-4 py-2 rounded text-white ${
              updating || status === booking.status
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>

        {status === "Cancelled" && (
          <div>
            <label className="block font-medium mb-1">Cancellation Reason</label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter reason for cancellation"
            />
          </div>
        )}
      </div>

      {/* Saved cancellation reason */}
      {booking.status === "Cancelled" && booking.cancellationReason && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <h3 className="font-semibold">Cancellation Reason:</h3>
          <p>{booking.cancellationReason}</p>
        </div>
      )}
    </div>
  );
}
