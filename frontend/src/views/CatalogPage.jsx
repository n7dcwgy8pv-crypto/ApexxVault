import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  ChevronRight,
  PackageCheck,
  Search,
  X,
  ArrowUpDown,
  Grid,
  List
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { ProductCard } from '../components/catalog/ProductCard';
import { CATEGORIES, CONDITIONS } from '../data/auctionEvents';

export const CatalogPage = ({ categorySlug = null }) => {
  const {
    products,
    isLoadingProducts,
    categoryCounts,
    selectedCategory,
    setSelectedCategory,
    selectedConditions,
    setSelectedConditions,
    priceMax,
    setPriceMax,
    stockFilter,
    setStockFilter,
    sortBy,
    setSortBy
  } = useAuction();

  const { navigate } = useRouter();

  // Sync route category with context state (Finding C3)
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory('all');
    }
  }, [categorySlug, setSelectedCategory]);

  // Local filter states for sidebar
  const activeCategory = categorySlug || selectedCategory || 'all';
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory) || {
    id: 'all',
    name: 'All Inventory'
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    // Condition filter
    if (selectedConditions && selectedConditions.length > 0) {
      result = result.filter(p => selectedConditions.includes(p.condition));
    }

    // Stock filter
    if (stockFilter === 'in_stock') {
      result = result.filter(p => p.stockQty > 0);
    }

    // Price filter
    if (priceMax < 5000) {
      result = result.filter(p => (p.price || 0) <= priceMax);
    }

    // Local search filter
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      result = result.filter(
        p =>
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'savings_desc') {
      result.sort((a, b) => {
        const savA = ((a.retailMSRP || 0) - (a.price || 0)) / (a.retailMSRP || 1);
        const savB = ((b.retailMSRP || 0) - (b.price || 0)) / (b.retailMSRP || 1);
        return savB - savA;
      });
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'title_asc') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [products, activeCategory, selectedConditions, stockFilter, priceMax, localSearch, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const toggleCondition = (cond) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedConditions([]);
    setPriceMax(5000);
    setStockFilter('all');
    setLocalSearch('');
    if (categorySlug) {
      navigate('/collections/all');
    } else {
      setSelectedCategory('all');
    }
    setCurrentPage(1);
  };

  return (
    <div className="catalog-page-container">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/collections/all">Collections</Link>
          {activeCategory !== 'all' && (
            <>
              <ChevronRight size={14} />
              <span className="breadcrumb-current">{currentCategoryObj.name}</span>
            </>
          )}
        </div>

        {/* Category Header */}
        <div className="catalog-header-banner">
          <div>
            <h1 className="catalog-main-title">{currentCategoryObj.name}</h1>
            <p className="catalog-subtitle">
              {isLoadingProducts
                ? 'Loading ApexxVault surplus inventory...'
                : `Showing ${filteredProducts.length} verified liquidation lot${filteredProducts.length === 1 ? '' : 's'} ready for pickup or delivery from Scarborough Depot.`}
            </p>
          </div>

          {/* Quick Clear if filters active */}
          {(selectedConditions.length > 0 || priceMax < 5000 || stockFilter !== 'all' || localSearch) && (
            <button type="button" className="catalog-clear-btn" onClick={clearAllFilters}>
              <X size={14} />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Toolbar: Sort Bar & Filter Toggle */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <button
              type="button"
              className="mobile-filter-trigger"
              onClick={() => setMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={16} />
              <span>Filters ({selectedConditions.length + (stockFilter !== 'all' ? 1 : 0) + (priceMax < 5000 ? 1 : 0)})</span>
            </button>

            <span className="toolbar-count">
              {isLoadingProducts ? (
                <span>Loading lots...</span>
              ) : (
                <>
                  <strong>{filteredProducts.length}</strong> Product{filteredProducts.length === 1 ? '' : 's'}
                </>
              )}
            </span>
          </div>

          <div className="toolbar-right">
            <label htmlFor="catalog-sort" className="sort-label">Sort by:</label>
            <select
              id="catalog-sort"
              className="catalog-sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="featured">Featured Lots</option>
              <option value="newest">Newest Drops</option>
              <option value="savings_desc">Deepest Discount (% Off)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>

        {/* Main Grid & Sidebar Layout */}
        <div className="catalog-layout-grid">
          {/* Desktop Filter Sidebar */}
          <aside className="catalog-sidebar-desktop">
            <div className="sidebar-filter-box">
              <h3 className="filter-box-title">Departments</h3>
              <ul className="category-filter-list">
                {CATEGORIES.map((cat) => {
                  const isCurrent = activeCategory === cat.id;
                  const catCount = categoryCounts ? (categoryCounts[cat.id] ?? 0) : 0;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        className={`category-filter-btn ${isCurrent ? 'active' : ''}`}
                        onClick={() => {
                          if (cat.id === 'all') {
                            navigate('/collections/all');
                          } else {
                            navigate(`/collections/${cat.id}`);
                          }
                          setCurrentPage(1);
                        }}
                      >
                        <span>{cat.name}</span>
                        <span className="cat-count">{catCount}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Condition Filters */}
            <div className="sidebar-filter-box">
              <h3 className="filter-box-title">Condition</h3>
              <div className="checkbox-filter-list">
                {CONDITIONS.map((cond) => {
                  const isChecked = selectedConditions.includes(cond.id);
                  return (
                    <label key={cond.id} className="checkbox-filter-label">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCondition(cond.id)}
                      />
                      <span>{cond.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="sidebar-filter-box">
              <h3 className="filter-box-title">Availability</h3>
              <div className="radio-filter-list">
                <label className="radio-filter-label">
                  <input
                    type="radio"
                    name="stock-filter"
                    checked={stockFilter === 'all'}
                    onChange={() => {
                      setStockFilter('all');
                      setCurrentPage(1);
                    }}
                  />
                  <span>All Lots</span>
                </label>
                <label className="radio-filter-label">
                  <input
                    type="radio"
                    name="stock-filter"
                    checked={stockFilter === 'in_stock'}
                    onChange={() => {
                      setStockFilter('in_stock');
                      setCurrentPage(1);
                    }}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="sidebar-filter-box">
              <div className="flex items-center justify-between">
                <h3 className="filter-box-title" style={{ marginBottom: 0 }}>Max Price</h3>
                <span className="price-slider-value">${priceMax} CAD</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={priceMax}
                onChange={(e) => {
                  setPriceMax(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="price-range-slider"
              />
              <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: '0.35rem' }}>
                <span>$50</span>
                <span>$5,000+</span>
              </div>
            </div>
          </aside>

          {/* Product Cards Grid Area */}
          <div className="catalog-products-col">
            {isLoadingProducts ? (
              <div className="loading-grid-skeleton">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="empty-catalog-state">
                <PackageCheck size={48} color="var(--ink-muted)" />
                <h3>No liquidation lots match your filters</h3>
                <p>Try clearing active filters or selecting another department.</p>
                <button type="button" className="btn-primary" onClick={clearAllFilters} style={{ marginTop: '1rem' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid-catalog">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="catalog-pagination">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }}
                    >
                      Previous
                    </button>

                    <div className="pagination-pages">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileFilterOpen(false)}>
          <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-header">
              <h3>Filters &amp; Sorting</h3>
              <button type="button" onClick={() => setMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="filter-drawer-body">
              {/* Category */}
              <div className="sidebar-filter-box">
                <h4 className="filter-box-title">Department</h4>
                <select
                  className="mobile-select-full"
                  value={activeCategory}
                  onChange={(e) => {
                    if (e.target.value === 'all') navigate('/collections/all');
                    else navigate(`/collections/${e.target.value}`);
                    setMobileFilterOpen(false);
                  }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Conditions */}
              <div className="sidebar-filter-box">
                <h4 className="filter-box-title">Condition</h4>
                <div className="checkbox-filter-list">
                  {CONDITIONS.map((cond) => (
                    <label key={cond.id} className="checkbox-filter-label">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(cond.id)}
                        onChange={() => toggleCondition(cond.id)}
                      />
                      <span>{cond.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Max */}
              <div className="sidebar-filter-box">
                <div className="flex justify-between">
                  <h4 className="filter-box-title">Max Price</h4>
                  <span>${priceMax} CAD</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="price-range-slider"
                />
              </div>
            </div>

            <div className="filter-drawer-footer">
              <button type="button" className="btn-secondary" onClick={clearAllFilters} style={{ flex: 1 }}>
                Reset
              </button>
              <button type="button" className="btn-primary" onClick={() => setMobileFilterOpen(false)} style={{ flex: 1 }}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
