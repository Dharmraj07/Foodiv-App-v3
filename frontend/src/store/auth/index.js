import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  isOtpSent: false,
  otpError: null,
  passwordResetSuccess: false,
  passwordChangeSuccess: false,
};

// Thunks for async operations
export const registerUser = createAsyncThunk("auth/register", async (formData) => {
  const response = await axios.post(`${API_URL}/register`, formData, { withCredentials: true });
  return response.data;
});

export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  const response = await axios.post(`${API_URL}/login`, formData, { withCredentials: true });
  return response.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await axios.get(`${API_URL}/check-auth`, {
    withCredentials: true,
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
  });
  return response.data;
});

export const editUserProfile = createAsyncThunk("auth/editProfile", async (formData) => {
  const response = await axios.put(`${API_URL}/edit-profile`, formData, { withCredentials: true });
  return response.data;
});

export const changePassword = createAsyncThunk("auth/changePassword", async (formData) => {
  const response = await axios.put(`${API_URL}/change-password`, formData, { withCredentials: true });
  return response.data;
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (formData) => {
  const response = await axios.post(`${API_URL}/forgot-password`, formData);
  return response.data;
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (formData) => {
  const response = await axios.post(`${API_URL}/reset-password`, formData);
  return response.data;
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.isOtpSent = false;
      state.otpError = null;
      state.passwordResetSuccess = false;
      state.passwordChangeSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null; // Registration doesn't log in the user
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
      })
      // Edit Profile
      .addCase(editUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
        }
      })
      .addCase(editUserProfile.rejected, (state) => {
        state.isLoading = false;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordChangeSuccess = action.payload.success;
      })
      .addCase(changePassword.rejected, (state) => {
        state.isLoading = false;
        state.passwordChangeSuccess = false;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isOtpSent = false;
        state.otpError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOtpSent = action.payload.success;
        state.otpError = action.payload.success ? null : action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isOtpSent = false;
        state.otpError = action.error.message;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetSuccess = action.payload.success;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
        state.passwordResetSuccess = false;
      });
  },
});

// Actions and Reducer
export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
