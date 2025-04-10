import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  wishlist: [],
  status: "idle",
  error: null,
};

// Fetch wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
  const res = await axios.get("https://freshnz.onrender.com/api/buyer/wishlist", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data.products || []; // Return an array of products
});

// Add product to wishlist
// Add product to wishlist
export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (productId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await axios.post(
    "http://localhost:5000/api/buyer/wishlist/add",
    { productId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data; // The response should contain the updated wishlist or the added product
});



// Remove from wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId) => {
  if (!productId) throw new Error("Product ID is missing");

  await axios.delete(`https://freshnz.onrender.com/api/buyer/wishlist/remove/${productId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return productId; // Return productId to update the state correctly
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
        if (Array.isArray(state.wishlist)) {
          // Add the newly added product to the wishlist
          state.wishlist.push(action.payload); // Assuming the payload contains the added product or the updated wishlist
        } else {
          state.wishlist = [action.payload];
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter((item) => item.productId._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
