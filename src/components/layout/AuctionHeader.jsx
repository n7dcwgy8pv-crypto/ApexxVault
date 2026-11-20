import React from 'react';
import {
  Sparkles,
  PackageCheck,
  ShieldCheck,
  Zap,
  TrendingDown,
  Boxes,
  Hammer,
  DollarSign,
  Flame,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency } from '../../utils/formatters';
import { DropAlertBanner } from '../lead-capture/DropAlertBanner';

export const AuctionHeader = () => {
  const {
    catalogStats,
    selectedCategory,
    setSelectedCategory,
    selectedConditions,
    setSelectedConditions,
    priceMax,
    setPriceMax,
    stockFilter,
    setStockFilter
  } = useAuction();

  const handleQuickFilter = (type) => {
    if (type === 'under100') {
      setPriceMax(100);
    } else if (type === 'brandNew') {
      setSelectedConditions(['Brand New']);
    } else if (type === 'tools') {
      setSelectedCategory('tools');
    } else if (type === 'pallets') {
      setSelectedCategory('pallets');
    } else if (type === 'inStock') {
      setStockFilter('in_stock');
    } else if (type === 'reset') {
      setPriceMax(5000);
      setSelectedConditions([]);
      setSelectedCategory('all');
      setStockFilter('all');
    }
  };

  return (
    <section className="auction-hero-banner" aria-label="Marketplace Hero & Liquidation Highlights">
      <div className="hero-banner-grid">
        {/* Left Column: Headline & Direct CTA */}
        <div>
          <div className="hero-event-badge">
            <Zap size={14} />
            <span>Direct Asset &amp; Liquidation Marketplace</span>
          </div>

          <h1 className="hero-title">
            Direct Overstock &amp; Wholesale Liquidation
          </h1>

          <p className="hero-description">
            Instant buyout on brand-new overstock, certified open box hardware, premium electronics, contractor tools, and wholesale pallets at up to 90% off MSRP.
          </p>

          {/* Highlights Row */}
          <div className="hero-actions-row">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--emerald-bg)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--emerald-light)',
                padding: '0.55rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <PackageCheck size={16} />
              <span>Verified 100% Inspected Lots</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-secondary)',
                padding: '0.55rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <ShieldCheck size={16} color="var(--gold-light)" />
              <span>Same-Day Scarborough Pickup</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Marketplace Metrics */}
        <div className="hero-metrics-box">
          <div className="hero-closing-timer">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--emerald-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingDown size={22} color="var(--emerald-light)" />
              </div>
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Total Live Liquidation Savings
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)', lineHeight: 1.1 }}>
                  {formatCurrency(catalogStats.totalSavings).split('.')[0]} Saved
                </div>
              </div>
            </div>

            <div>
              <span
                style={{
                  background: 'var(--emerald-bg)',
                  color: 'var(--emerald-light)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  letterSpacing: '0.04em'
                }}
              >
                INSTANT BUYOUT
              </span>
            </div>
          </div>

          <div className="metrics-row">
            <div>
              <div className="metric-val">{catalogStats.totalProductsCount}</div>
              <div className="metric-label">Active Lots</div>
            </div>
            <div>
              <div className="metric-val" style={{ color: 'var(--blue-light)' }}>
                {formatCurrency(catalogStats.totalRetailValue).split('.')[0]}
              </div>
              <div className="metric-label">Total MSRP Value</div>
            </div>
            <div>
              <div className="metric-val" style={{ color: 'var(--gold-light)' }}>
                {catalogStats.inStockUnits}
              </div>
              <div className="metric-label">Units in Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick-Filter Navigation Pills */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Filters:
        </span>

        <button
          type="button"
          onClick={() => handleQuickFilter('under100')}
          style={{
            background: priceMax === 100 ? 'var(--emerald-bg)' : 'var(--bg-card)',
            border: `1px solid ${priceMax === 100 ? 'var(--emerald-primary)' : 'var(--border-muted)'}`,
            color: priceMax === 100 ? 'var(--emerald-light)' : 'var(--text-secondary)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Flame size={13} color="var(--rose-primary)" />
          <span>Under $100</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickFilter('brandNew')}
          style={{
            background: selectedConditions.includes('Brand New') ? 'var(--emerald-bg)' : 'var(--bg-card)',
            border: `1px solid ${selectedConditions.includes('Brand New') ? 'var(--emerald-primary)' : 'var(--border-muted)'}`,
            color: selectedConditions.includes('Brand New') ? 'var(--emerald-light)' : 'var(--text-secondary)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Sparkles size={13} color="var(--emerald-light)" />
          <span>Brand New Sealed</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickFilter('tools')}
          style={{
            background: selectedCategory === 'tools' ? 'var(--emerald-bg)' : 'var(--bg-card)',
            border: `1px solid ${selectedCategory === 'tools' ? 'var(--emerald-primary)' : 'var(--border-muted)'}`,
            color: selectedCategory === 'tools' ? 'var(--emerald-light)' : 'var(--text-secondary)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Hammer size={13} color="var(--gold-light)" />
          <span>Power Tools &amp; Hardware</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickFilter('pallets')}
          style={{
            background: selectedCategory === 'pallets' ? 'var(--emerald-bg)' : 'var(--bg-card)',
            border: `1px solid ${selectedCategory === 'pallets' ? 'var(--emerald-primary)' : 'var(--border-muted)'}`,
            color: selectedCategory === 'pallets' ? 'var(--emerald-light)' : 'var(--text-secondary)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Boxes size={13} color="var(--blue-light)" />
          <span>Full Pallets Only</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickFilter('inStock')}
          style={{
            background: stockFilter === 'in_stock' ? 'var(--emerald-bg)' : 'var(--bg-card)',
            border: `1px solid ${stockFilter === 'in_stock' ? 'var(--emerald-primary)' : 'var(--border-muted)'}`,
            color: stockFilter === 'in_stock' ? 'var(--emerald-light)' : 'var(--text-secondary)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <PackageCheck size={13} color="var(--emerald-light)" />
          <span>Scarborough In-Stock</span>
        </button>
      </div>

      {/* VIP Drop Alert Banner */}
      <DropAlertBanner />
    </section>
  );
};
