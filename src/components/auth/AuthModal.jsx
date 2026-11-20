import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Building,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    resetTokenFromUrl,
    login,
    register,
    forgotPassword,
    resetPassword
  } = useAuction();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regProvince, setRegProvince] = useState('Ontario');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot / Reset password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResult, setForgotResult] = useState(null);
  const [resetToken, setResetToken] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (resetTokenFromUrl) {
      setResetToken(resetTokenFromUrl);
    }
  }, [resetTokenFromUrl]);

  // Reset errors on mode change
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(loginEmail, loginPassword);
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials');
    } else {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !regFirstName.trim() ||
      !regLastName.trim() ||
      !regEmail.trim() ||
      !regPhone.trim() ||
      !regStreet.trim() ||
      !regCity.trim() ||
      !regPostalCode.trim() ||
      !regPassword
    ) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      street: regStreet,
      city: regCity,
      province: regProvince,
      postalCode: regPostalCode,
      password: regPassword
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create account.');
    } else {
      setRegFirstName('');
      setRegLastName('');
      setRegEmail('');
      setRegPhone('');
      setRegStreet('');
      setRegCity('');
      setRegPostalCode('');
      setRegPassword('');
      setRegConfirmPassword('');
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    const res = await forgotPassword(forgotEmail);
    setIsLoading(false);

    if (res.success) {
      setForgotResult(res);
      setSuccessMessage(res.message || 'Password reset link generated!');
    } else {
      setErrorMessage(res.error || 'Email address not found.');
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resetToken.trim() || !resetNewPassword) {
      setErrorMessage('Please provide the reset token and your new password.');
      return;
    }

    if (resetNewPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(resetToken, resetNewPassword);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to reset password.');
    }
  };


  return (
    <div className="modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: authModalMode === 'register' ? '640px' : '460px', transition: 'max-width 0.25s ease' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--emerald-bg)',
                color: 'var(--emerald-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Lock size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                {authModalMode === 'login' && 'Sign In to ApexVault'}
                {authModalMode === 'register' && 'Create Customer Account'}
                {authModalMode === 'forgot' && 'Reset Your Password'}
                {authModalMode === 'reset' && 'Set New Password'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {authModalMode === 'login' && 'Access direct liquidation pricing & instant buyout'}
                {authModalMode === 'register' && 'Register to buy overstock, liquidation lots & skids'}
                {authModalMode === 'forgot' && 'We will send secure instructions to your email'}
                {authModalMode === 'reset' && 'Enter your security token and new password'}
              </p>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Auth Mode Tabs (Login / Register) */}
        {(authModalMode === 'login' || authModalMode === 'register') && (
          <div style={{ padding: '1rem 1.75rem 0' }}>
            <div className="tab-button-group">
              <button
                type="button"
                className={`tab-btn ${authModalMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthModalMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-btn ${authModalMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthModalMode('register')}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Error Banner */}
          {errorMessage && (
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
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: 'var(--emerald-light)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* =================================================================
              1. LOGIN FORM
             ================================================================= */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex.mercer@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    style={{ fontSize: '0.775rem', color: 'var(--emerald-light)', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  boxShadow: 'var(--shadow-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
              </button>

            </form>
          )}

          {/* =================================================================
              2. REGISTER FORM
             ================================================================= */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              {/* Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    First Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="Alex"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      style={{ width: '100%', paddingLeft: '2.3rem' }}
                    />
                    <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mercer"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="alex.mercer@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      style={{ width: '100%', paddingLeft: '2.3rem' }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Phone Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (416) 555-0199"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      style={{ width: '100%', paddingLeft: '2.3rem' }}
                    />
                    <Phone size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Street Address (for Invoices &amp; Warehouse Pickup Release) *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="77 Front Street West, Suite 400"
                    value={regStreet}
                    onChange={(e) => setRegStreet(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.3rem' }}
                  />
                  <MapPin size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* City, Province, Postal Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Toronto"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Province
                  </label>
                  <select
                    value={regProvince}
                    onChange={(e) => setRegProvince(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Ontario">Ontario (ON)</option>
                    <option value="Quebec">Quebec (QC)</option>
                    <option value="British Columbia">British Columbia (BC)</option>
                    <option value="Alberta">Alberta (AB)</option>
                    <option value="Manitoba">Manitoba (MB)</option>
                    <option value="Nova Scotia">Nova Scotia (NS)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="M5J 2T6"
                    value={regPostalCode}
                    onChange={(e) => setRegPostalCode(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Password Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Password (min 6 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    padding: '0.75rem 1.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: 'var(--shadow-emerald)',
                    cursor: 'pointer'
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              3. FORGOT PASSWORD FORM
             ================================================================= */}
          {authModalMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Enter the email address registered with your ApexVault account. We will dispatch a password reset link to your inbox.
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Your Account Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="alex.mercer@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {forgotResult?.resetToken && (
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Direct Reset Link Preview:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setResetToken(forgotResult.resetToken);
                      setAuthModalMode('reset');
                    }}
                    style={{
                      color: 'var(--emerald-light)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>Click to Open Password Reset Screen</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-emerald)',
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              4. RESET PASSWORD FORM
             ================================================================= */}
          {authModalMode === 'reset' && (
            <form onSubmit={handleResetSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Reset Security Token *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter security token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}
                  />
                  <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  New Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-emerald)',
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
