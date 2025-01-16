const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBudget,
  getBudgets,
  checkBudget
} = require('../controllers/budgetController');

router.route('/')
  .get(protect, getBudgets)
  .post(protect, createBudget);

router.post('/check', protect, checkBudget);

module.exports = router;
