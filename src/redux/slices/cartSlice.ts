'use client';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItemType } from '@/lib/validations/cart';

interface CartState {
  items: CartItemType[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await axios.get('/api/users/cart');
  return res.data.items as CartItemType[];
});

// Async thunk to update quantity with backend sync
export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    await axios.patch('/api/users/cart', { productId, quantity });
    // Return the updated values for local state update
    return { productId, quantity };
  }
);

// Async thunk to remove item with backend sync
export const removeItemAsync = createAsyncThunk(
  'cart/removeItem',
  async (productId: string) => {
    await axios.delete(`/api/users/cart/${productId}`);
    return productId;
  }
);

// Async thunk to clear cart with backend sync
export const clearCartAsync = createAsyncThunk('cart/clearCart', async () => {
  await axios.delete('/api/users/cart');
  return [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItemType[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<CartItemType>) => {
      state.items.push(action.payload);
    },
    // Keep these for immediate local updates if needed
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load cart';
      })
      // Update quantity
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.quantity = quantity;
      })
      .addCase(updateQuantityAsync.rejected, (state) => {
        state.error = 'Failed to update quantity';
      })
      // Remove item
      .addCase(removeItemAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      })
      .addCase(removeItemAsync.rejected, (state) => {
        state.error = 'Failed to remove item';
      })
      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearCartAsync.rejected, (state) => {
        state.error = 'Failed to clear cart';
      });
  },
});

export const { setCartItems, addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;