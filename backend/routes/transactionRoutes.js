const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllTransactions,
  createTransaction,
  getWalletTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

// Apply auth middleware to all routes
router.use(protect);

// Transaction routes
router.get('/', getAllTransactions);
router.get('/wallet/:walletId', getWalletTransactions);
router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);
router.post('/', createTransaction);

module.exports = router;
