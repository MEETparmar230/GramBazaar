import { configureStore } from '@reduxjs/toolkit'
import cartSclice from '@/redux/slices/cartSlice'
import userSlice from '@/redux/slices/userSlice'
import bookingsSlice from '@/redux/slices/bookingsSlice'
import bookingSlice from '@/redux/slices/bookingSlice'
import productsSlice from '@/redux/slices/productsSlice'
import servicesSlice from '@/redux/slices/servicesSlice'
import newsSlice from '@/redux/slices/newsSlice'


export const store = configureStore({
  reducer: {
    cart:cartSclice,
    user: userSlice,
    bookings: bookingsSlice,
    booking:bookingSlice,
    products:productsSlice,
    services:servicesSlice,
    news:newsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch