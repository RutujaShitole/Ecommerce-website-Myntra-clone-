import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import "./Cart.css";

export default function Cart() {
  const { state, dispatch, cartTotal } = useApp();
  const navigate = useNavigate();
  const { cart } = state;

  const updateQty = (item, qty) => {
    if (qty < 1) {
      dispatch({ type: "REMOVE_FROM_CART", payload: item });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { ...item, quantity: qty } });
    }
  };

  const delivery = cartTotal >= 499 ? 0 : 49;
  const discount = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + delivery - discount;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛍️</div>
        <h2>Your bag is empty!</h2>
        <p>Looks like you haven't added anything to your bag yet.</p>
        <button className="shop-now-btn" onClick={() => navigate("/products")}>
          <FiShoppingBag size={18} />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Continue Shopping
        </button>
        <h1 className="cart-title">My Bag <span>({cart.length} {cart.length === 1 ? "item" : "items"})</span></h1>
      </div>

      <div className="cart-grid">
        {/* Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
              <Link to={`/product/${item.id}`} className="cart-item-img-wrap">
                <img src={item.images[0]} alt={item.name} className="cart-item-img" />
              </Link>

              <div className="cart-item-info">
                <div className="cart-item-brand">{item.brand}</div>
                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                <div className="cart-item-meta">
                  {item.selectedSize && item.selectedSize !== "Free" && (
                    <span className="meta-chip">Size: {item.selectedSize}</span>
                  )}
                  <span className="meta-chip">Qty: {item.quantity}</span>
                </div>

                <div className="cart-item-price">
                  <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                  <span className="item-original">₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
                  <span className="item-discount">{item.discount}% off</span>
                </div>

                {/* Qty Controls */}
                <div className="cart-qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item, item.quantity - 1)}
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="qty-num">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item, item.quantity + 1)}
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Remove */}
              <button
                className="cart-remove-btn"
                onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item })}
                title="Remove"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3 className="summary-title">Price Details</h3>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Price ({cart.length} items)</span>
              <span>₹{cart.reduce((a, i) => a + i.originalPrice * i.quantity, 0).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="green">− ₹{(cart.reduce((a, i) => a + i.originalPrice * i.quantity, 0) - cartTotal).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Convenience Fee</span>
              <span className="green">{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
            </div>
            <div className="summary-row">
              <span>Extra Savings (5%)</span>
              <span className="green">− ₹{discount.toLocaleString()}</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total Amount</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>

          <p className="savings-text">
            🎉 You are saving <strong>₹{(cart.reduce((a, i) => a + i.originalPrice * i.quantity, 0) - finalTotal).toLocaleString()}</strong> on this order!
          </p>

          <button
            className="place-order-btn"
            onClick={() => {
              dispatch({
                type: "PLACE_ORDER",
                payload: {
                  total: cart.reduce((a, i) => a + i.originalPrice * i.quantity, 0),
                  discount: (cart.reduce((a, i) => a + i.originalPrice * i.quantity, 0) - cartTotal) + discount,
                  delivery: delivery,
                  finalTotal: finalTotal
                }
              });
              navigate("/orders");
            }}
          >
            Place Order
          </button>

          <div className="secure-badge">🔒 100% Secure Payments</div>
        </div>
      </div>
    </div>
  );
}
