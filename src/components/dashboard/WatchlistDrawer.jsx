import React from 'react';
import { X, Heart, Trash2, ShoppingCart, PackageOpen, Zap } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency } from '../../utils/formatters';

export const WatchlistDrawer = () => {
  const {
    isWatchlistOpen,
    setIsWatchlistOpen,
    watchlist,
    toggleWatchlist,
    products,
    setSelectedProductModal,
    addToCart,
    buyNowDirect
  } = useAuction();

  if (!isWatchlistOpen) return null;

  const savedProducts = products.filter((p) => watchlist.includes(p.id));

  return (
    <div className="modal-backdrop" onClick={() => setIsWatchlistOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          marginLeft: 'auto',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: '0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Heart size={20} color="#f43f5e" fill="#f43f5e" />
            <h3 style={{ fontSize: '1.15rem' }}>Saved Assets ({savedProducts.length})</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsWatchlistOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {savedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <PackageOpen size={42} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>Your saved list is empty.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click the heart icon on any asset card to bookmark it for later.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {savedProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={product.images && product.images[0] ? product.images[0] : ''}
                      alt=""
                      style={{ width: '70px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={() => {
                        setIsWatchlistOpen(false);
                        setSelectedProductModal(product);
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {product.sku}
                      </div>
                      <h4
                        style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                        onClick={() => {
                          setIsWatchlistOpen(false);
                          setSelectedProductModal(product);
                        }}
                      >
                        {product.title}
                      </h4>
                      <div className="flex items-center justify-between" style={{ marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--emerald-primary)', fontFamily: 'var(--font-mono)' }}>
                          {formatCurrency(product.price)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#86efac' }}>
                          {product.stockQty} in stock
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        className="btn-buy-now"
                        onClick={() => {
                          addToCart(product, 1);
                        }}
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        <ShoppingCart size={13} />
                      </button>
                      <button
                        onClick={() => toggleWatchlist(product.id)}
                        style={{ color: 'var(--text-muted)', fontSize: '0.7rem', padding: '2px', alignSelf: 'center' }}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
