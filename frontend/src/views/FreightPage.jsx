import React, { useState } from 'react';
import {
  Truck,
  Calculator,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { formatCurrency } from '../utils/formatters';
import { WAREHOUSE_PICKUP_DETAILS } from '../utils/barcodeHelper';

export const FreightPage = () => {
  const [destPostal, setDestPostal] = useState('');
  const [palletCount, setPalletCount] = useState(1);
  const [deliveryType, setDeliveryType] = useState('commercial_dock'); // 'commercial_dock' | 'liftgate_residential'
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!destPostal.trim() || destPostal.length < 3) return;

    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      const isTorontoGTA = /^[MmLlLkK]/.test(destPostal.trim());
      const baseFreight = isTorontoGTA ? 95 : 185;
      const liftgateFee = deliveryType === 'liftgate_residential' ? 45 : 0;
      const totalFreight = (baseFreight * palletCount) + liftgateFee;

      setQuote({
        postal: destPostal.toUpperCase(),
        region: isTorontoGTA ? 'Greater Toronto & Hamilton Area (GTA)' : 'Ontario Regional Corridor',
        carrier: isTorontoGTA ? 'ApexxVault Dedicated Express Freight' : 'Day & Ross / Fastfrate LTL Logistics',
        transit: isTorontoGTA ? 'Next-Day Delivery' : '2–3 Business Days',
        baseRate: baseFreight * palletCount,
        liftgateRate: liftgateFee,
        total: totalFreight
      });
    }, 600);
  };

  return (
    <div className="content-page-wrapper">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Freight &amp; Pallet Estimator</span>
        </div>

        <div className="content-header-card">
          <span className="section-eyebrow">COMMERCIAL LTL LOGISTICS</span>
          <h1 className="content-page-title">Pallet &amp; Wholesale Freight Estimator</h1>
          <p className="content-page-lead">
            Buying full pallets or heavy contractor machinery? ApexxVault provides direct dock-to-dock and liftgate residential LTL freight across Ontario and Canada.
          </p>
        </div>

        <div className="freight-calculator-card">
          <form onSubmit={handleCalculate} className="freight-form-grid">
            <div className="checkout-field-group">
              <label>Destination Canadian Postal Code</label>
              <input
                type="text"
                required
                placeholder="e.g. M1H 2X1 or L5T 2B2"
                value={destPostal}
                onChange={(e) => setDestPostal(e.target.value)}
                maxLength={7}
              />
            </div>

            <div className="checkout-field-group">
              <label>Number of Standard Pallets (48" x 40")</label>
              <select
                value={palletCount}
                onChange={(e) => setPalletCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                  <option key={n} value={n}>{n} Pallet{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="checkout-field-group" style={{ gridColumn: '1 / -1' }}>
              <label>Delivery Location Type</label>
              <div className="freight-radio-group">
                <label className="radio-filter-label">
                  <input
                    type="radio"
                    name="delivery-type"
                    checked={deliveryType === 'commercial_dock'}
                    onChange={() => setDeliveryType('commercial_dock')}
                  />
                  <span>Commercial Loading Dock / Forklift Available ($0 liftgate)</span>
                </label>
                <label className="radio-filter-label">
                  <input
                    type="radio"
                    name="delivery-type"
                    checked={deliveryType === 'liftgate_residential'}
                    onChange={() => setDeliveryType('liftgate_residential')}
                  />
                  <span>Residential / Commercial Ground Level with Hydraulic Liftgate (+$45)</span>
                </label>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={calculating}>
                <Calculator size={18} />
                <span>{calculating ? 'Calculating Commercial Rates...' : 'Calculate Pallet Freight'}</span>
              </button>
            </div>
          </form>

          {quote && (
            <div className="freight-result-box">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="quote-carrier-tag">{quote.carrier}</span>
                  <h3 className="quote-region-heading">{quote.region}</h3>
                  <p className="quote-transit-sub">Estimated Transit: <strong>{quote.transit}</strong></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="quote-final-amount">{formatCurrency(quote.total)} CAD</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>+ 13% Ontario HST</p>
                </div>
              </div>

              <div className="quote-breakdown-row">
                <span>Base LTL Freight: {formatCurrency(quote.baseRate)}</span>
                {quote.liftgateRate > 0 && <span>Hydraulic Liftgate Service: {formatCurrency(quote.liftgateRate)}</span>}
                <span>Dock Origin: Scarborough (705 Progress Ave #32)</span>
              </div>
            </div>
          )}
        </div>

        {/* Free Local Pickup Notice */}
        <div className="freight-pickup-alternative">
          <div className="flex items-center gap-3">
            <MapPin size={24} color="var(--accent-gold)" />
            <div>
              <h4>Prefer to pick up yourself with zero freight fees?</h4>
              <p>
                Commercial freight dock loading is completely free at <strong>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</strong>. Bring your box truck, flatbed, or cargo trailer during warehouse operating hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightPage;
