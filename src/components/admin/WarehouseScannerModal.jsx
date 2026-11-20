import React, { useState, useEffect } from 'react';
import {
  X,
  ScanLine,
  Search,
  CheckCircle2,
  PackageCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Barcode,
  Sparkles,
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';

export const WarehouseScannerModal = () => {
  const {
    isScannerOpen,
    setIsScannerOpen,
    orders,
    lookupOrder,
    openEmailPreview
  } = useAuction();

  const [scanInput, setScanInput] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [pickedItems, setPickedItems] = useState({});
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    if (orders.length > 0 && !activeOrder) {
      setActiveOrder(orders[0]); // default to latest order for fast testing
    }
  }, [orders, activeOrder]);

  if (!isScannerOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const found = lookupOrder(scanInput);
    if (found) {
      setActiveOrder(found);
      setIsReleased(false);
      setPickedItems({});
    }
  };

  const toggleItemPicked = (idx) => {
    setPickedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleMarkReleased = () => {
    setIsReleased(true);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsScannerOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)'
            }}>
              <ScanLine size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 style={{ fontSize: '1.2rem' }}>Warehouse Barcode Scanner & Release Hub</h2>
                <span style={{
                  background: 'rgba(14, 165, 233, 0.2)',
                  color: '#38bdf8',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(14, 165, 233, 0.4)'
                }}>
                  BAY #4 SCANNER
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Scan or type barcode, pickup pass code, or customer email to pull up invoice details and item checklist.
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={() => setIsScannerOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Barcode Scanner Input Form */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Scan invoice barcode, QR code or enter Order ID (e.g. ORD-102938, PK-4819)..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  autoFocus
                />
                <Barcode size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyan-primary)' }} />
              </div>

              <button
                type="submit"
                className="btn-bulk-upload"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
              >
                <Search size={16} /> Look Up
              </button>
            </div>

            {/* Quick Demo Order Chips */}
            {orders.length > 0 && (
              <div className="flex items-center gap-2" style={{ marginTop: '0.65rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recent Orders:</span>
                {orders.slice(0, 4).map((o) => (
                  <button
                    key={o.orderId}
                    type="button"
                    onClick={() => {
                      setActiveOrder(o);
                      setScanInput(o.orderId);
                      setIsReleased(false);
                      setPickedItems({});
                    }}
                    style={{
                      background: activeOrder?.orderId === o.orderId ? 'var(--cyan-primary)' : 'var(--bg-card)',
                      color: activeOrder?.orderId === o.orderId ? '#0f172a' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {o.orderId} ({o.customer?.firstName || 'Customer'})
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Active Scanned Order Details */}
          {activeOrder ? (
            <div>
              {/* Order Status Banner */}
              <div style={{
                background: isReleased ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                border: `1px solid ${isReleased ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scanned Order ID</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--gold-hover)' }}>
                      {activeOrder.orderId}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pickup Pass Code</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-primary)' }}>
                      {activeOrder.pickupCode}
                    </div>
                  </div>

                  <div>
                    {isReleased ? (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <CheckCircle2 size={16} /> RELEASED TO CUSTOMER
                      </span>
                    ) : (
                      <span style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <Clock size={16} /> AWAITING PICKUP RELEASE
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Records & Warehouse Hub Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.25rem', fontSize: '0.825rem' }}>
                  {/* Customer Records */}
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={14} color="var(--cyan-primary)" /> Customer Information (Verified ID Required)
                    </div>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <strong>Name:</strong> {activeOrder.customer?.firstName} {activeOrder.customer?.lastName}<br />
                      <strong>Email:</strong> {activeOrder.customer?.email}<br />
                      <strong>Phone:</strong> {activeOrder.customer?.phone}<br />
                      <strong>Address:</strong> {activeOrder.customer?.street}, {activeOrder.customer?.city}, {activeOrder.customer?.province} {activeOrder.customer?.postalCode}
                    </div>
                  </div>

                  {/* Pickup Hub & Payment Info */}
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="var(--emerald-primary)" /> Pickup Location & Payment
                    </div>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <strong>Facility:</strong> {WAREHOUSE_PICKUP_DETAILS.facilityName}<br />
                      <strong>Bay:</strong> {WAREHOUSE_PICKUP_DETAILS.bay}<br />
                      <strong>Payment:</strong> Paid via Stripe ({activeOrder.cardBrand?.toUpperCase()} •••• {activeOrder.cardLast4})<br />
                      <strong>Invoice Dispatched:</strong> {formatDate(activeOrder.date)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warehouse Items Retrieval Checklist */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.65rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Warehouse Inventory Items to Release ({activeOrder.items.length})
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Check items as you retrieve them from the bay
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeOrder.items.map(({ product, quantity }, idx) => {
                    const isChecked = pickedItems[idx];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleItemPicked(idx)}
                        style={{
                          background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
                          border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!isChecked}
                          onChange={() => {}}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-primary)', cursor: 'pointer' }}
                        />

                        <img
                          src={product.images && product.images[0] ? product.images[0] : ''}
                          alt=""
                          style={{ width: '50px', height: '42px', objectFit: 'cover', borderRadius: '4px' }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {product.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            SKU: <strong style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{product.sku}</strong> • Condition: <strong style={{ color: 'var(--gold-hover)' }}>{product.condition}</strong> • Location: <strong style={{ color: 'var(--cyan-primary)' }}>{product.warehouseLocation || 'Bay 4'}</strong>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                            Qty: {quantity}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {formatCurrency(product.price * quantity)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => openEmailPreview(activeOrder)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--cyan-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <FileText size={15} /> View Sent Customer Email Invoice
                </button>

                {!isReleased ? (
                  <button
                    type="button"
                    className="btn-buy-now"
                    onClick={handleMarkReleased}
                    style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <PackageCheck size={18} /> Confirm Handover & Mark Released
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-add-cart"
                    onClick={() => setIsScannerOpen(false)}
                    style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    Close Scanner
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p>No order matching your search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
