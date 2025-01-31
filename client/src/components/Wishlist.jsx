import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../redux/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const status = useSelector((state) => state.wishlist.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchWishlist());
    }
  }, [dispatch, status]);

  return (
    <div className="container">
      <h2>Wishlist</h2>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        wishlist.map((item) => {
          // Check if productId exists
          const product = item.productId;
          if (!product) {
            return null; // Skip this item if there's no productId
          }

          return (
            <div key={item._id} className="wishlist-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ₹{product.price}</p>
              <img src={product.product_img_url} alt={product.name} width="100" />
              <button
                onClick={() => dispatch(removeFromWishlist(product._id))}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Wishlist;
