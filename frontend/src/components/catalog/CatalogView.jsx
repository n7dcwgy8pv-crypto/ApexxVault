import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductListItem } from './ProductListItem';
import { useAuction } from '../../context/AuctionContext';
import { PackageOpen, UploadCloud, Database, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const CatalogView = () => {
  const {
    filteredProducts,
    viewMode,
    isLoadingProducts,
    resetCatalog,
    isAdmin,
    setIsAdminPortalOpen
  } = useAuction();

  const [visibleCount, setVisibleCount] = useState(24);

  if (isLoadingProducts) {
    return (
      <div
        style={{
          padding: '5rem 2rem',
          textAlign: 'center',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <Loader2 size={36} style={{ margin: '0 auto 1rem', color: 'var(--emerald-light)', animation: 'spin 1s linear infinite' }} />
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Loading Live Catalog from Database...
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Syncing with MongoDB Asset Cluster
        </p>
      </div>
    );
  }

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  if (filteredProducts.length === 0) {
    return (
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--emerald-bg)',
            color: 'var(--emerald-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <Database size={30} />
        </div>

        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          No Matching Inventory Found
        </h3>
        <p
          style={{
            maxWidth: '480px',
            margin: '0 auto 1.75rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: '1.55'
          }}
        >
          Try clearing your active filters, or import a new CSV / Excel manifest to populate the store catalog with wholesale assets.
        </p>

        <div className="flex items-center justify-center gap-3" style={{ flexWrap: 'wrap' }}>
          {isAdmin ? (
            <button
              onClick={() => setIsAdminPortalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: 'var(--shadow-emerald)',
                cursor: 'pointer'
              }}
            >
              <span>👑 Open Admin Portal to Add Products</span>
            </button>
          ) : (
            <button
              onClick={() => resetCatalog && resetCatalog()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: 'var(--shadow-emerald)',
                cursor: 'pointer'
              }}
            >
              <span>Clear Filters &amp; View All Lots</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="catalog-grid">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedProducts.map((product) => (
            <ProductListItem key={product.id || product._id} product={product} />
          ))}
        </div>
      )}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-primary)',
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            Load More Products ({filteredProducts.length - visibleCount} Remaining)
          </button>
        </div>
      )}
    </div>
  );
};
