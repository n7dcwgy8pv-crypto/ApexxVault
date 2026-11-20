import React, { useState } from 'react';
import {
  X,
  Mail,
  Key,
  CheckCircle2,
  Send,
  ExternalLink,
  ShieldCheck,
  Server,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { getStoredEmailConfig, setStoredEmailConfig } from '../../utils/emailService';
import { API_BASE_URL } from '../../services/api';

export const EmailSettingsModal = ({ isOpen, onClose }) => {
  const { showSuccess, showAlert } = useNotification();
  const [emailConfig, setEmailConfigState] = useState(() => getStoredEmailConfig());
  const [testEmailAddress, setTestEmailAddress] = useState('gamot0105@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredEmailConfig(emailConfig);
    showSuccess('Resend API key & Email Gateway settings saved successfully!');
    onClose();
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      showAlert('Please enter a valid recipient email address.');
      return;
    }

    setIsSendingTest(true);
    setTestResult('');

    try {
      const res = await fetch(`${API_BASE_URL}/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress,
          subject: 'Test Email: ApexVault Live Email Dispatch Confirmed',
          html: `
            <div style="font-family: sans-serif; padding: 24px; color: #1e293b;">
              <h1 style="color: #6366f1;">ApexVault Email Delivery Active!</h1>
              <p>Your Resend API key is connected and operational.</p>
              <p>When customers purchase assets, full invoice receipts and pickup barcodes will be delivered directly to their email address.</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #64748b;">ApexVault Warehouse Depot — 705 Progress Ave #32, Scarborough, ON M1H 2X1</p>
            </div>
          `,
          orderId: 'TEST-001',
          apiKey: emailConfig.resendApiKey || import.meta.env.VITE_RESEND_API_KEY || '',
          fromEmail: emailConfig.fromEmail || import.meta.env.VITE_FROM_EMAIL || 'onboarding@resend.dev',
          fromName: emailConfig.fromName || import.meta.env.VITE_FROM_NAME || 'ApexVault Store'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult(`✅ Live test email delivered to ${testEmailAddress}! (Resend Message ID: ${data.messageId})`);
        showSuccess(`Test email sent to ${testEmailAddress}! Check your inbox.`);
      } else {
        setTestResult(`⚠️ Dispatch response: ${JSON.stringify(data.error || data)}`);
      }
    } catch (err) {
      setTestResult(`⚠️ Connection Error: ${err.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Mail size={22} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Live Email Delivery Gateway</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Powered by Resend API for 100% reliable inbox delivery.
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem' }}>
          {/* Status Alert */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} color="var(--emerald-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a7f3d0' }}>
                Resend API Active &amp; Ready
              </span>
            </div>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Connected to Resend.com
            </span>
          </div>

          <form onSubmit={handleSave}>
            {/* Resend API Key */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1">
                    <Key size={14} color="var(--gold-primary)" /> Resend Email API Key
                  </span>
                </label>
                <a
                  href="https://resend.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}
                >
                  Resend Dashboard <ExternalLink size={12} />
                </a>
              </div>

              <input
                type="text"
                value={emailConfig.resendApiKey}
                onChange={(e) => setEmailConfigState({ ...emailConfig, resendApiKey: e.target.value.trim() })}
                placeholder="re_xxxx_xxxxxxxxxxxxxxxxxxxxxxxx"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
                required
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Invoices will be automatically sent through this Resend account.
              </span>
            </div>

            {/* From Email & Sender Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Sender Email Address
                </label>
                <input
                  type="email"
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfigState({ ...emailConfig, fromEmail: e.target.value })}
                  placeholder="onboarding@resend.dev"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  Use <code>onboarding@resend.dev</code> (or your verified domain).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Sender Business Name
                </label>
                <input
                  type="text"
                  value={emailConfig.fromName}
                  onChange={(e) => setEmailConfigState({ ...emailConfig, fromName: e.target.value })}
                  placeholder="ApexVault Warehouse"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Test Email Box */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Test Live Delivery to Your Email
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Click below to send a live test invoice to your inbox right now:
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="gamot0105@gmail.com"
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className="btn-buy-now"
                  style={{ padding: '0.55rem 1.15rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Send size={14} />
                  <span>{isSendingTest ? 'Sending...' : 'Send Test'}</span>
                </button>
              </div>

              {testResult && (
                <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: testResult.includes('✅') ? '#86efac' : '#f87171', fontWeight: 600 }}>
                  {testResult}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="btn-add-cart"
                onClick={onClose}
              >
                Close
              </button>

              <button
                type="submit"
                className="btn-buy-now"
                style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem' }}
              >
                Save Gateway Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
