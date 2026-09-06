import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'store_settings'
    },
    stripe: {
      publishableKey: { type: String, default: 'pk_test_51MzDemoApexVaultPublishableKey001' },
      isLiveMode: { type: Boolean, default: false },
      merchantName: { type: String, default: 'ApexVault Inc.' },
      currency: { type: String, default: 'cad' },
      accountEmail: { type: String, default: 'payments@apexvault.ca' }
    },
    email: {
      resendApiKey: { type: String, default: () => process.env.RESEND_API_KEY || '' },
      fromEmail: { type: String, default: 'onboarding@resend.dev' },
      fromName: { type: String, default: 'ApexVault Store' }
    }
  },
  {
    timestamps: true
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
