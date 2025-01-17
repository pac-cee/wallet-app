const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  checkBudget
} = require('../controllers/budgetController');

// Apply auth middleware to all routes
router.use(protect);

// Budget routes
router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

router.post('/check', checkBudget);

module.exports = router;
