/**
 * Format currency as CAD / USD ($X,XXX.XX)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount));
};

/**
 * Format timestamp into live countdown string (e.g. "04m 22s", "2h 15m", "1d 4h")
 */
export const formatTimeRemaining = (closingTime) => {
  const diff = Number(closingTime) - Date.now();
  if (diff <= 0) {
    return { text: 'CLOSED', isClosed: true, isUrgent: false, totalSeconds: 0 };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const isUrgent = diff < 15 * 60 * 1000; // less than 15 mins

  let text = '';
  if (days > 0) {
    text = `${days}d ${hours}h`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  } else {
    text = `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }

  return {
    text,
    days,
    hours,
    minutes,
    seconds,
    isClosed: false,
    isUrgent,
    totalSeconds: Math.floor(diff / 1000)
  };
};

/**
 * Calculate percentage savings off MSRP
 */
export const formatPercentOff = (currentPrice, msrp) => {
  if (!msrp || !currentPrice || Number(msrp) <= 0) return 0;
  const curr = Number(currentPrice);
  const retail = Number(msrp);
  if (curr >= retail) return 0;
  return Math.round(((retail - curr) / retail) * 100);
};

/**
 * Clean lot number display
 */
export const formatLotNumber = (lotNum) => {
  if (!lotNum) return 'LOT-#';
  return lotNum.toString().toUpperCase().startsWith('LOT-') ? lotNum : `LOT #${lotNum}`;
};

/**
 * Clean relative date formatting
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
