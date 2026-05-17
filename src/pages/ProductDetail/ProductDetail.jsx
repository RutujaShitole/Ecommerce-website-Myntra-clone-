import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiHeart, FiShoppingBag, FiStar, FiTruck, FiRefreshCw,
  FiShield, FiShare2, FiChevronLeft, FiChevronRight, FiCheck
} from "react-icons/fi";
import { products } from "../../data/products";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useApp } from "../../context/AppContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const { dispatch, isInWishlist, isInCart } = useApp();

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState("desc");

  // Scroll to top and reset state when URL product ID changes (e.g. from Similar Products)
  useEffect(() => {
    setSelectedImg(0);
    setSelectedSize("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/products")} className="back-btn">Browse Products</button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, selectedSize: selectedSize || "Free" },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, selectedSize: selectedSize || "Free" },
    });
    navigate("/cart");
  };

  const prevImg = () => setSelectedImg((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImg = () => setSelectedImg((i) => (i + 1) % product.images.length);

  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="detail-grid">
        {/* Image Gallery */}
        <div className="detail-gallery">
          {/* Thumbnails */}
          <div className="gallery-thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`thumb-btn ${i === selectedImg ? "active" : ""}`}
                onClick={() => setSelectedImg(i)}
              >
                <img src={img} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="gallery-main">
            <img src={product.images[selectedImg]} alt={product.name} className="main-img" />

            {/* Nav Arrows */}
            <button className="gallery-arrow gallery-prev" onClick={prevImg}><FiChevronLeft /></button>
            <button className="gallery-arrow gallery-next" onClick={nextImg}><FiChevronRight /></button>

            {/* Badges */}
            <div className="detail-badges">
              {product.isNew && <span className="d-badge new">NEW</span>}
              {product.isTrending && <span className="d-badge trend">TRENDING</span>}
            </div>

            {/* Wishlist */}
            <button
              className={`detail-wishlist ${inWishlist ? "active" : ""}`}
              onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product })}
            >
              <FiHeart fill={inWishlist ? "currentColor" : "none"} size={20} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="detail-info">
          <div className="detail-brand">{product.brand}</div>
          <h1 className="detail-name">{product.name}</h1>

          {/* Rating */}
          <div className="detail-rating">
            <span className="rating-pill">
              <FiStar fill="currentColor" size={13} />
              {product.rating}
            </span>
            <span className="rating-count">{product.reviews.toLocaleString()} Ratings & Reviews</span>
          </div>

          {/* Price */}
          <div className="detail-price-block">
            <span className="detail-price">₹{product.price.toLocaleString()}</span>
            <span className="detail-original">₹{product.originalPrice.toLocaleString()}</span>
            <span className="detail-discount">({product.discount}% OFF)</span>
          </div>
          <p className="inclusive-tax">inclusive of all taxes</p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="detail-colors">
              <span className="option-label">Colors</span>
              <div className="colors-row">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="color-swatch"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="detail-sizes">
              <div className="size-header">
                <span className="option-label">
                  Select Size {selectedSize && <strong>— {selectedSize}</strong>}
                </span>
                <button className="size-guide-btn">Size Guide</button>
              </div>
              <div className={`sizes-row ${sizeError ? "size-error-shake" : ""}`}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && <p className="size-error-msg">⚠️ Please select a size to continue</p>}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="detail-ctas">
            <button
              className={`cta-cart ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <><FiCheck size={18} /> Added to Bag</>
              ) : (
                <><FiShoppingBag size={18} /> Add to Bag</>
              )}
            </button>
            <button className="cta-buy" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Wishlist Text Button */}
          <button
            className={`wishlist-text-btn ${inWishlist ? "in-wishlist" : ""}`}
            onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product })}
          >
            <FiHeart size={16} fill={inWishlist ? "currentColor" : "none"} />
            {inWishlist ? "Wishlisted" : "Add to Wishlist"}
          </button>

          {/* Delivery Info */}
          <div className="delivery-info">
            <div className="delivery-item">
              <FiTruck className="delivery-icon" />
              <div>
                <span className="delivery-title">Free Delivery</span>
                <span className="delivery-desc">On orders above ₹499</span>
              </div>
            </div>
            <div className="delivery-item">
              <FiRefreshCw className="delivery-icon" />
              <div>
                <span className="delivery-title">30-Day Returns</span>
                <span className="delivery-desc">Easy hassle-free returns</span>
              </div>
            </div>
            <div className="delivery-item">
              <FiShield className="delivery-icon" />
              <div>
                <span className="delivery-title">Authentic Products</span>
                <span className="delivery-desc">100% genuine products</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {[
              { id: "desc", label: "Description" },
              { id: "details", label: "Product Details" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`detail-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="detail-tab-content">
            {activeTab === "desc" && (
              <p className="product-description">{product.description}</p>
            )}
            {activeTab === "details" && (
              <table className="product-details-table">
                <tbody>
                  <tr><td>Brand</td><td>{product.brand}</td></tr>
                  <tr><td>Category</td><td>{product.category}</td></tr>
                  <tr><td>Sub-Category</td><td>{product.subCategory}</td></tr>
                  <tr><td>Rating</td><td>{product.rating} ⭐</td></tr>
                  <tr><td>Reviews</td><td>{product.reviews.toLocaleString()}</td></tr>
                  {product.tags && <tr><td>Tags</td><td>{product.tags.join(", ")}</td></tr>}
                </tbody>
              </table>
            )}
            {activeTab === "reviews" && (
              <div className="reviews-placeholder">
                <div className="rating-big">
                  <span className="rating-num">{product.rating}</span>
                  <div>
                    <div className="stars">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</div>
                    <span className="reviews-total">{product.reviews.toLocaleString()} reviews</span>
                  </div>
                </div>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-bar-row">
                    <span>{star}★</span>
                    <div className="rating-bar-track">
                      <div
                        className="rating-bar-fill"
                        style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : (star === 2 ? 5 : 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="similar-section">
          <h2 className="section-title">Similar Products</h2>
          <div className="similar-grid">
            {similar.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
