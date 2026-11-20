const STRIPE_CONFIG_KEY = 'apexvault_stripe_config';

export const DEFAULT_STRIPE_CONFIG = {
  publishableKey: 'pk_test_51MzDemoApexVaultPublishableKey001',
  isLiveMode: false,
  merchantName: 'ApexVault Inc.',
  currency: 'cad',
  accountEmail: 'payments@apexvault.ca',
  connected: true
};

export const getStoredStripeConfig = () => {
  try {
    const data = localStorage.getItem(STRIPE_CONFIG_KEY);
    if (data) {
      return { ...DEFAULT_STRIPE_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error reading stripe config:', e);
  }
  return DEFAULT_STRIPE_CONFIG;
};

export const setStoredStripeConfig = (config) => {
  try {
    localStorage.setItem(STRIPE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving stripe config:', e);
  }
};

/**
 * Identify Card Brand from First Digits (IIN/BIN)
 */
export const detectCardBrand = (cardNumber) => {
  const clean = cardNumber.replace(/\D/g, '');
  if (!clean) return 'generic';

  if (/^4/.test(clean)) return 'visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^6(?:011|5)/.test(clean)) return 'discover';
  if (/^35/.test(clean)) return 'jcb';
  return 'generic';
};

/**
 * Format credit card number with spaces (XXXX XXXX XXXX XXXX or Amex XXXX XXXXXX XXXXX)
 */
export const formatCardNumber = (value) => {
  const clean = value.replace(/\D/g, '').substring(0, 16);
  if (/^3[47]/.test(clean)) {
    // Amex 4-6-5
    const part1 = clean.substring(0, 4);
    const part2 = clean.substring(4, 10);
    const part3 = clean.substring(10, 15);
    return [part1, part2, part3].filter(Boolean).join(' ');
  }
  const parts = [];
  for (let i = 0; i < clean.length; i += 4) {
    parts.push(clean.substring(i, i + 4));
  }
  return parts.join(' ');
};

/**
 * Format Expiry as MM / YY
 */
export const formatExpiry = (value) => {
  const clean = value.replace(/\D/g, '').substring(0, 4);
  if (clean.length >= 3) {
    return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
  }
  return clean;
};

/**
 * Client-side validation of card details
 */
export const validateCardDetails = ({ name, number, expiry, cvc, postal }) => {
  const cleanNum = number.replace(/\D/g, '');
  if (cleanNum.length < 15 || cleanNum.length > 16) {
    return { valid: false, message: 'Please enter a valid 15 or 16-digit card number.' };
  }

  if (!name.trim() || name.trim().length < 2) {
    return { valid: false, message: 'Please enter the cardholder full name.' };
  }

  const cleanExp = expiry.replace(/\D/g, '');
  if (cleanExp.length !== 4) {
    return { valid: false, message: 'Please enter a valid MM/YY expiration date.' };
  }

  const month = parseInt(cleanExp.substring(0, 2), 10);
  if (month < 1 || month > 12) {
    return { valid: false, message: 'Expiration month must be between 01 and 12.' };
  }

  const cleanCvc = cvc.replace(/\D/g, '');
  if (cleanCvc.length < 3 || cleanCvc.length > 4) {
    return { valid: false, message: 'CVC code must be 3 or 4 digits.' };
  }

  if (!postal.trim() || postal.trim().length < 3) {
    return { valid: false, message: 'Please enter a valid postal or zip code.' };
  }

  return { valid: true };
};
