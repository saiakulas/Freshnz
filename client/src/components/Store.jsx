import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "../redux/cartSlice";
import { fetchWishlist, addToWishlist } from "../redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
        dispatch(fetchCart());
        dispatch(fetchWishlist());
      } catch (err) {
        console.error("Error fetching products:", err);
        navigate("/login"); // Redirect if error occurs
      }
    };

    fetchProducts();
  }, [dispatch, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Store</h2>
      <button onClick={() => navigate("/cart")}>
        Go to Cart ({cart.length})
      </button>
      <button onClick={() => navigate("/wishlist")}>
        Go to Wishlist ({wishlist.length})
      </button>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button
              onClick={() => dispatch(addToCart({ productId: product._id, quantity: 1 }))}
            >
              Add to Cart
            </button>
            <button onClick={() => dispatch(addToWishlist(product._id))}>
  Add to Wishlist
</button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
