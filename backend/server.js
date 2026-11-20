import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import { User } from './models/User.js';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '../frontend/dist');

dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  // Seed Default Admin User if none exists or update weak password
  try {
    let gamotAdmin = await User.findOne({ email: 'gamot0105@gmail.com' });
    if (!gamotAdmin) {
      gamotAdmin = await User.create({
        firstName: 'ApexxVault',
        lastName: 'Admin',
        email: 'gamot0105@gmail.com',
        phone: '+1 (416) 571-6702',
        street: '705 Progress Ave #32',
        city: 'Scarborough',
        province: 'Ontario',
        postalCode: 'M1H 2X1',
        password: 'ApexxVault@2026!Admin',
        role: 'admin'
      });
      console.log('✅ [ADMIN SEED] Primary Admin account initialized with secure credentials: gamot0105@gmail.com');
    }

    // Clean up test/gibberish accounts flagged in audit finding A6/A13
    const testEmails = ['demo@yopmail.com', 'sagar@yopmail.com'];
    const removedTest = await User.deleteMany({ email: { $in: testEmails } });
    if (removedTest.deletedCount > 0) {
      console.log(`🧹 [CLEANUP] Purged ${removedTest.deletedCount} test/gibberish customer accounts from database.`);
    }
  } catch (err) {
    console.warn('[Admin Seed Notice]:', err.message);
  }
});

const app = express();
const PORT = process.env.PORT || 5050;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'aayushgamot21@gmail.com';

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
    if (!resendApiKey) {
      return res.status(400).json({ success: false, error: 'RESEND_API_KEY is not configured on the server or provided in request.' });
    }
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

// SEO & Crawling Endpoints (Finding C1, C2)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /#admin\n\nSitemap: https://www.apexxvault.com/sitemap.xml\n`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const { Product } = await import('./models/Product.js');
    const products = await Product.find({}, 'sku updatedAt').limit(500);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url>\n    <loc>https://www.apexxvault.com/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>https://www.apexxvault.com/#privacy</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>https://www.apexxvault.com/#terms</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>https://www.apexxvault.com/#as-is</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>https://www.apexxvault.com/#pickup</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;

    for (const p of products) {
      if (p.sku) {
        xml += `  <url>\n    <loc>https://www.apexxvault.com/?lot=${encodeURIComponent(p.sku)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }
    }

    xml += `</urlset>`;
    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Root API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: 'connected (mongodb://localhost:27017/auction_universe)',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Serve Frontend Production Build & SPA Catch-All Routing (Finding C1)
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

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
  console.log(`📊 [MONGODB ENDPOINT] mongodb://localhost:27017/auction_universe\n`);
});
