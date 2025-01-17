import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/admin/menuitem';

// Utility to handle API requests
const handleApiError = (error) => {
  return error.response?.data?.message || error.message || 'An error occurred';
};

// // Async Thunks
// export const fetchMenuItems = createAsyncThunk(
//   'menu/fetchMenuItems',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${BASE_URL}/get?search=gulab&category=Desserts&sort=low-to-high&page=1&limit=6`);
//       return data.data;
//     } catch (error) {
//       return rejectWithValue(handleApiError(error));
//     }
//   }
// );

// Async Thunks
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async ({ search = '', category = '', sort = '', page = 1, limit = 6 }, { rejectWithValue }) => {
    const url = `${BASE_URL}/get?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=${limit}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);


export const addMenuItem = createAsyncThunk(
  'menu/addMenuItem',
  async (menuItemData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(menuItemData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const { data } = await axios.post(`${BASE_URL}/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editMenuItem = createAsyncThunk(
  'menu/editMenuItem',
  async ({id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/edit/${id}`, updatedData);
      return data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Slice
const menuItemSlice = createSlice({
  name: 'menu',
  initialState: {
    menuItems: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    pagination:{
      totalItems:0,
      totalPages:1,
      currentPage:1


    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Menu Items
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.menuItems = action.payload.data;
        state.pagination=action.payload.pagination;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add Menu Item
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.menuItems.push(action.payload);
      })
      .addCase(addMenuItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Edit Menu Item
      .addCase(editMenuItem.fulfilled, (state, action) => {
        const index = state.menuItems.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.menuItems[index] = action.payload;
        }
      })
      .addCase(editMenuItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Menu Item
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.menuItems = state.menuItems.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default menuItemSlice.reducer;
