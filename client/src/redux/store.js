import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';  // Import your reducers
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
