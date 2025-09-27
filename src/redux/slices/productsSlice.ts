// redux/slices/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  price: number;
  imageId: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: true,
  error: null,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const response = await axios.get("/api/product");
  return response.data as Product[];
});

export const removeProduct = createAsyncThunk("/product/delete", async (id: string) => {
  try{
  const res = await axios.delete(`/api/admin/product/${id}`)
  return id
  }
  catch(err:unknown){
    let message = null
    if(err instanceof Error){message=err.message}
    else if(axios.isAxiosError(err)){message=err.response?.data?.message}
    else{message="failed to remove product"}
    throw new Error(message)
  }
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    removeProductLocal: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload)
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
    .addCase(removeProduct.rejected, (state, action) => {
      state.error = typeof action.payload === 'string' ? action.payload : action.error.message  || 'Failed to remove product';
    })
},
});


export const {removeProductLocal,clearError} = productsSlice.actions
export default productsSlice.reducer;
