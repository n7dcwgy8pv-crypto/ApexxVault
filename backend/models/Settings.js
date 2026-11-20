import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'store_settings'
    },
    store: {
      businessName: { type: String, default: 'ApexxVault Direct Liquidation Inc.' },
      tagline: { type: String, default: 'Premium Liquidation & Wholesale Surplus Marketplace' },
      supportEmail: { type: String, default: 'support@apexxvault.com' },
      ownerEmail: { type: String, default: 'aayushgamot21@gmail.com' },
      phone: { type: String, default: '+1 (416) 571-6702' },
      warehouseFacility: { type: String, default: 'ApexxVault Distribution Hub (Unit #32)' },
      street: { type: String, default: '705 Progress Ave #32' },
      city: { type: String, default: 'Scarborough' },
      province: { type: String, default: 'Ontario' },
      postalCode: { type: String, default: 'M1H 2X1' },
      hoursWeekdays: { type: String, default: 'Mon – Sat: 11:00 AM – 6:00 PM EST' },
      hoursSunday: { type: String, default: 'Sunday: 11:00 AM – 5:00 PM EST' },
      taxRate: { type: Number, default: 0.13 }, // 13% Ontario HST
      currency: { type: String, default: 'CAD' },
      pickupInstructions: { type: String, default: 'Bring government photo ID and your Order Pickup Code to Unit #32 loading dock.' }
    },
    policies: {
      privacyPolicy: { type: String, default: '' },
      termsOfService: { type: String, default: '' },
      asIsAgreement: { type: String, default: '' },
      pickupPolicy: { type: String, default: '' }
    },
    stripe: {
      publishableKey: { type: String, default: 'pk_test_51MzDemoApexVaultPublishableKey001' },
      isLiveMode: { type: Boolean, default: false },
      merchantName: { type: String, default: 'ApexVault Inc.' },
      currency: { type: String, default: 'cad' },
      accountEmail: { type: String, default: 'payments@apexvault.ca' }
    },
    email: {
      resendApiKey: { type: String, default: '' },
      fromEmail: { type: String, default: 'onboarding@resend.dev' },
      fromName: { type: String, default: 'ApexVault Store' }
    }
  },
  {
    timestamps: true
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
