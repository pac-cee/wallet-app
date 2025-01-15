const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');
const Wallet = require('../models/walletModel');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ date: -1 })
    .populate('category', 'name color type')
    .populate('wallet', 'name balance');
  res.json(transactions);
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { walletId, type, amount, category, description } = req.body;

  // Verify wallet ownership
  const wallet = await Wallet.findById(walletId);
  if (!wallet || wallet.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Wallet not found');
  }

  // Update wallet balance
  if (type === 'income') {
    wallet.balance += amount;
  } else if (type === 'expense') {
    wallet.balance -= amount;
  }
  await wallet.save();

  const transaction = await Transaction.create({
    wallet: walletId,
    type,
    amount,
    category,
    description,
  });

  res.status(201).json(transaction);
});

// @desc    Get wallet transactions
// @route   GET /api/transactions/wallet/:walletId
// @access  Private
const getWalletTransactions = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findById(req.params.walletId);
  if (!wallet || wallet.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Wallet not found');
  }

  const transactions = await Transaction.find({ wallet: req.params.walletId })
    .sort({ date: -1 });
  res.json(transactions);
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('wallet');

  if (transaction && transaction.wallet.user.toString() === req.user._id.toString()) {
    res.json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('wallet');

  if (transaction && transaction.wallet.user.toString() === req.user._id.toString()) {
    // Revert previous transaction effect on wallet
    const wallet = transaction.wallet;
    if (transaction.type === 'income') {
      wallet.balance -= transaction.amount;
    } else if (transaction.type === 'expense') {
      wallet.balance += transaction.amount;
    }

    // Apply new transaction
    if (req.body.type === 'income') {
      wallet.balance += req.body.amount;
    } else if (req.body.type === 'expense') {
      wallet.balance -= req.body.amount;
    }

    await wallet.save();

    // Update transaction
    transaction.type = req.body.type || transaction.type;
    transaction.amount = req.body.amount || transaction.amount;
    transaction.category = req.body.category || transaction.category;
    transaction.description = req.body.description || transaction.description;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('wallet');

  if (transaction && transaction.wallet.user.toString() === req.user._id.toString()) {
    // Revert transaction effect on wallet
    const wallet = transaction.wallet;
    if (transaction.type === 'income') {
      wallet.balance -= transaction.amount;
    } else if (transaction.type === 'expense') {
      wallet.balance += transaction.amount;
    }
    await wallet.save();

    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

module.exports = {
  getAllTransactions,
  createTransaction,
  getWalletTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
