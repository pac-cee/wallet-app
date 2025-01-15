const express = require('express');
const router = express.Router();
const {
  createWallet,
  getWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Wallet routes
router.route('/')
  .get(getWallets)
  .post(createWallet);

router.route('/:id')
  .get(getWalletById)
  .put(updateWallet)
  .delete(deleteWallet);

module.exports = router;
