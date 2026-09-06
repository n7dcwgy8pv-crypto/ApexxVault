import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      default: 'general',
      trim: true,
      index: true
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Appears New', 'Open Box', 'Customer Return', 'Salvage / Parts'],
      default: 'Brand New',
      index: true
    },
    conditionNotes: {
      type: String,
      default: 'Inspected and verified'
    },
    price: {
      type: Number,
      required: [true, 'Liquidation price is required'],
      min: 0,
      index: true
    },
    retailMSRP: {
      type: Number,
      default: 0,
      min: 0
    },
    stockQty: {
      type: Number,
      default: 1,
      min: 0
    },
    warehouseLocation: {
      type: String,
      default: 'Bay 4',
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    eventId: {
      type: String,
      default: 'evt-all'
    },
    salesCount: {
      type: Number,
      default: 0
    },
    holdUntil: {
      type: Date,
      default: null,
      index: true
    },
    heldBy: {
      type: Object,
      default: null
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

// Search Index on title, sku, description, conditionNotes
productSchema.index({
  title: 'text',
  sku: 'text',
  description: 'text',
  conditionNotes: 'text'
});

export const Product = mongoose.model('Product', productSchema);
