import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, MessageCircle, MapPin, X } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';

export const LiveActivityTicker = () => {
  const { orders } = useAuction();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Derive genuine activities from real orders (Finding A2: Eliminate Fake Social Proof)
  const realActivities = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return orders
      .filter((o) => o && o.items && o.items.length > 0)
      .slice(0, 8)
      .map((o) => {
        const firstName = o.customer?.firstName || 'Local Buyer';
        const city = o.customer?.city || 'Scarborough';
        const itemTitle = o.items[0]?.product?.title || 'Vault Asset';
        const orderDate = new Date(o.createdAt || o.date || Date.now());
        const diffMins = Math.max(1, Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60)));
        const timeAgo = diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ago`;
        return {
          name: firstName,
          location: city,
          action: o.status === 'Paid' ? 'completed order for' : 'placed reserve on',
          item: itemTitle,
          time: timeAgo
        };
      });
  }, [orders]);

  useEffect(() => {
    if (isDismissed || realActivities.length === 0) return;

    // Show initial notification after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Rotate every 16 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % realActivities.length);
        setIsVisible(true);
      }, 600);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed, realActivities.length]);

  // If no genuine activity exists or user dismissed, stay completely silent
  if (isDismissed || !isVisible || realActivities.length === 0) return null;

  const current = realActivities[currentIdx] || realActivities[0];
  if (!current) return null;

  return (
    <aside
      aria-label="Live community reservation alerts"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '20px',
        zIndex: 90,
        background: 'var(--bg-glass-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem 0.85rem',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '340px',
        animation: 'floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--emerald-bg)',
          color: 'var(--emerald-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Sparkles size={16} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>
          <strong>{current.name}</strong> from <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>{current.location}</span> {current.action} <strong style={{ display: 'inline-block', maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'bottom' }}>{current.item}</strong>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
          <span>{current.time}</span>
          <span>• Verified Order</span>
        </div>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          width: '44px',
          height: '44px',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: 'var(--radius-full)'
        }}
        title="Dismiss alert"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </aside>
  );
};
