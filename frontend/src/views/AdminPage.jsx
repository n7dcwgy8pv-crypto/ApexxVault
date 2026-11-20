import React, { useState } from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { AdminPortalModal } from '../components/admin/AdminPortalModal';
import { useNotification } from '../context/NotificationContext';

export const AdminPage = () => {
  const {
    currentUser,
    isLoggedIn,
    isAdmin,
    login,
    setIsAdminPortalOpen
  } = useAuction();

  const { navigate } = useRouter();
  const { showSuccess, showAlert } = useNotification();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await login(adminEmail, adminPassword);
      if (res.success) {
        if (res.user?.role === 'admin') {
          showSuccess('Admin authentication verified.');
        } else {
          showAlert('Account authenticated, but you do not possess administrator credentials.');
        }
      } else {
        showAlert(res.error || 'Invalid administrator credentials.');
      }
    } catch (err) {
      showAlert(`Authentication error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // If already authenticated as admin, render the full admin portal inline
  if (isLoggedIn && isAdmin) {
    return (
      <div className="admin-page-container">
        {/* Render the modal content inline/always open */}
        <AdminPortalModal forceInline={true} onClose={() => navigate('/')} />
      </div>
    );
  }

  // Admin Barrier Screen (Re-authentication required)
  return (
    <div className="admin-barrier-container">
      <div className="container" style={{ maxWidth: '440px', padding: '4rem 1rem' }}>
        <div className="admin-barrier-card">
          <div className="barrier-icon-badge" style={{ background: 'transparent', padding: 0 }}>
            <img
              src="/apexxvault-emblem.png"
              alt="ApexxVault Emblem"
              style={{ height: '64px', width: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>

          <h1 className="barrier-title">Admin Management Suite</h1>
          <p className="barrier-subtitle">
            Protected endpoint for ApexxVault warehouse staff and catalog liquidators. Re-authentication required.
          </p>

          <form onSubmit={handleAdminLogin} className="barrier-form">
            <div className="checkout-field-group">
              <label>Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@apexxvault.com"
              />
            </div>

            <div className="checkout-field-group">
              <label>Admin Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn-primary barrier-submit-btn"
              disabled={submitting}
            >
              <Lock size={16} />
              <span>{submitting ? 'Verifying Credentials...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          <div className="barrier-footer-note">
            <p>
              Administrative credentials: <code>admin@apexxvault.com</code>
            </p>
            <Link to="/" style={{ color: 'var(--accent-gold)', fontSize: '0.825rem', marginTop: '0.5rem', display: 'inline-block' }}>
              &larr; Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
