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
        wishlist.map((item) => (
          <div key={item._id} className="wishlist-item">
            {/* Accessing productId to get product details */}
            <h3>{item.productId.name}</h3>
            <p>{item.productId.description}</p>
            <p>Price: ₹{item.productId.price}</p>
            <img src={item.productId.product_img_url} alt={item.productId.name} width="100" />
            <button
              onClick={() => dispatch(removeFromWishlist(item._id))} // Using item._id to remove the wishlist item
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
