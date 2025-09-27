'use client'

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface BookingItem {
  name: string;
  price: number;
  quantity: number;
}

interface Booking {
  _id: string;
  items: BookingItem[];
}

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
};

// fetch bookings
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async () => {
    const res = await axios.get("/api/users/bookings");
    return res.data.bookings;
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load bookings.";
      });
  },
});

export const { clearBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer;
