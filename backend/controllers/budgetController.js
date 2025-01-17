const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
const createBudget = asyncHandler(async (req, res) => {
  const { category, amount, period, startDate, endDate, notifications } = req.body;
  
  // Check for existing budget in the same period
  const existingBudget = await Budget.findOne({
    category,
    user: req.user._id,
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  });

  if (existingBudget) {
    res.status(400);
    throw new Error('A budget already exists for this category in the specified period');
  }

  const budget = await Budget.create({
    category,
    amount,
    period,
    startDate,
    endDate,
    notifications,
    user: req.user._id
  });

  res.status(201).json(budget);
});

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id })
    .populate('category', 'name type color');

  // Calculate spent amount for each budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId(req.user._id),
            category: mongoose.Types.ObjectId(budget.category._id),
            type: 'expense',
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      return {
        ...budget.toObject(),
        spent: spent[0]?.total || 0,
        remaining: budget.amount - (spent[0]?.total || 0),
        percentUsed: ((spent[0]?.total || 0) / budget.amount) * 100
      };
    })
  );

  res.json(budgetsWithSpent);
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  if (budget.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedBudget = await Budget.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate('category', 'name type color');

  res.json(updatedBudget);
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  if (budget.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await budget.remove();
  res.json({ message: 'Budget removed' });
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
  }).populate('category', 'name');

  if (budget) {
    const spent = await Transaction.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.user._id),
          category: mongoose.Types.ObjectId(categoryId),
          type: 'expense',
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalSpent = (spent[0]?.total || 0) + amount;
    const percentUsed = (totalSpent / budget.amount) * 100;

    if (budget.notifications.enabled && percentUsed >= budget.notifications.threshold) {
      // You might want to implement a notification system here
      // For now, we'll just return the warning
      return res.json({
        exceeded: true,
        budget,
        spent: totalSpent,
        remaining: budget.amount - totalSpent,
        percentUsed,
        warning: `You've reached ${budget.notifications.threshold}% of your budget for ${budget.category.name}`
      });
    }
  }

  res.json({ exceeded: false });
});

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  checkBudget
};
