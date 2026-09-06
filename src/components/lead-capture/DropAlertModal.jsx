import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Mail,
  User,
  Boxes,
  Hammer,
  Coffee,
  Check
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { useNotification } from '../../context/NotificationContext';
import { subscribeDropAlerts } from '../../services/api';

export const DropAlertModal = () => {
  const { isDropAlertOpen, setIsDropAlertOpen, currentUser, savedCustomer } = useAuction();
  const { showSuccess, showAlert } = useNotification();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [notifyVia, setNotifyVia] = useState('both');
  const [selectedCats, setSelectedCats] = useState(['pallets', 'tools', 'electronics']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isDropAlertOpen) {
      const src = currentUser || savedCustomer || {};
      setName(`${src.firstName || ''} ${src.lastName || ''}`.trim());
      setEmail(src.email || '');
      setPhone(src.phone || '');
      setErrorMsg('');
    }
  }, [isDropAlertOpen, currentUser, savedCustomer]);

  if (!isDropAlertOpen) return null;

  const categories = [
    { id: 'pallets', label: 'Wholesale & Mystery Pallets', icon: '📦' },
    { id: 'tools', label: 'Power Tools & Hardware', icon: '🛠️' },
    { id: 'electronics', label: 'Consumer Electronics & Tech', icon: '📱' },
    { id: 'appliances', label: 'Home & Kitchen Appliances', icon: '☕' },
    { id: 'outdoor', label: 'Sports, Patio & Outdoor', icon: '🏕️' }
  ];

  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeDropAlerts({
        email: email.trim(),
        phone: phone.trim(),
        name: name.trim(),
        preferredCategories: selectedCats,
        notifyVia
      });

      if (res.success) {
        showSuccess(res.message || 'Subscribed to VIP Drop Alerts!');
        setIsDropAlertOpen(false);
      } else {
        setErrorMsg(res.error || 'Failed to subscribe.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error subscribing to alerts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsDropAlertOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gold-bg)',
                color: 'var(--gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                🔔 VIP Drop Alerts &amp; Lead Access
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Be first in line when high-value pallets and tier-1 overstock drop
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={() => setIsDropAlertOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem' }}>
          {errorMsg && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                color: '#fda4af',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Contact Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Phone (for SMS Alerts)
              </label>
              <input
                type="tel"
                placeholder="+1 (647) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Preferred Channels */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Notification Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {[
                { id: 'both', label: 'Email & SMS' },
                { id: 'email', label: 'Email Only' },
                { id: 'sms', label: 'SMS Only' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNotifyVia(opt.id)}
                  style={{
                    padding: '0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: notifyVia === opt.id ? 'var(--gold-bg)' : 'var(--bg-secondary)',
                    border: `1px solid ${notifyVia === opt.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                    color: notifyVia === opt.id ? 'var(--gold-light)' : 'var(--text-secondary)'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Interests */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Categories of Interest:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {categories.map((cat) => {
                const isSelected = selectedCats.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                      border: `1px solid ${isSelected ? 'var(--border-muted)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.825rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {cat.icon} {cat.label}
                    </span>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        background: isSelected ? 'var(--emerald-primary)' : 'transparent',
                        border: `1.5px solid ${isSelected ? 'var(--emerald-primary)' : 'var(--border-muted)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}
                    >
                      {isSelected && <Check size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              padding: '0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            {isSubmitting ? (
              <span>Subscribing...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Subscribe to Instant Drop Alerts</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
