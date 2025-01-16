const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Transaction = require('../models/transactionModel');

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
const createBudget = asyncHandler(async (req, res) => {
  const { category, amount, period, startDate, endDate } = req.body;
  
  const budget = await Budget.create({
    category,
    amount,
    period,
    startDate,
    endDate,
    user: req.user._id
  });

  res.status(201).json(budget);
});

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id })
    .populate('category', 'name type');
  res.json(budgets);
});

// @desc    Check budget and create notification if exceeded
// @route   POST /api/budgets/check
// @access  Private
const checkBudget = asyncHandler(async (req, res) => {
  const { categoryId, amount } = req.body;
  
  const budget = await Budget.findOne({
    category: categoryId,
    user: req.user._id,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });

  if (budget) {
    budget.spent += amount;
    
    if (budget.spent > budget.amount && budget.notifications.length === 0) {
      budget.notifications.push({
        message: `Budget exceeded for ${budget.category.name}`,
        date: new Date()
      });
    }
    
    await budget.save();
  }

  res.json(budget);
});

module.exports = {
  createBudget,
  getBudgets,
  checkBudget
};
