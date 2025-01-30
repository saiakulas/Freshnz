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
          <div key={item.productId}>
            <h3>{item.name}</h3>
            <button onClick={() => dispatch(removeFromWishlist(item.productId))}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
