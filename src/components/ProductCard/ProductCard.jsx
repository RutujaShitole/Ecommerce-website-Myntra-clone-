import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiStar, FiShoppingBag, FiEye } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { dispatch, isInWishlist, isInCart } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [adding, setAdding] = useState(false);
  const [hovering, setHovering] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "TOGGLE_WISHLIST", payload: product });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, selectedSize: product.sizes?.[2] || product.sizes?.[0] || "Free" },
    });
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
    >
      {/* Image */}
      <div className="card-image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="card-img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="card-badges">
          {product.isNew && <span className="badge-tag new-tag">NEW</span>}
          {product.isTrending && <span className="badge-tag trend-tag">TRENDING</span>}
        </div>

        {/* Discount */}
        {product.discount > 0 && (
          <div className="card-discount">{product.discount}% OFF</div>
        )}

        {/* Wishlist */}
        <button
          className={`card-wishlist ${inWishlist ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          aria-label="Wishlist"
        >
          <FiHeart size={18} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Quick View */}
        <div className={`card-actions ${hovering ? "visible" : ""}`}>
          <button className="card-quick-view" onClick={handleAddToCart}>
            <FiShoppingBag size={16} />
            {adding ? "Added!" : inCart ? "In Bag" : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="card-info">
        <div className="card-brand">{product.brand}</div>
        <div className="card-name">{product.name}</div>
        <div className="card-rating">
          <span className="rating-pill">
            <FiStar size={11} fill="currentColor" />
            {product.rating}
          </span>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="card-price">
          <span className="price-current">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
              <span className="price-discount">({product.discount}% off)</span>
            </>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="card-colors">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c} className="color-dot" style={{ background: c }} />
            ))}
            {product.colors.length > 4 && (
              <span className="color-more">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
