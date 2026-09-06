import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Resend } from 'resend';

const JWT_SECRET = process.env.JWT_SECRET || 'apexvault_jwt_super_secret_key_2026';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'gamot0105@gmail.com';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new customer
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      province,
      postalCode,
      password,
      role
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !street || !city || !postalCode || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required registration fields'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.'
      });
    }

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      province: province ? province.trim() : 'Ontario',
      postalCode: postalCode.trim(),
      password,
      role: role === 'admin' ? 'admin' : 'customer'
    });

    const token = generateToken(user._id, user.role);

    console.log(`[AUTH] New user registered: ${user.email} (${user.firstName} ${user.lastName})`);

    return res.status(201).json({
      success: true,
      user,
      token,
      message: 'Account created successfully!'
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error during registration'
    });
  }
};

// @desc    Authenticate customer & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.role);

    console.log(`[AUTH] User logged in: ${user.email} (Role: ${user.role})`);

    return res.json({
      success: true,
      user,
      token,
      message: 'Signed in successfully!'
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send password reset email with token
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide your email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account registered with that email address'
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(24).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity
    await user.save();

    const resetUrl = `http://localhost:3000?resetToken=${resetToken}&email=${encodeURIComponent(user.email)}`;

    // Try sending email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f17; color: #f8fafc; padding: 2rem; border-radius: 12px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <h2 style="color: #10b981; margin: 0; font-size: 24px;">ApexxVault Security</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Password Reset Request</p>
          </div>
          <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${user.firstName}</strong>,</p>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
            We received a request to reset your password for your ApexxVault Wholesale & Liquidation account. Click the button below to choose a new password:
          </p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${resetUrl}" style="background: #10b981; color: #ffffff; padding: 12px 28px; border-radius: 9999px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 15px;">
              Reset My Password
            </a>
          </div>
          <p style="font-size: 13px; color: #94a3b8;">
            Or copy and paste this link in your browser:<br/>
            <a href="${resetUrl}" style="color: #38bdf8; word-break: break-all;">${resetUrl}</a>
          </p>
          <p style="font-size: 12px; color: #64748b; margin-top: 2rem; border-top: 1px solid #1e293b; padding-top: 1rem;">
            This link is valid for 60 minutes. If you did not request this password reset, please ignore this email.
          </p>
        </div>
      `;

      await resend.emails.send({
        from: 'ApexxVault Security <onboarding@resend.dev>',
        to: [user.email],
        subject: 'ApexxVault — Reset Your Account Password',
        html: emailHtml
      });
      console.log(`[AUTH] Password reset email dispatched to ${user.email}`);
    } catch (emailErr) {
      console.warn('[Resend Notice on Reset]:', emailErr.message);
    }
  } else {
    console.warn('[AUTH] RESEND_API_KEY is not configured in environment.');
  }

    return res.json({
      success: true,
      message: `Password reset instructions have been sent to ${user.email}`,
      resetToken,
      resetUrl
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reset password using valid token
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both the reset token and your new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired password reset link. Please request a new one.'
      });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = generateToken(user._id, user.role);

    console.log(`[AUTH] Password successfully reset for user ${user.email}`);

    return res.json({
      success: true,
      message: 'Password updated successfully! You are now logged in.',
      user,
      token: authToken
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all registered customers (Admin only)
// @route   GET /api/auth/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('[Get Users Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
