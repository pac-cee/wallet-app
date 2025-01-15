const asyncHandler = require('express-async-handler');
const Wallet = require('../models/walletModel');

// @desc    Create new wallet
// @route   POST /api/wallets
// @access  Private
const createWallet = asyncHandler(async (req, res) => {
  const { name, balance, currency } = req.body;

  const wallet = await Wallet.create({
    user: req.user._id,
    name,
    balance,
    currency,
  });

  res.status(201).json(wallet);
});

// @desc    Get user wallets
// @route   GET /api/wallets
// @access  Private
const getWallets = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find({ user: req.user._id });
  res.json(wallets);
});

// @desc    Get wallet by ID
// @route   GET /api/wallets/:id
// @access  Private
const getWalletById = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findById(req.params.id);

  if (wallet && wallet.user.toString() === req.user._id.toString()) {
    res.json(wallet);
  } else {
    res.status(404);
    throw new Error('Wallet not found');
  }
});

// @desc    Update wallet
// @route   PUT /api/wallets/:id
// @access  Private
const updateWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findById(req.params.id);

  if (wallet && wallet.user.toString() === req.user._id.toString()) {
    wallet.name = req.body.name || wallet.name;
    wallet.balance = req.body.balance || wallet.balance;
    wallet.currency = req.body.currency || wallet.currency;

    const updatedWallet = await wallet.save();
    res.json(updatedWallet);
  } else {
    res.status(404);
    throw new Error('Wallet not found');
  }
});

// @desc    Delete wallet
// @route   DELETE /api/wallets/:id
// @access  Private
const deleteWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findById(req.params.id);

  if (wallet && wallet.user.toString() === req.user._id.toString()) {
    await wallet.remove();
    res.json({ message: 'Wallet removed' });
  } else {
    res.status(404);
    throw new Error('Wallet not found');
  }
});

module.exports = {
  createWallet,
  getWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
};
