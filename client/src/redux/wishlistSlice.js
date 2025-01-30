import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  wishlist: [], // Make sure wishlist is initialized as an array
  status: "idle",
  error: null,
};

// Fetch wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
  const res = await axios.get("http://localhost:5000/api/buyer/wishlist", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  // Ensure we return an array
  return Array.isArray(res.data) ? res.data : [];
});

// Add product to wishlist
export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (productId) => {
  const res = await axios.post("http://localhost:5000/api/buyer/wishlist/add", { productId }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data; // Ensure res.data is the correct format (typically a single item or an array)
});

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId) => {
  await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return productId;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Make sure to handle the response correctly
        if (Array.isArray(state.wishlist)) {
          state.wishlist.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter((item) => item.productId !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
