import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, MessageCircle, MapPin, X } from 'lucide-react';

const RECENT_ACTIVITIES = [
  { name: 'David M.', location: 'Markham', action: 'reserved', item: 'Milwaukee M18 Deep Cut Band Saw', time: '3 mins ago' },
  { name: 'Sarah K.', location: 'Scarborough', action: 'inquired via DM for', item: 'Apple MacBook Air M3 256GB', time: '7 mins ago' },
  { name: 'Contractor Pro', location: 'Vaughan', action: 'booked pickup for', item: 'DeWalt 20V Max Impact Driver Combo', time: '12 mins ago' },
  { name: 'Alex P.', location: 'Toronto Downtown', action: 'reserved', item: 'DeLonghi Magnifica S Espresso', time: '18 mins ago' },
  { name: 'Bulk Buyer', location: 'Mississauga', action: 'made an offer on', item: 'Wholesale Pallet of Return Tech', time: '24 mins ago' }
];

export const LiveActivityTicker = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show initial after 3.5 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    // Loop through notifications every 14 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
        setIsVisible(true);
      }, 600);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = RECENT_ACTIVITIES[currentIdx];

  return (
    <aside
      aria-label="Live community reservation alerts"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 90,
        background: 'var(--bg-glass-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '360px',
        animation: 'floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
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
          <strong>{current.name}</strong> from <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>{current.location}</span> {current.action} <strong>{current.item}</strong>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
          <span>{current.time}</span>
          <span>• Verified Buyer</span>
        </div>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px'
        }}
        title="Dismiss"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </aside>
  );
};
