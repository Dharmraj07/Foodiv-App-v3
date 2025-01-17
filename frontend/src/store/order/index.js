import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/restaurant/orders";

// Async Thunks

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Capture payment for an order
export const capturePayment = createAsyncThunk(
  "orders/capturePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/capture`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all orders by a specific user
export const getAllOrdersByUser = createAsyncThunk(
  "orders/getAllOrdersByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/list/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get details of a specific order
export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/details/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.orders = [];
      state.orderDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.push(action.payload.order);
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Capture Payment
    builder.addCase(capturePayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(capturePayment.fulfilled, (state, action) => {
      state.loading = false;
      const updatedOrder = action.payload.order;
      const orderIndex = state.orders.findIndex((o) => o._id === updatedOrder._id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = updatedOrder;
      }
    });
    builder.addCase(capturePayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get All Orders by User
    builder.addCase(getAllOrdersByUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllOrdersByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(getAllOrdersByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Order Details
    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    });
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
