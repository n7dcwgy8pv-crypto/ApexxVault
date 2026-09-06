import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    pickupCode: {
      type: String,
      required: true,
      index: true
    },
    customer: {
      firstName: { type: String, default: 'Valued', trim: true },
      lastName: { type: String, default: 'Customer', trim: true },
      name: { type: String, default: '', trim: true },
      email: { type: String, required: true, trim: true, index: true },
      phone: { type: String, required: true, trim: true, index: true },
      street: { type: String, default: 'Local Pickup (Scarborough)', trim: true },
      city: { type: String, default: 'Scarborough', trim: true },
      province: { type: String, default: 'ON', trim: true },
      postalCode: { type: String, default: 'M1H 2X1', trim: true }
    },
    items: [
      {
        product: {
          id: String,
          _id: String,
          title: String,
          sku: String,
          category: String,
          condition: String,
          price: Number,
          retailMSRP: Number,
          warehouseLocation: String,
          images: [String]
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    totalMSRP: { type: Number, default: 0 },
    totalSavings: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    pickupLocation: { type: String, default: '705 Progress Ave #32, Scarborough, ON M1H 2X1, Canada' },
    pickupTimeSlot: { type: String, default: 'Flexible (During Warehouse Hours)' },
    note: { type: String, default: '' },
    warehouseDetails: { type: Object, default: {} },
    paymentMethod: { type: String, default: 'Direct Message (DM) / Reserve' },
    stripeChargeId: { type: String, default: '' },
    cardBrand: { type: String, default: 'visa' },
    cardLast4: { type: String, default: '4242' },
    status: {
      type: String,
      enum: [
        'Ready for Pickup',
        'Ready for Warehouse Pickup',
        'Inquiry / DM Reserved',
        'Released to Customer',
        'Reserved',
        'Cancelled'
      ],
      default: 'Ready for Pickup',
      index: true
    },
    emailDispatchedTo: { type: String, default: '' },
    isReleased: { type: Boolean, default: false },
    releasedAt: { type: Date },
    date: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

// Compound Search Index on orderId, pickupCode, customer email, customer phone
orderSchema.index({
  orderId: 'text',
  pickupCode: 'text',
  'customer.email': 'text',
  'customer.phone': 'text',
  'customer.firstName': 'text',
  'customer.lastName': 'text'
});

export const Order = mongoose.model('Order', orderSchema);
