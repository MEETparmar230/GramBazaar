// app/admin/bookings/page.tsx
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";



interface BookingItem {
  name: string;
  price: number;
  quantity: number;
  _id: string;
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
  status: string;
  totalAmount: number;
  paymentStatus: string;
}

const statusOptions = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
  "Cancelled",
];

export default function AllBookings() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((booking) => booking.status === selectedStatus)
      );
    }
  }, [bookings, selectedStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error while fetching bookings", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/admin/bookings/${bookingId}`, {
        status: newStatus,
      });
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking status", err);
      setError("Failed to update booking status");
    }
  };

  const exportBookings = async () => {
    try {
      const response = await axios.get(
        `/api/admin/bookings/export?status=${selectedStatus}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `bookings-${selectedStatus}-${new Date()
          .toISOString()
          .split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting bookings", err);
      setError("Failed to export bookings");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center font-medium">{error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>

      {/* Filters + Actions */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label htmlFor="status-filter" className="mr-2 font-medium">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded p-2"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportBookings}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Booking ID</th>
                <th className="py-2 px-4 border">Customer</th>
                <th className="py-2 px-4 border">Items</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Payment</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border font-mono text-sm">
                    {booking._id.substring(0, 8)}...
                  </td>
                  <td className="py-2 px-4 border">
                    {booking.user ? (
                      <>
                        <div>{booking.user.name}</div>
                        <div className="text-sm text-gray-600">
                          {booking.user.email}
                        </div>
                      </>
                    ) : (
                      <div className="text-red-500 text-sm">User deleted</div>
                    )}
                  </td>
                  <td className="py-2 px-4 border text-sm">
                    {booking.items.map((item) => (
                      <div key={item._id}>
                        {item.quantity} × {item.name} (₹{item.price})
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border font-semibold">
                    ₹{booking.totalAmount}
                  </td>
                  <td className="py-2 px-4 border">{formatDate(booking.createdAt)}</td>
                  <td className="py-2 px-4 border">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateBookingStatus(booking._id, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      {statusOptions
                        .filter((s) => s !== "All")
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="py-2 px-4 border">{booking.paymentStatus}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => router.push(`/admin/bookings/${booking._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
