import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import "./Footer.css";

const footerLinks = {
  "Online Shopping": ["Men", "Women", "Kids", "Beauty", "Home & Living", "Sports"],
  "Customer Policies": ["Contact Us", "FAQ", "T&C", "Terms of Use", "Privacy policy", "Returns & Exchanges"],
  "Experience": ["Download App", "Myntra Social", "Sell on Myntra", "Gift Cards", "About Us", "Careers"],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-text">FASHIO</span><span className="logo-dot">.</span>
            </div>
            <p className="footer-tagline">India's Fashion Destination</p>
            <p className="footer-desc">
              Discover the latest trends in fashion, beauty and lifestyle. Premium brands at the best prices, delivered to your doorstep.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Instagram"><FiInstagram size={18} /></a>
              <a href="#" className="social-btn" aria-label="Twitter"><FiTwitter size={18} /></a>
              <a href="#" className="social-btn" aria-label="Facebook"><FiFacebook size={18} /></a>
              <a href="#" className="social-btn" aria-label="YouTube"><FiYoutube size={18} /></a>
            </div>
            <div className="footer-contact">
              <span><FiMail size={14} /> support@fashio.in</span>
              <span><FiPhone size={14} /> 1800-123-4567</span>
              <span><FiMapPin size={14} /> Mumbai, Maharashtra</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-col">
              <h4 className="footer-col-title">{title}</h4>
              <ul className="footer-links">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="/products" className="footer-link">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4 className="footer-col-title">Stay in Style</h4>
            <p className="newsletter-desc">Subscribe for exclusive deals and latest fashion updates.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
            <div className="footer-apps">
              <p className="apps-title">Download the App</p>
              <div className="app-badges">
                <div className="app-badge">
                  <span>📱</span>
                  <div>
                    <span className="app-store-label">Get it on</span>
                    <span className="app-store-name">Google Play</span>
                  </div>
                </div>
                <div className="app-badge">
                  <span>🍎</span>
                  <div>
                    <span className="app-store-label">Download on</span>
                    <span className="app-store-name">App Store</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copy">© 2026 Fashio. All rights reserved. | Inspired by Myntra's UI/UX style.</p>
          <div className="footer-payments">
            {["Visa", "Mastercard", "UPI", "PayTM", "NetBanking"].map((p) => (
              <span key={p} className="payment-tag">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
