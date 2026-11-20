import React from 'react';
import { Sparkles, MapPin, ShieldCheck, Truck, Zap, Sun, Moon } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency } from '../../utils/formatters';

export const AnnouncementBar = () => {
  const { catalogStats, theme, toggleTheme } = useAuction();

  return (
    <aside className="announcement-bar" aria-label="Announcement ticker and warehouse status">
      <div className="container announcement-content">
        <div className="announcement-badge">
          <span className="live-dot" aria-hidden="true"></span>
          <span>Live Asset Vault</span>
        </div>

        <div className="announcement-ticker">
          <span className="ticker-item">
            <ShieldCheck size={13} color="var(--emerald-primary)" />
            <span>Verified 100% Inspected &amp; Tested Inventory</span>
          </span>
          <span className="ticker-divider">•</span>
          <span className="ticker-item">
            <Truck size={13} color="var(--blue-light)" />
            <span>Same-Day Warehouse Pickup &amp; Express Freight</span>
          </span>
          <span className="ticker-divider">•</span>
          <span className="ticker-item">
            <Zap size={13} color="var(--gold-light)" />
            <span>Instant Buyout — Up to 90% Below MSRP</span>
          </span>
          {catalogStats.totalSavings > 0 && (
            <>
              <span className="ticker-divider">•</span>
              <span className="ticker-item" style={{ color: 'var(--emerald-light)', fontWeight: 800 }}>
                <Sparkles size={13} />
                <span>{formatCurrency(catalogStats.totalSavings)} Total Savings Active</span>
              </span>
            </>
          )}
        </div>

        <div className="announcement-right-links">
          <span className="flex items-center gap-1">
            <MapPin size={12} color="var(--emerald-light)" />
            <span>Warehouse: <strong>Scarborough</strong></span>
          </span>
        </div>
      </div>
    </aside>
  );
};
