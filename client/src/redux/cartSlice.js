import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cart: [], // Ensure initial state is always an array
  status: "idle",
  error: null,
};

// Fetch cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get("https://freshnz.onrender.com/api/buyer/cart", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return Array.isArray(res.data.products) ? res.data.products : []; // Safeguard for non-array data
});

// Add product to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (product) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await axios.post("https://freshnz.onrender.com/api/buyer/cart/add", product, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; // Ensure response is a single cart item
});

// Remove from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId) => {
  await axios.delete(`https://freshnz.onrender.com/api/buyer/cart/remove/${productId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return productId;
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        // Ensure cart is an array
        state.cart = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Ensure cart is always an array and add the new product
        if (Array.isArray(state.cart)) {
          state.cart.push(action.payload);
        } else {
          state.cart = [action.payload];
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // Remove product based on the productId
        state.cart = state.cart.filter((item) => item.productId !== action.payload);
      });
  },
});

export default cartSlice.reducer;
