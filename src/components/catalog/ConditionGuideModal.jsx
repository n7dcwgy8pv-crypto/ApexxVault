import React from 'react';
import {
  X,
  ShieldCheck,
  Package,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';

export const ConditionGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const conditions = [
    {
      title: 'Brand New (Sealed)',
      badgeClass: 'brand-new',
      icon: <Sparkles size={20} color="var(--emerald-light)" />,
      badgeColor: '#10b981',
      summary: 'Factory sealed in original retail packaging. Zero cosmetic or functional flaws.',
      inspection: [
        'Untouched manufacturer seals and plastic wraps',
        'All original retail accessories, cables, and manuals included',
        'Never registered or activated with manufacturer'
      ]
    },
    {
      title: 'Appears New (Shelf Pull)',
      badgeClass: 'appears-new',
      icon: <Package size={20} color="var(--blue-light)" />,
      badgeColor: '#3b82f6',
      summary: 'Retail overstock or shelf pull. Product is in pristine unused condition.',
      inspection: [
        'Opened or handled for retail store display / inspection only',
        'Unit is 100% pristine with zero signs of wear or usage',
        'Includes all major essential accessories'
      ]
    },
    {
      title: 'Open Box (Inspected & Tested)',
      badgeClass: 'open-box',
      icon: <CheckCircle2 size={20} color="var(--gold-light)" />,
      badgeColor: '#f59e0b',
      summary: 'Power-tested and operational inspection completed by ApexxVault technicians.',
      inspection: [
        'Power-tested, firmware checked, and confirmed 100% fully functional',
        'May show very light handling or repacked in clean generic warehouse packaging',
        'Verified essential components included'
      ]
    },
    {
      title: 'Customer Return (Verified)',
      badgeClass: 'customer-return',
      icon: <AlertTriangle size={20} color="#f97316" />,
      badgeColor: '#f97316',
      summary: 'Store customer returns from major retail chains. Power tested for basic operation.',
      inspection: [
        'Tested to power on and perform primary functions',
        'May show normal signs of prior handling, minor cosmetic blemishes, or missing manual',
        'Sold at steep 60%–85% discounts below MSRP'
      ]
    },
    {
      title: 'Salvage / Repair / As-Is',
      badgeClass: 'salvage',
      icon: <Wrench size={20} color="var(--rose-primary)" />,
      badgeColor: '#f43f5e',
      summary: 'Sold 100% strictly as-is for parts, repair, technician salvage, or rebuilding.',
      inspection: [
        'May have cosmetic defects, power issues, or missing components',
        'Ideal for electronics technicians, mechanics, and scrap recyclers',
        'Priced up to 90%+ below retail'
      ]
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--emerald-bg)',
                color: 'var(--emerald-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                Inspection &amp; Condition Grading Guide
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ApexxVault 100% Verified Intake &amp; Testing Standards
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Trust Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5
            }}
          >
            <strong>🛡️ ApexxVault Transparency Guarantee:</strong> Every lot uploaded to our marketplace is individually cataloged and inspected at our Scarborough depot so you know the exact grade before buying.
          </div>

          {/* Condition Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {conditions.map((c, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                  <div className="flex items-center gap-2">
                    {c.icon}
                    <span className={`badge-condition ${c.badgeClass}`} style={{ fontSize: '0.825rem' }}>
                      {c.title}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  {c.summary}
                </p>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', padding: '0.6rem 0.85rem' }}>
                  <div style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Warehouse Intake Inspection:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {c.inspection.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-primary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
