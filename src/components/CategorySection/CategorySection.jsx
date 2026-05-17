import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data/products";
import { useApp } from "../../context/AppContext";
import "./CategorySection.css";

export default function CategorySection() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleClick = (catName) => {
    dispatch({ type: "SET_CATEGORY", payload: catName });
    navigate(`/products?category=${catName}`);
  };

  return (
    <section className="category-section">
      <div className="section-header">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Find exactly what you're looking for</p>
      </div>
      <div className="category-grid">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            className="category-card"
            onClick={() => handleClick(cat.name)}
            style={{ "--delay": `${i * 0.08}s` }}
          >
            <div className="category-img-wrap">
              <img src={cat.image} alt={cat.name} className="category-img" loading="lazy" />
              <div className="category-overlay" />
              <span className="category-icon">{cat.icon}</span>
            </div>
            <div className="category-info">
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.itemCount}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
