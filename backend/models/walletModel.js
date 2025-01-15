const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a wallet name'],
  },
  accountType: {
    type: String,
    required: true,
    enum: ['bank', 'mobile_money', 'cash', 'other'],
  },
  currency: {
    type: String,
    required: [true, 'Please add a currency'],
    default: 'USD',
  },
  balance: {
    type: Number,
    required: [true, 'Please add a balance'],
    default: 0,
  },
  budget: {
    amount: {
      type: Number,
      default: 0,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'monthly',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    notifications: {
      enabled: {
        type: Boolean,
        default: true,
      },
      threshold: {
        type: Number,
        default: 80, // percentage
      },
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Wallet', walletSchema);
