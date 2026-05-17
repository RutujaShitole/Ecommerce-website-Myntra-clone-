import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { banners } from "../../data/products";
import "./HeroBanner.css";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback(
    (idx) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating]
  );

  const next = useCallback(() => goTo((current + 1) % banners.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + banners.length) % banners.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="hero-banner">
      <div className="banner-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner, i) => (
          <div key={banner.id} className="banner-slide" style={{ background: banner.bg }}>
            <img src={banner.image} alt={banner.title} className="banner-image" loading={i === 0 ? "eager" : "lazy"} />
            <div className="banner-overlay" />
            <div className="banner-content">
              <span className="banner-tag">New Collection</span>
              <h1 className="banner-title">{banner.title}</h1>
              <p className="banner-subtitle">{banner.subtitle}</p>
              <button
                className="banner-cta"
                onClick={() => navigate("/products")}
              >
                {banner.cta}
                <span className="cta-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className="banner-arrow banner-arrow-left" onClick={prev} aria-label="Previous">
        <FiChevronLeft size={24} />
      </button>
      <button className="banner-arrow banner-arrow-right" onClick={next} aria-label="Next">
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="banner-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`banner-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="banner-progress">
        <div className="banner-progress-bar" key={current} />
      </div>
    </div>
  );
}
