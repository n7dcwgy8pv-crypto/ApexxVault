import React from 'react';
import {
  LayoutGrid,
  Smartphone,
  Hammer,
  Coffee,
  Boxes,
  Tent,
  Armchair,
  CheckCircle2,
  Sparkles,
  Percent
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { CATEGORIES } from '../../data/auctionEvents';

const ICON_MAP = {
  LayoutGrid,
  Smartphone,
  Hammer,
  Coffee,
  Boxes,
  Tent,
  Armchair
};

export const SubNav = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    stockFilter,
    setStockFilter,
    products
  } = useAuction();

  const getCategoryCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <nav className="sub-nav" aria-label="Secondary category navigation">
      <div className="container sub-nav-container">
        {/* Category Pills List */}
        <div className="category-nav-list">
          {CATEGORIES.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
            const count = getCategoryCount(cat.id);
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                className={`cat-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <IconComp size={15} />
                <span>{cat.name}</span>
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)',
                    opacity: 0.85,
                    padding: '0 0.35rem',
                    borderRadius: 'var(--radius-xs)',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-card)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Shortcuts */}
        <div className="subnav-quick-filters">
          <button
            className={`quick-filter-chip ${stockFilter === 'in_stock' ? 'active' : ''}`}
            onClick={() => setStockFilter(stockFilter === 'in_stock' ? 'all' : 'in_stock')}
          >
            <CheckCircle2 size={13} color="var(--emerald-light)" />
            <span>Ready for Pickup</span>
          </button>

          <button
            className={`quick-filter-chip ${stockFilter === 'pallets' ? 'active' : ''}`}
            onClick={() => setStockFilter(stockFilter === 'pallets' ? 'all' : 'pallets')}
          >
            <Boxes size={13} color="var(--blue-light)" />
            <span>Wholesale Pallets</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
