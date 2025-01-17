const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Update account balance when transaction is created
transactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Account = mongoose.model('Account');
    const account = await Account.findById(this.account);
    
    if (!account) {
      throw new Error('Account not found');
    }

    // Update account balance
    account.balance += this.type === 'income' ? this.amount : -this.amount;
    await account.save();
  }
  next();
});

// Update account balance when transaction is deleted
transactionSchema.pre('remove', async function(next) {
  const Account = mongoose.model('Account');
  const account = await Account.findById(this.account);
  
  if (!account) {
    throw new Error('Account not found');
  }

  // Reverse the transaction effect on balance
  account.balance -= this.type === 'income' ? this.amount : -this.amount;
  await account.save();
  next();
});

// Virtual field for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD' // You might want to get this from the account
  }).format(this.amount);
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
