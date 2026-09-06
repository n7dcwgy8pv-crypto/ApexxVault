import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import { User } from './models/User.js';
import { Resend } from 'resend';

// Connect to MongoDB
connectDB().then(async () => {
  // Seed Default Admin User if none exists
  try {
    const adminEmail = process.env.OWNER_EMAIL || 'gamot0105@gmail.com';
    const gamotAdmin = await User.findOne({ email: adminEmail });
    if (!gamotAdmin) {
      await User.create({
        firstName: 'Gamot',
        lastName: 'Admin',
        email: adminEmail,
        phone: '+1 (647) 555-0199',
        street: '100 King St W',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M5X 1A9',
        password: '123123123',
        role: 'admin'
      });
      console.log(`✅ [ADMIN SEED] Primary Admin account created: ${adminEmail}`);
    }
  } catch (err) {
    console.warn('[Admin Seed Notice]:', err.message);
  }
});

const app = express();
const PORT = process.env.PORT || 5050;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'gamot0105@gmail.com';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request Logging
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/offers', offerRoutes);

// Direct Email Dispatch Route
app.post('/api/send-invoice', async (req, res) => {
  try {
    const { to, subject, html, orderId, apiKey, fromEmail, fromName } = req.body;
    const resendApiKey = apiKey || process.env.RESEND_API_KEY;
    const resend = new Resend(resendApiKey);

    const sender = fromEmail && !fromEmail.includes('apexvault.ca')
      ? `${fromName || 'ApexVault'} <${fromEmail}>`
      : `${fromName || 'ApexVault'} <onboarding@resend.dev>`;

    const targetRecipient = Array.isArray(to) ? to[0] : (to || OWNER_EMAIL);

    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Attempting send for Order #${orderId}`);
    console.log(`Target Email: ${targetRecipient}`);
    console.log(`========================================\n`);

    // 1. Send directly to requested email
    const { data: primaryData, error: primaryError } = await resend.emails.send({
      from: sender,
      to: [targetRecipient],
      subject: subject || `ApexVault Invoice #${orderId || 'NEW'}`,
      html: html
    });

    if (!primaryError) {
      console.log(`[Resend Success]: Email delivered to ${targetRecipient} (ID: ${primaryData?.id})`);
      return res.json({ success: true, messageId: primaryData?.id, to: targetRecipient, orderId });
    }

    console.warn(`[Resend Notice for ${targetRecipient}]:`, primaryError.message || primaryError);

    // If sandbox restriction (403), send to owner account email as fallback
    if (targetRecipient.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      console.log(`[Resend Sandbox Fallback]: Delivering invoice copy to account owner ${OWNER_EMAIL}...`);
      const { data: fallbackData, error: fallbackError } = await resend.emails.send({
        from: sender,
        to: [OWNER_EMAIL],
        subject: `[Store Invoice Copy] Order #${orderId} (Customer: ${targetRecipient})`,
        html: html
      });

      if (!fallbackError) {
        return res.json({
          success: true,
          messageId: fallbackData?.id,
          to: OWNER_EMAIL,
          orderId,
          note: `Delivered copy to ${OWNER_EMAIL} (Resend sandbox requires custom domain to email ${targetRecipient})`
        });
      }
    }

    return res.status(400).json({ success: false, error: primaryError });
  } catch (err) {
    console.error('[Email endpoint error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Root API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: 'connected',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 [APEXVAULT BACKEND SERVER] Running on http://localhost:${PORT}`);
});


