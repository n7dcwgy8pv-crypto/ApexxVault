import React from 'react';
import { Filter, RotateCcw, ShieldCheck, DollarSign, Layers, MapPin } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { CATEGORIES, CONDITIONS, AUCTION_EVENTS } from '../../data/auctionEvents';

export const FilterSidebar = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedConditions,
    setSelectedConditions,
    selectedEventId,
    setSelectedEventId,
    stockFilter,
    setStockFilter,
    priceMax,
    setPriceMax,
    products,
    searchQuery,
    setSearchQuery,
    setIsConditionGuideOpen
  } = useAuction();

  const handleConditionToggle = (conditionId) => {
    setSelectedConditions((prev) =>
      prev.includes(conditionId)
        ? prev.filter((c) => c !== conditionId)
        : [...prev, conditionId]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedConditions([]);
    setSelectedEventId('evt-all');
    setStockFilter('all');
    setPriceMax(5000);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedConditions.length > 0 ||
    selectedEventId !== 'evt-all' ||
    stockFilter !== 'all' ||
    priceMax < 5000 ||
    searchQuery.length > 0;

  const getConditionCount = (condLabel) =>
    products.filter((p) => p.condition === condLabel).length;

  return (
    <aside className="filter-sidebar-wrapper" aria-label="Inventory Filters">
      {/* Sidebar Header */}
      <div className="filter-header">
        <div className="flex items-center gap-2">
          <Filter size={16} color="var(--emerald-primary)" />
          <h2>Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            className="btn-reset-filters"
            onClick={resetAllFilters}
            title="Reset all filters"
          >
            <RotateCcw size={11} style={{ display: 'inline', marginRight: '4px' }} />
            Reset All
          </button>
        )}
      </div>

      {/* Stock Availability Filter */}
      <div className="filter-group">
        <div className="filter-group-title">
          <span>Availability</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {[
            { id: 'all', label: 'All Inventory' },
            { id: 'in_stock', label: 'In Stock (>0 Units)' },
            { id: 'pallets', label: 'Wholesale Bulk Skids' }
          ].map((type) => (
            <label key={type.id} className="filter-checkbox-item">
              <span className="flex items-center">
                <input
                  type="radio"
                  name="stockFilter"
                  checked={stockFilter === type.id}
                  onChange={() => setStockFilter(type.id)}
                />
                <span>{type.label}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition Grade Filter */}
      <div className="filter-group">
        <div className="filter-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Condition Grade</span>
          <button
            type="button"
            onClick={() => setIsConditionGuideOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--emerald-light)',
              cursor: 'pointer',
              fontSize: '0.725rem',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: 0
            }}
            title="View Condition Grading Guide"
          >
            <span>Guide</span>
            <ShieldCheck size={13} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {CONDITIONS.map((cond) => {
            const count = getConditionCount(cond.id);
            const isChecked = selectedConditions.includes(cond.id);

            return (
              <label key={cond.id} className="filter-checkbox-item">
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleConditionToggle(cond.id)}
                  />
                  <span className={`badge-condition ${cond.badgeColor}`}>
                    {cond.id}
                  </span>
                </span>
                <span className="filter-count-badge">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Warehouse Hub / Event */}
      <div className="filter-group">
        <div className="filter-group-title">
          <span>Warehouse Hub</span>
        </div>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          aria-label="Select Warehouse Hub"
          style={{
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.75rem',
            color: 'var(--text-primary)',
            fontSize: '0.825rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {AUCTION_EVENTS.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} ({event.code})
            </option>
          ))}
        </select>
      </div>

      {/* Max Price Range Slider */}
      <div className="filter-group" style={{ marginBottom: 0 }}>
        <div className="filter-group-title">
          <span>Max Price</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)' }}>
            ${priceMax}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="5000"
          step="50"
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="price-range-slider"
          aria-label="Max Price Range"
        />
        <div className="price-display-row">
          <span>$50</span>
          <span>$5,000+</span>
        </div>
      </div>
    </aside>
  );
};
