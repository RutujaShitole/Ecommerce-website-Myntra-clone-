import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiSun, FiMoon, FiChevronDown
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { products } from "../../data/products";
import "./Navbar.css";

const navCategories = ["Men", "Women", "Kids", "Beauty", "Home", "Sports"];

export default function Navbar({ onLoginClick }) {
  const { cartCount, wishlistCount, state, dispatch } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchVal.trim().length > 1) {
      const results = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchVal.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchVal]);

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSuggestions([]);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setSuggestions([]);
    setSearchVal("");
    setSearchOpen(false);
  };

  const handleCategoryClick = (cat) => {
    dispatch({ type: "SET_CATEGORY", payload: cat });
    navigate(`/products?category=${cat}`);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">FASHIO</span>
          <span className="logo-dot">.</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-categories desktop-only">
          {navCategories.map((cat) => (
            <button
              key={cat}
              className={`nav-cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {cat}
              <FiChevronDown size={12} />
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className={`navbar-search ${searchOpen ? "search-open" : ""}`} ref={searchRef}>
          <form className="search-form" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="search-input"
            />
            {searchVal && (
              <button type="button" className="search-clear" onClick={() => setSearchVal("")}>
                <FiX size={16} />
              </button>
            )}
          </form>
          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((p) => (
                <button key={p.id} className="suggestion-item" onClick={() => handleSuggestionClick(p)}>
                  <img src={p.images[0]} alt={p.name} className="suggestion-img" />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{p.name}</span>
                    <span className="suggestion-brand">{p.brand}</span>
                  </div>
                  <span className="suggestion-price">₹{p.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="navbar-actions">
          {/* Dark Mode */}
          <button
            className="nav-icon-btn theme-toggle"
            onClick={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
            title="Toggle Dark Mode"
          >
            {state.darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Profile Dropdown */}
          <div className="profile-container">
            <button className="nav-icon-btn" onClick={onLoginClick} title="Profile">
              <FiUser size={20} />
              <span className="nav-label">{state.user ? state.user.name.split(" ")[0] : "Profile"}</span>
            </button>
            <div className="profile-dropdown">
              <div className="dropdown-header">
                {state.user ? (
                  <>
                    <p className="welcome-name">Hello, {state.user.name.split(" ")[0]}!</p>
                    <p className="welcome-email">{state.user.email}</p>
                  </>
                ) : (
                  <>
                    <p className="welcome-name">Welcome!</p>
                    <p className="welcome-desc">To access account & manage orders</p>
                    <button className="dropdown-login-btn" onClick={onLoginClick}>LOGIN / SIGNUP</button>
                  </>
                )}
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-menu-links">
                <Link to="/orders" className="dropdown-link">My Orders</Link>
                <Link to="/wishlist" className="dropdown-link">Wishlist</Link>
                <Link to="/cart" className="dropdown-link">My Bag</Link>
                {state.user && (
                  <>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-logout-btn"
                      onClick={() => dispatch({ type: "LOGOUT" })}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
            <FiHeart size={20} />
            {wishlistCount > 0 && <span className="badge wishlist-badge">{wishlistCount}</span>}
            <span className="nav-label">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-icon-btn" title="Cart">
            <FiShoppingBag size={20} />
            {cartCount > 0 && <span className="badge cart-badge">{cartCount}</span>}
            <span className="nav-label">Bag</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-search-wrap">
          <form className="search-form" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="search-input"
            />
          </form>
        </div>
        {navCategories.map((cat) => (
          <button key={cat} className="mobile-cat-btn" onClick={() => handleCategoryClick(cat)}>
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}
