import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import ProductListing from "./pages/ProductListing/ProductListing";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import Orders from "./pages/Orders/Orders";
import LoginModal from "./components/LoginModal/LoginModal";
import { AppProvider } from "./context/AppContext";
import "./App.css";

function MainApp() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Top Promotional Bar */}
        <div className="promo-bar">
          🎉 End of Reason Sale is LIVE! Get Extra 10% Off using code FASHIO10 | Free Shipping on orders above ₹499
        </div>

        {/* Navigation */}
        <Navbar onLoginClick={() => setShowAuthModal(true)} />

        {/* Page Content Routes */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Login/Signup Modal */}
        {showAuthModal && <LoginModal onClose={() => setShowAuthModal(false)} />}
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
