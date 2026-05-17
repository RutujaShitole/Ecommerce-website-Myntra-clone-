import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiZap, FiPercent, FiTruck } from "react-icons/fi";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import CategorySection from "../../components/CategorySection/CategorySection";
import ProductCard from "../../components/ProductCard/ProductCard";
import { products, brands } from "../../data/products";
import "./Home.css";

const trendingProducts = products.filter((p) => p.isTrending);
const featuredProducts = products.filter((p) => p.isFeatured);
const dealsProducts = products.filter((p) => p.discount >= 43);

const perks = [
  { icon: <FiTruck size={24} />, title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: <FiPercent size={24} />, title: "Best Prices", desc: "Guaranteed lowest prices" },
  { icon: <FiZap size={24} />, title: "Easy Returns", desc: "30-day hassle free returns" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Perks Strip */}
      <div className="perks-strip">
        {perks.map((p) => (
          <div key={p.title} className="perk-item">
            <span className="perk-icon">{p.icon}</span>
            <div>
              <span className="perk-title">{p.title}</span>
              <span className="perk-desc">{p.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <CategorySection />

      {/* Trending */}
      <section className="product-section">
        <div className="section-head">
          <div>
            <h2 className="section-title">🔥 Trending Now</h2>
            <p className="section-sub">Hottest picks this season</p>
          </div>
          <button className="view-all-btn" onClick={() => navigate("/products?filter=trending")}>
            View All <FiArrowRight />
          </button>
        </div>
        <div className="product-grid">
          {trendingProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="deals-section">
        <div className="deals-header">
          <div>
            <span className="deals-tag">⚡ Limited Time</span>
            <h2 className="section-title">Deals of the Day</h2>
            <p className="section-sub">Grab it before it's gone</p>
          </div>
          <button className="view-all-btn" onClick={() => navigate("/products?filter=deals")}>
            All Deals <FiArrowRight />
          </button>
        </div>
        <div className="product-grid">
          {dealsProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Mid Banner */}
      <div className="mid-banner" onClick={() => navigate("/products")}>
        <div className="mid-banner-content">
          <span className="mid-banner-tag">NEW ARRIVALS</span>
          <h2>Up to 60% off on Premium Brands</h2>
          <p>Don't miss out on the biggest fashion sale of the year</p>
          <button className="mid-banner-btn">Shop the Sale →</button>
        </div>
      </div>

      {/* Featured Brands */}
      <section className="brands-section">
        <div className="section-head">
          <div>
            <h2 className="section-title">✨ Featured Brands</h2>
            <p className="section-sub">Shop from top fashion labels</p>
          </div>
        </div>
        <div className="brands-grid">
          {brands.map((brand) => (
            <button
              key={brand.id}
              className="brand-card"
              onClick={() => navigate(`/products?brand=${brand.name}`)}
            >
              <div className="brand-img-wrap">
                <img src={brand.logo} alt={brand.name} className="brand-img" loading="lazy" />
                <div className="brand-overlay">
                  <span className="brand-name">{brand.name}</span>
                  <span className="brand-discount">{brand.discount}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="product-section">
        <div className="section-head">
          <div>
            <h2 className="section-title">⭐ Featured Picks</h2>
            <p className="section-sub">Curated just for you</p>
          </div>
          <button className="view-all-btn" onClick={() => navigate("/products")}>
            View All <FiArrowRight />
          </button>
        </div>
        <div className="product-grid">
          {featuredProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
