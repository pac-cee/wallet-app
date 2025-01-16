const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReport,
  getTrends
} = require('../controllers/reportController');

router.get('/', protect, getReport);
router.get('/trends', protect, getTrends);

module.exports = router;
