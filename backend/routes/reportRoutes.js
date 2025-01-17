const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReport,
  getTrends,
  getBudgetAnalysis
} = require('../controllers/reportController');

// Apply auth middleware to all routes
router.use(protect);

// Report routes
router.get('/', getReport);
router.get('/trends', getTrends);
router.get('/budget', getBudgetAnalysis);

module.exports = router;
