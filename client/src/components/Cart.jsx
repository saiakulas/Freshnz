import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../redux/cartSlice";
import axios from "axios"; // For API calls

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const status = useSelector((state) => state.cart.status);

  const BASE_URL = "http://localhost:5000/api/buyer"; // Backend base URL

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, status]);

  // Function to get token from localStorage or another store
  const getAuthToken = () => {
    return localStorage.getItem("authToken"); // Replace with where your token is stored
  };

  // Add token to request headers
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Increment product quantity
  const incrementQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/buyer/cart/increment/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchCart()); // Refetch the cart after incrementing
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle expired token or unauthorized error
        console.error("Unauthorized access. Please log in again.");
        // Redirect to login page or show login prompt
      } else {
        console.error("Error incrementing quantity:", error);
      }
    }
  };
  

  const decrementQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/buyer/cart/decrement/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // Make sure token is included in the headers
        }
      );
  
      dispatch(fetchCart()); // Refetch the cart after decrementing the quantity
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access. Please log in again.");
        // Handle expired or invalid token here, maybe redirect to the login page
      } else {
        console.error("Error decrementing quantity:", error);
      }
    }
  };
  

  // Handle API errors
  if (status === "failed") {
    return (
      <div className="container p-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        <p className="text-red-500">Failed to load cart. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {status === "loading" ? (
        <div className="flex items-center justify-center p-4">
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Your cart is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => {
            const { productId, quantity } = item;
            if (!productId?._id) {
              console.error('Cart item missing productId:', item);
              return null;
            }

            return (
              <div 
                key={productId._id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{productId.name}</h3>
                  <p className="text-gray-600">Price: ${productId.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => decrementQuantity(productId._id)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-md"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => incrementQuantity(productId._id)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-md"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(productId._id))}
                  className="px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
