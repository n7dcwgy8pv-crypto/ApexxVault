import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  PackageCheck,
  MapPin,
  Clock,
  Printer,
  ArrowRight,
  ShieldCheck,
  Mail,
  QrCode as QrIcon
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { formatCurrency } from '../utils/formatters';
import { WAREHOUSE_PICKUP_DETAILS, renderBarcodeSvg } from '../utils/barcodeHelper';
import { lookupOrderFromDB } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

export const CheckoutSuccessPage = () => {
  const { lastOrder, orders } = useAuction();
  const { matchRoute, navigate } = useRouter();

  const routeMatch = matchRoute('/checkout/success/:id');
  const orderIdFromUrl = routeMatch?.params?.id;

  const [dbOrder, setDbOrder] = useState(null);

  useEffect(() => {
    let active = true;
    if (orderIdFromUrl) {
      // Check if lastOrder matches URL
      if (lastOrder && (lastOrder.orderId === orderIdFromUrl || lastOrder._id === orderIdFromUrl || lastOrder.id === orderIdFromUrl)) {
        setDbOrder(lastOrder);
        return;
      }
      // Check if found in orders array
      const matched = (orders || []).find(
        o => o.orderId === orderIdFromUrl || o._id === orderIdFromUrl || o.id === orderIdFromUrl
      );
      if (matched) {
        setDbOrder(matched);
        return;
      }
      // Query backend MongoDB
      lookupOrderFromDB(orderIdFromUrl).then(data => {
        if (active && data) {
          setDbOrder(data);
        }
      });
    }
    return () => { active = false; };
  }, [orderIdFromUrl, lastOrder, orders]);

  // Find order in memory or fallback
  const order = dbOrder || (lastOrder?.orderId === orderIdFromUrl ? lastOrder : null) || (orders || []).find(o => o.orderId === orderIdFromUrl) || lastOrder || {
    orderId: orderIdFromUrl || 'ORD-88204',
    pickupCode: 'APX-9281',
    customer: {
      firstName: 'Valued',
      lastName: 'Customer',
      email: 'customer@example.com',
      phone: '+1 (416) 571-6702'
    },
    items: [],
    subtotal: 169.99,
    tax: 22.10,
    grandTotal: 192.09,
    fulfillmentType: 'pickup',
    status: 'Paid',
    createdAt: new Date().toISOString()
  };

  useEffect(() => {
    // Render Barcode
    if (order?.orderId) {
      const timer = setTimeout(() => {
        renderBarcodeSvg('order-barcode-svg', order.orderId);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [order?.orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="checkout-success-container">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Confirmed Banner */}
        <div className="success-banner-card">
          <div className="success-icon-badge">
            <CheckCircle2 size={44} />
          </div>
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-subtitle">
            Thank you, <strong>{order.customer?.firstName}</strong>. Your liquidation order has been verified and logged into our Scarborough Depot fulfillment queue.
          </p>
          <div className="order-ref-pill">
            <span>Order Reference:</span>
            <strong>{order.orderId}</strong>
          </div>
        </div>

        {/* Digital Pickup Pass Card */}
        <div className="pickup-pass-card">
          <div className="pass-header">
            <div className="flex items-center gap-2">
              <PackageCheck size={20} color="var(--accent-gold)" />
              <h3 className="pass-title">Official Warehouse Pickup Pass</h3>
            </div>
            <span className="pass-badge">READY FOR LOADING</span>
          </div>

          <div className="pass-body-grid">
            {/* Left: Barcode & QR Code */}
            <div className="pass-codes-col">
              <div className="pass-barcode-wrap">
                <svg id="order-barcode-svg" style={{ maxWidth: '100%' }}></svg>
              </div>

              <div className="pass-qr-wrap">
                <QRCodeSVG
                  value={`https://www.apexxvault.com/orders/${order.orderId}?pickup=${order.pickupCode}`}
                  size={120}
                  level="M"
                />
                <span className="qr-caption">Scan at Scarborough Unit #32 Loading Desk</span>
              </div>
            </div>

            {/* Right: Pickup Location & Instructions */}
            <div className="pass-instructions-col">
              <div className="pass-info-row">
                <MapPin size={16} className="pass-icon" />
                <div>
                  <strong>Warehouse Address:</strong>
                  <p>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</p>
                </div>
              </div>

              <div className="pass-info-row">
                <Clock size={16} className="pass-icon" />
                <div>
                  <strong>Loading Hours:</strong>
                  <p>{WAREHOUSE_PICKUP_DETAILS.hours}</p>
                </div>
              </div>

              <div className="pass-info-row">
                <ShieldCheck size={16} className="pass-icon" />
                <div>
                  <strong>Release Requirements:</strong>
                  <p>Present this digital pass or printed barcode with 1 piece of matching photo ID at Unit #32.</p>
                </div>
              </div>

              <div className="pass-info-row">
                <Mail size={16} className="pass-icon" />
                <div>
                  <strong>Invoice &amp; Receipt:</strong>
                  <p>Dispatched to <strong>{order.customer?.email}</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="pass-footer-actions">
            <button type="button" className="btn-secondary" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print Pickup Pass</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/collections/all')}
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Order Items Breakdown */}
        {order.items && order.items.length > 0 && (
          <div className="success-items-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Order Summary</h3>
            <div className="success-items-list">
              {order.items.map((item, idx) => {
                const prod = item.product || {};
                return (
                  <div key={idx} className="success-item-row">
                    <div>
                      <strong>{prod.title || 'Liquidation Asset'}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                        Qty: {item.quantity} • Lot #{prod.sku || 'N/A'} • {prod.condition || 'Inspected'}
                      </p>
                    </div>
                    <strong>{formatCurrency((item.price || prod.price || 0) * (item.quantity || 1))}</strong>
                  </div>
                );
              })}
            </div>

            <div className="success-totals-box">
              <div className="flex justify-between" style={{ marginBottom: '0.35rem' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '0.35rem' }}>
                <span>Ontario HST (13%)</span>
                <span>{formatCurrency(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between font-bold" style={{ fontSize: '1.15rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span>Total Paid (CAD)</span>
                <span style={{ color: 'var(--ink-primary)' }}>{formatCurrency(order.grandTotal || 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
