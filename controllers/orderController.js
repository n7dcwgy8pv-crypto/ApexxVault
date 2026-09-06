import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { generateInvoiceHtml } from '../utils/emailTemplate.js';

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'gamot0105@gmail.com';

// @desc    Create new order, decrement stock in MongoDB, and deliver live email invoice
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Create order document in MongoDB
    const order = await Order.create(orderData);

    // Decrement stock for purchased items in MongoDB
    if (Array.isArray(order.items) && order.items.length > 0) {
      for (const item of order.items) {
        const prodId = item.product?.id || item.product?._id;
        const qty = item.quantity || 1;
        if (prodId) {
          await Product.findByIdAndUpdate(prodId, {
            $inc: { stockQty: -qty, salesCount: qty }
          });
        }
      }
    }

    // Auto-dispatch live email
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        throw new Error('RESEND_API_KEY is not set in .env');
      }
      const resend = new Resend(resendApiKey);

      const html = generateInvoiceHtml(order);
      const targetCustomerEmail = order.customer?.email?.trim() || OWNER_EMAIL;
      const subject = `ApexxVault Invoice #${order.orderId} - Pickup Pass: ${order.pickupCode}`;

      console.log(`\n========================================`);
      console.log(`[ORDER DISPATCH] Processing email invoice for #${order.orderId}`);
      console.log(`Customer Entered Email: ${targetCustomerEmail}`);
      console.log(`Owner Registered Email: ${OWNER_EMAIL}`);
      console.log(`========================================\n`);

      // 1. First attempt: Send directly to the email the customer typed in the form
      let primarySendSuccess = false;

      const { data: resData, error: resError } = await resend.emails.send({
        from: 'ApexxVault <onboarding@resend.dev>',
        to: [targetCustomerEmail],
        subject: subject,
        html: html
      });

      if (!resError) {
        primarySendSuccess = true;
        console.log(`[Resend Success] Email delivered directly to customer (${targetCustomerEmail})! ID: ${resData?.id}`);
      } else {
        console.warn(`[Resend Notice for ${targetCustomerEmail}]:`, resError.message || resError);

        // If customer email is different from owner email and Resend blocked it due to sandbox policy (403):
        if (targetCustomerEmail.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
          console.log(`[Resend Sandbox Notice]: onboarding@resend.dev requires a domain at resend.com/domains to deliver to non-registered emails.`);
          console.log(`[Delivering Store Owner Copy to ${OWNER_EMAIL}...]`);

          const { data: ownerData, error: ownerError } = await resend.emails.send({
            from: 'ApexxVault <onboarding@resend.dev>',
            to: [OWNER_EMAIL],
            subject: `[Store Invoice Copy] #${order.orderId} (Customer: ${targetCustomerEmail})`,
            html: html
          });

          if (!ownerError) {
            console.log(`[Owner Invoice Copy Delivered to ${OWNER_EMAIL}] ID: ${ownerData?.id}`);
          }
        }
      }
    } catch (mailErr) {
      console.warn('[Email Dispatch Error]:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order created and saved in MongoDB',
      data: order
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all orders from MongoDB
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Look up order by Order ID, Pickup Code, Barcode, Email, or Phone
// @route   GET /api/orders/lookup
export const lookupOrder = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    }

    const clean = q.trim();

    // Check if JSON QR Code
    if (clean.startsWith('{') && clean.includes('orderId')) {
      try {
        const parsed = JSON.parse(clean);
        const match = await Order.findOne({ orderId: new RegExp(`^${parsed.orderId}$`, 'i') });
        if (match) {
          return res.json({ success: true, data: match });
        }
      } catch {}
    }

    const regex = new RegExp(clean, 'i');
    const order = await Order.findOne({
      $or: [
        { orderId: regex },
        { pickupCode: regex },
        { 'customer.email': regex },
        { 'customer.phone': regex },
        { 'customer.firstName': regex },
        { 'customer.lastName': regex }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'No order found matching query' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Mark order as released to customer
// @route   PUT /api/orders/:orderId/release
export const releaseOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      {
        isReleased: true,
        status: 'Released to Customer',
        releasedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, message: 'Order marked as released to customer', data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
