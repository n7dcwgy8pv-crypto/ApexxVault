import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true
    },
    productTitle: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    liquidationPrice: {
      type: Number,
      required: true
    },
    retailMSRP: {
      type: Number,
      default: 0
    },
    offeredPrice: {
      type: Number,
      required: [true, 'Offered price is required'],
      min: 1
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    note: {
      type: String,
      default: ''
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, default: 'Scarborough' }
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Countered'],
      default: 'Pending',
      index: true
    },
    counterPrice: {
      type: Number,
      default: null
    },
    adminResponseNote: {
      type: String,
      default: ''
    }
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

export const Offer = mongoose.model('Offer', offerSchema);
