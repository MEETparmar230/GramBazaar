'use client'

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface BookingItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  _id: string;
  items: BookingItem[];
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface BookingState {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
  processingPayment: boolean;
}

const initialState: BookingState = {
  booking: null,
  loading: false,
  error: null,
  processingPayment: false,
};

// Fetch booking by id
export const fetchBooking = createAsyncThunk(
  "booking/fetchBooking",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/users/bookings/${id}`);
      return res.data.booking;
    } catch (err: unknown) {
      let message = "Payment confirmation failed"
      if(err instanceof Error){message=err.message}
      else if(axios.isAxiosError(err)){message=err.response?.data?.error}
      return rejectWithValue(message|| "Failed to fetch booking");
    }
  }
);

// Confirm Stripe payment
export const confirmPayment = createAsyncThunk(
  "booking/confirmPayment",
  async ({ session_id, bookingId }: { session_id: string, bookingId: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/stripe/confirm", { session_id, bookingId });
      return res.data;
    } catch (err: unknown) {
      let message = "Payment confirmation failed"
      if(err instanceof Error){message=err.message}
      else if(axios.isAxiosError(err)){message=err.response?.data?.error}
      return rejectWithValue(message|| "Payment confirmation failed");
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.booking = null;
      state.loading = false;
      state.error = null;
      state.processingPayment = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.booking = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.processingPayment = true;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.processingPayment = false;
        // After payment confirmed, update booking
        if (state.booking) {
          state.booking.paymentStatus = "Completed";
          state.booking.status = "Confirmed";
        }
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.processingPayment = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
