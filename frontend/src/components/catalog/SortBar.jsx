import React from 'react';
import { LayoutGrid, List, ArrowUpDown, X } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';

export const SortBar = () => {
  const {
    filteredProducts,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    selectedConditions,
    setSelectedConditions,
    searchQuery,
    setSearchQuery
  } = useAuction();

  return (
    <div className="sort-bar-wrapper">
      {/* Left: Matching Products Count & Filter Badges */}
      <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
        <div className="sort-results-count">
          Showing <strong>{filteredProducts.length}</strong> active lots
        </div>

        {/* Active Filter Chips */}
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          {selectedCategory !== 'all' && (
            <span
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--text-primary)'
              }}
            >
              Category: <strong>{selectedCategory}</strong>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                title="Clear Category"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {searchQuery && (
            <span
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--text-primary)'
              }}
            >
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                title="Clear Search"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {selectedConditions.map((cond) => (
            <span
              key={cond}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--text-primary)'
              }}
            >
              {cond}
              <button
                onClick={() => setSelectedConditions((prev) => prev.filter((c) => c !== cond))}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                title={`Remove ${cond}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Right: Sorting and View Toggle */}
      <div className="sort-controls-right">
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <select
            className="sort-select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured &amp; Best Value</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="highest_savings">Biggest % Savings off MSRP</option>
            <option value="stock">Stock Available</option>
            <option value="newly_added">Newly Uploaded</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle" role="group" aria-label="View Mode">
          <button
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
            aria-label="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
