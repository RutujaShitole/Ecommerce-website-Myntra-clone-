import React, { useState } from "react";
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import "./LoginModal.css";

export default function LoginModal({ onClose }) {
  const { dispatch } = useApp();
  const [mode, setMode] = useState("login"); // login | signup
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    if (mode === "signup" && !form.name) { setError("Please enter your name."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setTimeout(() => {
      const user = { name: form.name || form.email.split("@")[0], email: form.email };
      dispatch({ type: "SET_USER", payload: user });
      setLoading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Close */}
        <button className="modal-close" onClick={onClose}><FiX size={20} /></button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-logo">
            <span className="logo-text">FASHIO</span><span className="logo-dot">.</span>
          </div>
          <h2 className="modal-title">
            {mode === "login" ? "Welcome Back!" : "Create Account"}
          </h2>
          <p className="modal-subtitle">
            {mode === "login"
              ? "Sign in to access your wishlist, orders & more."
              : "Join millions shopping the latest fashion."}
          </p>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button className={`modal-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Login
          </button>
          <button className={`modal-tab ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="modal-input"
              />
            </div>
          )}
          <div className="form-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="modal-input"
            />
          </div>
          <div className="form-group">
            <FiLock className="input-icon" />
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="modal-input"
            />
            <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}

          {mode === "login" && (
            <button type="button" className="forgot-link">Forgot Password?</button>
          )}

          <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              mode === "login" ? "Login" : "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="modal-divider">
          <span>or continue with</span>
        </div>

        {/* Social Login */}
        <div className="social-login">
          <button className="social-login-btn google">
            <span>G</span> Google
          </button>
          <button className="social-login-btn facebook">
            <span>f</span> Facebook
          </button>
        </div>

        {/* Switch Mode */}
        <p className="modal-switch">
          {mode === "login" ? "New to Fashio? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="switch-link">
            {mode === "login" ? "Create account" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
