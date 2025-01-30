import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const status = useSelector((state) => state.cart.status);

  useEffect(() => {
    console.log('Dispatching fetchCart');
    if (status === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, status]);

  console.log(cart);  // Check if the cart is correctly populated

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
                  <p className="text-gray-600">Quantity: {quantity}</p>
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
