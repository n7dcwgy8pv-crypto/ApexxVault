import { WAREHOUSE_PICKUP_DETAILS } from './barcodeHelper.js';
import { formatCurrency, formatDate } from './formatters.js';
import { API_BASE_URL } from '../services/api.js';

const EMAIL_CONFIG_KEY = 'apexvault_email_config';

export const DEFAULT_EMAIL_CONFIG = {
  provider: 'resend',
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
  fromEmail: import.meta.env.VITE_FROM_EMAIL || 'onboarding@resend.dev',
  fromName: import.meta.env.VITE_FROM_NAME || 'ApexxVault Store'
};


export const getStoredEmailConfig = () => {
  try {
    const data = localStorage.getItem(EMAIL_CONFIG_KEY);
    if (data) {
      return { ...DEFAULT_EMAIL_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error reading email config:', e);
  }
  return DEFAULT_EMAIL_CONFIG;
};

export const setStoredEmailConfig = (config) => {
  try {
    localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving email config:', e);
  }
};

/**
 * Generate rich, modern HTML email template with prominent customer records
 */
export const generateInvoiceHtml = (order) => {
  const firstName = order.customer?.firstName || 'Valued';
  const lastName = order.customer?.lastName || 'Customer';
  const fullName = `${firstName} ${lastName}`.trim();
  const email = order.customer?.email || order.emailDispatchedTo || 'N/A';
  const phone = order.customer?.phone || 'N/A';
  const street = order.customer?.street || 'N/A';
  const city = order.customer?.city || '';
  const province = order.customer?.province || '';
  const postalCode = order.customer?.postalCode || '';

  const itemsRows = (order.items || [])
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px; font-weight: 600; color: #0f172a;">
        ${item.product?.title || item.title || 'Product'}
        <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-top: 4px;">
          SKU: ${item.product?.sku || item.sku || 'N/A'} | Condition: ${item.product?.condition || item.condition || 'Brand New'} | Bay Location: ${item.product?.warehouseLocation || 'Unit #32'}
        </div>
      </td>
      <td style="padding: 12px; text-align: center; font-weight: 700; color: #0f172a;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 12px; text-align: right; font-family: monospace; color: #0f172a;">
        ${formatCurrency(item.product?.price || item.price || 0)}
      </td>
      <td style="padding: 12px; text-align: right; font-weight: 700; font-family: monospace; color: #059669;">
        ${formatCurrency((item.product?.price || item.price || 0) * (item.quantity || 1))}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ApexxVault Invoice #${order.orderId}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #06090e; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 8px 30px rgba(0,0,0,0.25);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0d1527 0%, #1e1b4b 100%); padding: 30px 36px; color: #ffffff;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td>
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em;">
              APEXX<span style="color: #6366f1;">VAULT</span>
            </h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #a5b4fc; font-weight: 600;">
              Asset &amp; Liquidation Marketplace
            </p>
          </td>
          <td style="text-align: right;">
            <div style="font-size: 12px; text-transform: uppercase; color: #93c5fd; font-weight: 800; letter-spacing: 0.05em;">Official Invoice</div>
            <div style="font-size: 20px; font-weight: 900; font-family: monospace; color: #ffffff;">${order.orderId}</div>
            <div style="font-size: 12px; color: #a5b4fc;">${formatDate(order.date)}</div>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 32px 36px;">

      <!-- Pickup Pass & Payment Bar -->
      <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 10px; padding: 18px 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800;">Pickup Pass Code</div>
              <div style="font-size: 22px; font-weight: 900; font-family: monospace; color: #059669; margin-top: 2px;">${order.pickupCode}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Present code at Unit #32 for immediate release</div>
            </td>
            <td style="text-align: right;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800;">Payment Verification</div>
              <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">PAID via Stripe</div>
              <div style="font-size: 12px; color: #059669; font-weight: 700;">${order.cardBrand?.toUpperCase() || 'CARD'} •••• ${order.cardLast4 || '4242'}</div>
              <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">Ref: ${order.stripeChargeId || 'ch_verified'}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- CUSTOMER DETAILS & RECORDS SECTION -->
      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 900; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #bbf7d0; padding-bottom: 8px;">
          👤 Customer Records &amp; Buyer Information
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 5px 0; color: #4b5563; width: 140px; font-weight: 600;">Customer Full Name:</td>
            <td style="padding: 5px 0; font-weight: 800; color: #0f172a; font-size: 14px;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #4b5563; font-weight: 600;">Email Address:</td>
            <td style="padding: 5px 0; font-weight: 700; color: #0369a1;"><a href="mailto:${email}" style="color: #0369a1; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #4b5563; font-weight: 600;">Phone Number:</td>
            <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #4b5563; font-weight: 600; vertical-align: top;">Physical Address:</td>
            <td style="padding: 5px 0; color: #1e293b; line-height: 1.4;">
              <strong>${street}</strong><br>
              ${city}, ${province} ${postalCode}<br>
              Canada
            </td>
          </tr>
        </table>
      </div>

      <!-- WAREHOUSE PICKUP LOCATION -->
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          📍 Auction Warehouse Pickup Location
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px; font-weight: 600;">Facility Name:</td>
            <td style="padding: 4px 0; font-weight: 800; color: #0f172a;">${WAREHOUSE_PICKUP_DETAILS.facilityName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Warehouse Unit / Bay:</td>
            <td style="padding: 4px 0; font-weight: 800; color: #059669;">${WAREHOUSE_PICKUP_DETAILS.bay}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-weight: 600; vertical-align: top;">Address:</td>
            <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">
              ${WAREHOUSE_PICKUP_DETAILS.fullAddress}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Pickup Hours:</td>
            <td style="padding: 4px 0; color: #334155;">${WAREHOUSE_PICKUP_DETAILS.hours}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Direct Unit Contact:</td>
            <td style="padding: 4px 0; color: #334155;">${WAREHOUSE_PICKUP_DETAILS.phone}</td>
          </tr>
        </table>
      </div>

      <!-- Itemized Purchased Items Table -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
          📦 Purchased Liquidation Items (${order.items?.length || 0})
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #475569; text-align: left;">
              <th style="padding: 10px 12px;">Item Description</th>
              <th style="padding: 10px 12px; text-align: center;">Qty</th>
              <th style="padding: 10px 12px; text-align: right;">Unit Price</th>
              <th style="padding: 10px 12px; text-align: right;">Item Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>

      <!-- Financial Totals Box -->
      <div style="margin-left: auto; width: 280px; font-size: 13px; margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #64748b;">
          <span>Subtotal:</span>
          <span style="font-family: monospace; font-weight: 700;">${formatCurrency(order.subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #64748b;">
          <span>Tax (13% HST):</span>
          <span style="font-family: monospace; font-weight: 700;">${formatCurrency(order.tax)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #059669; font-weight: 700;">
          <span>Total Liquidation Savings:</span>
          <span style="font-family: monospace;">${formatCurrency(order.totalSavings)}</span>
        </div>
        <div style="height: 2px; background: #0f172a; margin: 8px 0;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 17px; font-weight: 900; color: #0f172a;">
          <span>Total Paid via Stripe:</span>
          <span style="font-family: monospace; color: #059669;">${formatCurrency(order.grandTotal)}</span>
        </div>
      </div>

      <!-- Warehouse Pickup Notice -->
      <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #854d0e; line-height: 1.5;">
        <strong>Notice for Release:</strong> The customer named on this invoice (<strong>${fullName}</strong>) must present valid government photo ID matching this order upon loading at Unit #32.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 36px; font-size: 11px; color: #64748b; text-align: center; line-height: 1.5;">
      ApexxVault Inc. • 705 Progress Ave #32, Scarborough, ON M1H 2X1<br>
      Customer Support: aayushgamot21@gmail.com | (639) 571-6702
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Dispatch Real Live Email via Resend Backend API endpoint
 */
export const dispatchLiveEmailInvoice = async (order, customConfig = null) => {
  const config = customConfig || getStoredEmailConfig();
  const recipientEmail = order.customer?.email || order.emailDispatchedTo;

  if (!recipientEmail || !recipientEmail.includes('@')) {
    return { success: false, error: 'Recipient email is missing or invalid.' };
  }

  const subject = `Official Invoice & Warehouse Pickup Pass - Order #${order.orderId}`;
  const htmlContent = generateInvoiceHtml(order);

  try {
    const res = await fetch(`${API_BASE_URL}/send-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipientEmail,
        subject,
        html: htmlContent,
        orderId: order.orderId,
        apiKey: config.resendApiKey || import.meta.env.VITE_RESEND_API_KEY || '',
        fromEmail: config.fromEmail || import.meta.env.VITE_FROM_EMAIL || 'onboarding@resend.dev',
        fromName: config.fromName || import.meta.env.VITE_FROM_NAME || 'ApexVault Store'
      })
    });

    const result = await res.json();
    if (res.ok && result.success) {
      return { success: true, messageId: result.messageId, provider: 'Resend' };
    } else {
      return { success: false, error: result.error || 'Failed to dispatch email' };
    }
  } catch (err) {
    console.error('Dispatch error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Open customer's native email client with pre-filled invoice
 */
export const openMailClientWithInvoice = (order) => {
  const recipient = order.customer?.email || '';
  const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();
  const subject = encodeURIComponent(`ApexVault Invoice #${order.orderId} - Pickup Pass for ${customerName}`);
  const body = encodeURIComponent(`
CUSTOMER RECORD & INVOICE:
----------------------------------------
Customer Name: ${customerName}
Email: ${order.customer?.email || ''}
Phone: ${order.customer?.phone || ''}
Address: ${order.customer?.street || ''}, ${order.customer?.city || ''}, ${order.customer?.province || ''} ${order.customer?.postalCode || ''}

ORDER DETAILS:
----------------------------------------
Invoice ID: ${order.orderId}
Pickup Pass Code: ${order.pickupCode}
Date: ${formatDate(order.date)}
Payment Status: PAID via Stripe (${order.cardBrand?.toUpperCase() || 'CARD'} •••• ${order.cardLast4 || '4242'})

WAREHOUSE PICKUP LOCATION:
${WAREHOUSE_PICKUP_DETAILS.facilityName}
${WAREHOUSE_PICKUP_DETAILS.bay}
${WAREHOUSE_PICKUP_DETAILS.fullAddress}
Hours: ${WAREHOUSE_PICKUP_DETAILS.hours}
Phone: ${WAREHOUSE_PICKUP_DETAILS.phone}

PURCHASED ITEMS:
${(order.items || []).map((i) => `• ${i.quantity || 1}x ${i.product?.title || i.title || ''} (${i.product?.condition || i.condition || 'Brand New'}) - ${formatCurrency((i.product?.price || i.price || 0) * (i.quantity || 1))}`).join('\n')}

Subtotal: ${formatCurrency(order.subtotal)}
Tax (13% HST): ${formatCurrency(order.tax)}
Total Paid: ${formatCurrency(order.grandTotal)}

Note: Please present matching government photo ID for ${customerName} at Unit #32.
  `);

  window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
};
