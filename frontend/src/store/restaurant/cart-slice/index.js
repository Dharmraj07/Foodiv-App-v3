import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL (adjust as needed)
const API_URL = "http://localhost:5000/api/restaurant/cart";

// Add an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, menuItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, {
        userId,
        menuItemId,
        quantity,
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
    }
  }
);

// Fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get/${userId}`);
      console.log(response.data.cart);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart items");
    }
  }
);

// Update cart item quantity
export const updateCartItemQty = createAsyncThunk(
  "cart/updateCartItemQty",
  async ({ userId, menuItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/update-cart`, {
        userId,
        menuItemId,
        quantity,
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cart item quantity");
    }
  }
);

// Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, menuItemId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${userId}/${menuItemId}`);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete item from cart");
    }
  }
);

// Utility functions to calculate totals
const calculateTotalPrice = (cart) => {
  return cart.reduce((total, item) => total + item.menuItemId.discountedPrice * item.quantity, 0);
};

const calculateTotalCartItems = (cart) => {
  return cart.length; // Count distinct items
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    totalPrice: 0,
    totalCartItems: 0,
    cartId:null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.cart = [];
      state.totalPrice = 0;
      state.totalCartItems = 0;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.items;
        state.totalPrice = calculateTotalPrice(state.cart);
        state.totalCartItems = calculateTotalCartItems(state.cart);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.items;
        state.cartId=action.payload._id;
        state.totalPrice = calculateTotalPrice(state.cart);
        state.totalCartItems = calculateTotalCartItems(state.cart);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemQty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.items;
        state.totalPrice = calculateTotalPrice(state.cart);
        state.totalCartItems = calculateTotalCartItems(state.cart);
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.items;
        state.totalPrice = calculateTotalPrice(state.cart);
        state.totalCartItems = calculateTotalCartItems(state.cart);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;
