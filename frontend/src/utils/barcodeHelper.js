import JsBarcode from 'jsbarcode';

export const WAREHOUSE_PICKUP_DETAILS = {
  facilityName: 'ApexxVault Warehouse & Logistics',
  bay: 'Unit #32 (Customer Pickup & Loading)',
  street: '705 Progress Ave #32',
  city: 'Scarborough',
  province: 'Ontario',
  postalCode: 'M1H 2X1',
  country: 'Canada',
  fullAddress: '705 Progress Ave #32, Scarborough, ON M1H 2X1, Canada',
  phone: '+1 (639) 571-6702',
  email: 'aayushgamot21@gmail.com',
  hours: 'Mon – Sat: 11:00 AM – 6:00 PM EST | Sunday: 11:00 AM – 5:00 PM EST',
  instructions: 'Bring your Order Invoice Barcode (on your phone or printed) and 1 piece of Government ID for warehouse staff release at Unit #32.'
};

/**
 * Generate SVG Barcode string for an order ID
 */
export const renderBarcodeSvg = (elementId, text) => {
  if (!text) return;
  try {
    const el = document.getElementById(elementId);
    if (el) {
      JsBarcode(el, text, {
        format: 'CODE128',
        lineColor: '#000000',
        width: 2,
        height: 50,
        displayValue: true,
        fontSize: 12,
        font: 'monospace',
        margin: 10
      });
    }
  } catch (err) {
    console.warn('Barcode render error:', err);
  }
};

/**
 * Encodes order details into a compact QR code payload
 */
export const generateOrderQrPayload = (order) => {
  if (!order) return '';
  const itemSummary = (order.items || [])
    .map((i) => `${i.quantity}x ${(i.product?.title || i.title || '').substring(0, 24)} ($${i.product?.price || i.price})`)
    .join('; ');

  return JSON.stringify({
    orderId: order.orderId,
    customer: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
    email: order.customer?.email || '',
    phone: order.customer?.phone || '',
    pickupLocation: order.pickupLocation || WAREHOUSE_PICKUP_DETAILS.fullAddress,
    total: order.grandTotal,
    items: itemSummary,
    paid: true
  });
};
