const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  type: {
    type: String,
    required: true,
    enum: ['budget_warning', 'budget_exceeded', 'system'],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: Map,
    of: String,
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ wallet: 1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
