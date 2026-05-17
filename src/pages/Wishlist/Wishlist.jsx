import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Wishlist.css";

export default function Wishlist() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { wishlist } = state;

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="empty-icon">💖</div>
        <h2>Your wishlist is empty!</h2>
        <p>Save items that you like in your wishlist to buy them later.</p>
        <button className="shop-now-btn" onClick={() => navigate("/products")}>
          <FiShoppingBag size={18} />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Back
        </button>
        <h1 className="wishlist-title">
          My Wishlist <span>({wishlist.length} {wishlist.length === 1 ? "item" : "items"})</span>
        </h1>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
