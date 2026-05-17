import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiShoppingBag, FiTruck, FiMapPin, FiCalendar, FiBox, FiCheckCircle } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import "./Orders.css";

export default function Orders() {
  const { state } = useApp();
  const { orders } = state;
  const navigate = useNavigate();

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-icon">📦</div>
        <h2>No Orders Found!</h2>
        <p>You haven't placed any orders yet. Start exploring our premium collection.</p>
        <button className="shop-now-btn" onClick={() => navigate("/products")}>
          <FiShoppingBag size={18} />
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-title">Order History</h1>
        <p className="orders-subtitle">Track and manage your recent orders</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            {/* Order Meta Header */}
            <div className="order-meta-header">
              <div className="meta-left">
                <div className="meta-item">
                  <span className="meta-label">ORDER PLACED</span>
                  <span className="meta-value">{order.date}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">TOTAL PAID</span>
                  <span className="meta-value">₹{order.finalTotal.toLocaleString()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">SHIP TO</span>
                  <span className="meta-value tooltip" title={`${order.address.street}, ${order.address.city}`}>
                    {order.address.name}
                  </span>
                </div>
              </div>
              <div className="meta-right">
                <span className="order-id-tag">ID: {order.id}</span>
              </div>
            </div>

            {/* Order Status Ribbon */}
            <div className="order-status-ribbon">
              <div className="status-indicator">
                <FiCheckCircle className="status-icon-check" />
                <span className="status-text">Status: <strong>{order.status}</strong></span>
              </div>
              <div className="delivery-estimate">
                <FiTruck className="delivery-icon-truck" />
                <span>Estimated Delivery: <strong>{order.deliveryDate}</strong></span>
              </div>
            </div>

            {/* Order Items Grid */}
            <div className="order-items">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="order-item-row">
                  <Link to={`/product/${item.id}`} className="item-img-wrap">
                    <img src={item.images[0]} alt={item.name} className="item-img" />
                  </Link>
                  <div className="item-details">
                    <span className="item-brand">{item.brand}</span>
                    <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                    <div className="item-meta">
                      {item.selectedSize && item.selectedSize !== "Free" && (
                        <span className="meta-label-tag">Size: <strong>{item.selectedSize}</strong></span>
                      )}
                      <span className="meta-label-tag">Qty: <strong>{item.quantity}</strong></span>
                    </div>
                    <div className="item-pricing">
                      <span className="current-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="original-price">₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button className="item-btn secondary-btn" onClick={() => navigate(`/product/${item.id}`)}>
                      Buy Again
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer summary */}
            <div className="order-card-footer">
              <div className="footer-address">
                <div className="address-header">
                  <FiMapPin size={14} />
                  <span>Delivery Address</span>
                </div>
                <p className="address-details">
                  <strong>{order.address.name}</strong><br />
                  {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                  Phone: {order.address.phone}
                </p>
              </div>
              <div className="footer-actions">
                <button className="order-action-btn primary-btn" onClick={() => alert(`Tracking details sent to your registered phone & email for Order ${order.id}.`)}>
                  Track Package
                </button>
                <button className="order-action-btn secondary-btn" onClick={() => alert(`Invoice PDF downloading for Order ${order.id}...`)}>
                  Download Invoice
                </button>
                <button className="order-action-btn link-btn" onClick={() => alert("Our customer service team will contact you shortly regarding this order.")}>
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
