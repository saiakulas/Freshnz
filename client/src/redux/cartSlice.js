import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cart: [], // ✅ Ensure initial state is always an array
  status: "idle",
  error: null,
};

// Fetch cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get("http://localhost:5000/api/buyer/cart", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data.products || []; // Return the 'products' array from the response
});

// Add product to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (product) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await axios.post("http://localhost:5000/api/buyer/cart/add", product, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; // Ensure response is a single cart item
});

// Remove from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId) => {
  await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
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
        state.cart = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure state.cart is an array
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (Array.isArray(state.cart)) {
          state.cart.push(action.payload); // ✅ Ensure push works only if state.cart is an array
        } else {
          state.cart = [action.payload]; // ✅ Convert to array if it's not
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = state.cart.filter((item) => item.productId !== action.payload);
      });
  },
});

export default cartSlice.reducer;
