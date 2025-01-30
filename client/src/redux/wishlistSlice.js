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
  // Ensure we return an array of products or an empty array
  return Array.isArray(res.data.products) ? res.data.products : [];
});

// Add product to wishlist
export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (productId) => {
  const res = await axios.post("http://localhost:5000/api/buyer/wishlist/add", { productId }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  // Ensure res.data contains the added product information
  return res.data.product || {}; // Assuming the response has a 'product' key
});

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId) => {
  await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return productId; // Return productId to remove from state
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling the fetching of the wishlist
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = Array.isArray(action.payload) ? action.payload : [];
      })
      // Handling the addition of a product to the wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (action.payload && action.payload.productId) {
          state.wishlist.push(action.payload); // Add the product to wishlist
        }
      })
      // Handling the removal of a product from the wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter((item) => item.productId !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
