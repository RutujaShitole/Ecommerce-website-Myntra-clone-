import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiGrid, FiList } from "react-icons/fi";
import ProductCard from "../../components/ProductCard/ProductCard";
import { products } from "../../data/products";
import "./ProductListing.css";

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discount" },
  { label: "Newest", value: "newest" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: Infinity },
];

const allBrands = [...new Set(products.map((p) => p.brand))];
const allCategories = [...new Set(products.map((p) => p.category))];

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand") || "";

  const [sort, setSort] = useState("recommended");
  const [filterOpen, setFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [filters, setFilters] = useState({
    categories: categoryParam ? [categoryParam] : [],
    brands: brandParam ? [brandParam] : [],
    priceRange: null,
    minRating: 0,
  });
  const [openSections, setOpenSections] = useState({
    category: true, brand: true, price: true, rating: true,
  });

  // Synchronize state when URL query parameters change (e.g., clicking Men/Women in Navbar or typing search)
  useEffect(() => {
    setFilters({
      categories: categoryParam ? [categoryParam] : [],
      brands: brandParam ? [brandParam] : [],
      priceRange: null,
      minRating: 0,
    });
  }, [categoryParam, brandParam, searchQuery]);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const arr = prev[type];
      return {
        ...prev,
        [type]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const clearFilters = () =>
    setFilters({ categories: [], brands: [], priceRange: null, minRating: 0 });

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filters.categories.length)
      result = result.filter((p) => filters.categories.includes(p.category));
    if (filters.brands.length)
      result = result.filter((p) => filters.brands.includes(p.brand));
    if (filters.priceRange)
      result = result.filter(
        (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    if (filters.minRating)
      result = result.filter((p) => p.rating >= filters.minRating);

    switch (sort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "discount": result.sort((a, b) => b.discount - a.discount); break;
      case "newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: break;
    }
    return result;
  }, [filters, sort, searchQuery]);

  const activeFilterCount =
    filters.categories.length + filters.brands.length +
    (filters.priceRange ? 1 : 0) + (filters.minRating ? 1 : 0);

  return (
    <div className="listing-page">
      {/* Header */}
      <div className="listing-header">
        <div className="listing-title-row">
          <div>
            <h1 className="listing-title">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : categoryParam || "All Products"}
            </h1>
            <p className="listing-count">{filtered.length} items found</p>
          </div>
          <div className="listing-controls">
            <button
              className={`filter-toggle-btn ${filterOpen ? "active" : ""}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter size={16} />
              Filter {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            </button>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="view-toggle">
              <button className={`view-btn ${gridView ? "active" : ""}`} onClick={() => setGridView(true)}>
                <FiGrid size={18} />
              </button>
              <button className={`view-btn ${!gridView ? "active" : ""}`} onClick={() => setGridView(false)}>
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="active-filters">
            {filters.categories.map((c) => (
              <span key={c} className="filter-chip">
                {c} <button onClick={() => toggleFilter("categories", c)}><FiX size={12} /></button>
              </span>
            ))}
            {filters.brands.map((b) => (
              <span key={b} className="filter-chip">
                {b} <button onClick={() => toggleFilter("brands", b)}><FiX size={12} /></button>
              </span>
            ))}
            {filters.priceRange && (
              <span className="filter-chip">
                {filters.priceRange.label}
                <button onClick={() => setFilters((f) => ({ ...f, priceRange: null }))}><FiX size={12} /></button>
              </span>
            )}
            {filters.minRating > 0 && (
              <span className="filter-chip">
                {filters.minRating}★ & above
                <button onClick={() => setFilters((f) => ({ ...f, minRating: 0 }))}><FiX size={12} /></button>
              </span>
            )}
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
          </div>
        )}
      </div>

      <div className="listing-body">
        {/* Sidebar */}
        <aside className={`filter-sidebar ${filterOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            {activeFilterCount > 0 && (
              <button className="clear-all-link" onClick={clearFilters}>Clear All</button>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <button className="filter-section-head" onClick={() => toggleSection("category")}>
              <span>Category</span>
              {openSections.category ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSections.category && (
              <div className="filter-options">
                {allCategories.map((cat) => (
                  <label key={cat} className="filter-label">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => toggleFilter("categories", cat)}
                      className="filter-checkbox"
                    />
                    <span className="filter-text">{cat}</span>
                    <span className="filter-count">
                      ({products.filter((p) => p.category === cat).length})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="filter-section">
            <button className="filter-section-head" onClick={() => toggleSection("brand")}>
              <span>Brand</span>
              {openSections.brand ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSections.brand && (
              <div className="filter-options">
                {allBrands.map((brand) => (
                  <label key={brand} className="filter-label">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleFilter("brands", brand)}
                      className="filter-checkbox"
                    />
                    <span className="filter-text">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <button className="filter-section-head" onClick={() => toggleSection("price")}>
              <span>Price Range</span>
              {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSections.price && (
              <div className="filter-options">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="filter-label">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange?.label === range.label}
                      onChange={() => setFilters((f) => ({ ...f, priceRange: range }))}
                      className="filter-checkbox"
                    />
                    <span className="filter-text">{range.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <button className="filter-section-head" onClick={() => toggleSection("rating")}>
              <span>Customer Rating</span>
              {openSections.rating ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSections.rating && (
              <div className="filter-options">
                {[4, 3, 2].map((r) => (
                  <label key={r} className="filter-label">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === r}
                      onChange={() => setFilters((f) => ({ ...f, minRating: r }))}
                      className="filter-checkbox"
                    />
                    <span className="filter-text">{"⭐".repeat(r)} & above</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Overlay */}
        {filterOpen && (
          <div className="sidebar-overlay" onClick={() => setFilterOpen(false)} />
        )}

        {/* Products */}
        <div className="products-area">
          {filtered.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="clear-filters-btn large" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={gridView ? "products-grid" : "products-list"}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
