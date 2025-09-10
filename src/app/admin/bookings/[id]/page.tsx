"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [booking, setBooking] = useState<BookingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [status, setStatus] = useState<string>("Pending");
  const [cancellationReason, setCancellationReason] = useState<string>("");

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/api/admin/bookings/${bookingId}`);
        setBooking(res.data);

        if (res.data.status) setStatus(res.data.status);
        if (res.data.cancellationReason)
          setCancellationReason(res.data.cancellationReason);
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
      toast.error(
        axiosError.response?.data?.error || "Failed to update status"
      );
    } finally {
      setUpdating(false);
    }
  };

  const statusVariant = (status?: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Approved":
        return "default";
      case "Rejected":
      case "Cancelled":
        return "destructive";
      case "Completed":
        return "outline";
      default:
        return "secondary";
    }
  };

    if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!booking) return <p className="p-4">Booking not found.</p>;

  return (
    <div className="py-6 px-2 max-w-3xl mx-auto space-y-6 ">
      <h1 className="md:text-3xl text-2xl font-bold text-zinc-800">Booking Details</h1>
 
    <div className="bg-white rounded-lg p-2 ring-2 ring-green-200">
      {/* Customer Info */}
      {/* Customer Info */}
<Card className="border-0 rounded-none">
  <CardContent>
    <div className="flex items-center justify-between">
      <span className="font-bold w-32  text-zinc-700">Customer</span>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <p className="font-medium">{booking.user?.name || "User Deleted"}</p>
        <p className="text-muted-foreground">{booking.user?.email || "N/A"}</p>
      </div>
    </div>
  </CardContent>
</Card>


      {/* Items */}
      <Card className="border-0 rounded-none">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-1">
            {booking.items.map((item) => (
              <li key={item._id}>
                {item.quantity} × {item.name} (₹{item.price})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Payment */}
<Card className="border-none rounded-none">
  <CardContent className="space-y-2">
    <div className="flex justify-start gap-5">
      <span className="font-semibold text-zinc-700 ">Payment Status :</span>
      <Badge variant="outline">{booking.paymentStatus || "N/A"}</Badge>
    </div>
    <div className="flex justify-start gap-5">
      <span className="font-semibold text-zinc-700">Total Amount :</span>
      <span className="font-semibold">₹{booking.totalAmount || 0}</span>
    </div>
  </CardContent>
</Card>



      {/* Shipping */}
      {booking.shippingAddress && (
        <Card className="border-none rounded-none">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{booking.shippingAddress.address}</p>
            <p>
              {booking.shippingAddress.city}, {booking.shippingAddress.state} -{" "}
              {booking.shippingAddress.pincode}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status */}
<Card className="border-none rounded-none">
  <CardContent>
    <div className="flex items-center justify-between mb-4">
      <span className="font-bold w-32 text-lg text-zinc-700">Current Status</span>
      <Badge variant={statusVariant(booking.status)}>
        {booking.status || "Pending"}
      </Badge>
    </div>

    {/* Update Section */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
      <Select
        value={status}
        onValueChange={(val) => setStatus(val)}
      >
        <SelectTrigger className="w-48 mt-2">
          <SelectValue placeholder="Select status " />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {status === "Cancelled" && (
        <Textarea
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          placeholder="Enter reason for cancellation"
          className="sm:w-96 my-2 md:my-0"
        />
      )}

      <Button
        onClick={handleStatusUpdate}
        disabled={updating || status === booking.status}
        variant={"my"}
        className="mt-2"
      >
        {updating ? "Updating..." : "Update Status"}
      </Button>
    </div>

    {/* Saved cancellation reason */}
    {booking.status === "Cancelled" && booking.cancellationReason && (
      <div className="bg-muted p-3 rounded">
        <h3 className="font-semibold mb-1">Cancellation Reason:</h3>
        <p className="text-sm">{booking.cancellationReason}</p>
      </div>
    )}
  </CardContent>
</Card>

      </div>
    </div>
  );
}
