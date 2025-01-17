import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API
const API_URL = "http://localhost:5000/api/restaurant/addresses";

// Thunks for async operations

// Add a new address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, addressData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to add address.");
    }
  }
);

// Fetch all addresses for a user
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to fetch addresses.");
    }
  }
);

// Edit an address
export const editAddress = createAsyncThunk(
  "address/editAddress",
  async ({ userId, addressId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/update/${userId}/${addressId}`, updatedData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to update address.");
    }
  }
);

// Delete an address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${userId}/${addressId}`);
      return { addressId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to delete address.");
    }
  }
);

// Initial state
const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

// Slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Address
      .addCase(editAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex((addr) => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter((addr) => addr._id !== action.payload.addressId);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;
