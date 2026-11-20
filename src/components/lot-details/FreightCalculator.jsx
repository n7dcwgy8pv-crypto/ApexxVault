import React, { useState } from 'react';
import { Truck, Calculator, MapPin, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const FreightCalculator = ({ product }) => {
  const [postalCode, setPostalCode] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setEstimate(null);

    const clean = postalCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!clean || clean.length < 3) {
      setError('Please enter a valid 3 to 6-character Canadian Postal Code (e.g. M1H 2X1).');
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);
      const isPallet = product?.category === 'pallets' || (product?.title || '').toLowerCase().includes('pallet');
      const isTorontoOrGTA = clean.startsWith('M') || clean.startsWith('L');

      if (isPallet) {
        if (isTorontoOrGTA) {
          setEstimate({
            type: 'Local GTA Liftgate Pallet LTL Freight',
            cost: 85.00,
            eta: '1 – 2 Business Days',
            carrier: 'Day & Ross / Direct Freight',
            notes: 'Curbside delivery with power tailgate lift included.'
          });
        } else {
          setEstimate({
            type: 'Ontario Regional Freight (LTL Skid)',
            cost: 145.00,
            eta: '2 – 3 Business Days',
            carrier: 'Manitoulin Transport',
            notes: 'Palletized dock-to-dock or residential liftgate delivery.'
          });
        }
      } else {
        if (isTorontoOrGTA) {
          setEstimate({
            type: 'Same-Day / Next-Day GTA Express Courier',
            cost: 18.50,
            eta: 'Same-Day (Order before 1 PM)',
            carrier: 'Apex Express Courier / Fleet',
            notes: 'Direct from Scarborough Warehouse to your doorstep.'
          });
        } else {
          setEstimate({
            type: 'Canada Post / Purolator Express',
            cost: 28.00,
            eta: '2 – 4 Business Days',
            carrier: 'Purolator Ground',
            notes: 'Tracked & signature-verified parcel freight.'
          });
        }
      }
    }, 450);
  };

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginTop: '1.25rem'
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '0.65rem' }}>
        <div className="flex items-center gap-2">
          <Truck size={16} color="var(--blue-light)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Instant Delivery &amp; Freight Rate Estimator
          </span>
        </div>
        <span style={{ fontSize: '0.725rem', color: 'var(--emerald-light)', background: 'var(--emerald-bg)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', fontWeight: 700 }}>
          Direct from Scarborough
        </span>
      </div>

      <form onSubmit={handleCalculate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Enter Postal Code (e.g. M1H 2X1)"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
            maxLength={7}
            style={{
              width: '100%',
              paddingLeft: '2rem',
              fontSize: '0.85rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: 'var(--radius-sm)'
            }}
          />
          <MapPin size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <button
          type="submit"
          disabled={isCalculating}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-muted)',
            color: 'var(--text-primary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Calculator size={14} />
          <span>{isCalculating ? 'Calculating...' : 'Get Quote'}</span>
        </button>
      </form>

      {error && (
        <div style={{ color: '#fda4af', fontSize: '0.75rem', marginTop: '0.35rem' }}>
          {error}
        </div>
      )}

      {estimate && (
        <div
          style={{
            marginTop: '0.75rem',
            background: 'var(--bg-card)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem'
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {estimate.type}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--emerald-light)', fontSize: '1rem' }}>
              {formatCurrency(estimate.cost)}
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.85rem', marginBottom: '0.35rem' }}>
            <span><strong>Est. Arrival:</strong> {estimate.eta}</span>
            <span><strong>Carrier:</strong> {estimate.carrier}</span>
          </div>

          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
            {estimate.notes} • Free Local Warehouse Pickup is always available!
          </div>
        </div>
      )}
    </div>
  );
};
