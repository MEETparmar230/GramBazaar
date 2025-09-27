import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ServiceType {
    _id: string;
    name: string;
    imageId: string;
}

interface ServiceState {
    services: ServiceType[],
    loading: boolean,
    error: string | null
}

const initialState: ServiceState = {
    services: [],
    loading: true,
    error: null
}

export const fetchServices = createAsyncThunk("services/fetch", async () => {
    const res = await axios.get("/api/services")
    return res.data as ServiceType[]
})

export const removeService = createAsyncThunk("/services/remove", async (id: string) => {
    const res = await axios.delete(`/api/admin/services/${id}`)
    return id
})

const servicesSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        removeServiceLocal: (state, action: PayloadAction<string>) => {
            state.services = state.services.filter(s => s._id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchServices.fulfilled, (state, action: PayloadAction<ServiceType[]>) => {
                state.loading = false
                state.services = action.payload
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch services";
            })
            .addCase(removeService.fulfilled, (state, action) => {
                state.services = state.services.filter((s) => s._id !== action.payload);
            })
            .addCase(removeService.rejected, (state) => {
                state.error = 'Failed to remove service';
            })
    },
})

export const {removeServiceLocal,clearError} = servicesSlice.actions
export default servicesSlice.reducer