const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');

// @desc    Get transaction report
// @route   GET /api/reports
// @access  Private
const getReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const matchStage = {
    user: req.user._id,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  const report = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          category: '$category',
          type: '$type'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id.category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        category: '$category.name',
        type: '$_id.type',
        total: 1,
        count: 1
      }
    }
  ]);

  // Calculate summary
  const summary = {
    totalIncome: report
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.total, 0),
    totalExpense: report
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.total, 0),
    categorySummary: report
  };

  res.json(summary);
});

// @desc    Get category spending trends
// @route   GET /api/reports/trends
// @access  Private
const getTrends = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;
  
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const trends = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          category: '$category',
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id.category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month'
          }
        },
        category: '$category.name',
        type: '$_id.type',
        total: 1
      }
    },
    { $sort: { date: 1 } }
  ]);

  res.json(trends);
});

module.exports = {
  getReport,
  getTrends
};
