import React from 'react';
import { Bell, Sparkles, ArrowRight, Zap, Flame } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';

export const DropAlertBanner = () => {
  const { setIsDropAlertOpen } = useAuction();

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1.5rem',
        margin: '1.25rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)'
      }}
    >
      <div className="flex items-center gap-3">
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--gold-bg)',
            color: 'var(--gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Bell size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>VIP Liquidation Drop Alerts</span>
            <span style={{ fontSize: '0.7rem', background: 'var(--gold-bg)', color: 'var(--gold-light)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
              NEW
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            Get instant SMS &amp; email alerts when new mystery pallets, electronics, or contractor tool skids arrive.
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsDropAlertOpen(true)}
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          padding: '0.5rem 1.15rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.825rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
          border: 'none',
          boxShadow: 'var(--shadow-gold)'
        }}
      >
        <Sparkles size={14} />
        <span>Get Drop Alerts</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
