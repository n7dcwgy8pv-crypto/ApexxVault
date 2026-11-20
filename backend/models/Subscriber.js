import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      index: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    name: {
      type: String,
      default: '',
      trim: true
    },
    preferredCategories: {
      type: [String],
      default: ['all']
    },
    notifyVia: {
      type: String,
      enum: ['email', 'sms', 'both'],
      default: 'email'
    },
    active: {
      type: Boolean,
      default: true
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

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
