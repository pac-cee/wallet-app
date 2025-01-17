const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const { Parser } = require('json2csv');

// @desc    Get transaction report
// @route   GET /api/reports
// @access  Private
const getReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, format = 'json' } = req.query;
  
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
        count: { $sum: 1 },
        transactions: { $push: '$$ROOT' }
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
        count: 1,
        transactions: 1
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
    categorySummary: report,
    period: {
      start: startDate,
      end: endDate
    }
  };

  switch (format) {
    case 'pdf':
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      doc.pipe(res);
      
      // Add report header
      doc.fontSize(20).text('Financial Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Period: ${format(new Date(startDate), 'PPP')} to ${format(new Date(endDate), 'PPP')}`);
      doc.moveDown();
      
      // Add summary
      doc.fontSize(16).text('Summary');
      doc.fontSize(12).text(`Total Income: $${summary.totalIncome.toFixed(2)}`);
      doc.text(`Total Expense: $${summary.totalExpense.toFixed(2)}`);
      doc.text(`Net Balance: $${(summary.totalIncome - summary.totalExpense).toFixed(2)}`);
      doc.moveDown();
      
      // Add category breakdown
      doc.fontSize(16).text('Category Breakdown');
      summary.categorySummary.forEach(category => {
        doc.fontSize(12).text(`${category.category} (${category.type})`);
        doc.text(`Total: $${category.total.toFixed(2)} (${category.count} transactions)`);
        doc.moveDown(0.5);
      });
      
      doc.end();
      break;

    case 'csv':
      const fields = ['category', 'type', 'total', 'count'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(summary.categorySummary);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      res.send(csv);
      break;

    default:
      res.json(summary);
  }
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

// @desc    Get budget analysis
// @route   GET /api/reports/budget
// @access  Private
const getBudgetAnalysis = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const analysis = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $lookup: {
        from: 'budgets',
        let: { categoryId: '$category' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$categoryId'] },
                  { $lte: ['$startDate', new Date(endDate)] },
                  { $gte: ['$endDate', new Date(startDate)] }
                ]
              }
            }
          }
        ],
        as: 'budget'
      }
    },
    { $unwind: { path: '$budget', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$category',
        spent: { $sum: '$amount' },
        budget: { $first: '$budget.amount' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        category: '$category.name',
        spent: 1,
        budget: 1,
        remaining: { $subtract: ['$budget', '$spent'] },
        percentUsed: {
          $multiply: [
            { $divide: ['$spent', { $cond: [{ $eq: ['$budget', 0] }, 1, '$budget'] }] },
            100
          ]
        }
      }
    }
  ]);

  res.json(analysis);
});

module.exports = {
  getReport,
  getTrends,
  getBudgetAnalysis
};
