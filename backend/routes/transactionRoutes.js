const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateTransaction = [
  body('account').notEmpty().withMessage('Account is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('type').isIn(['income', 'expense']).withMessage('Invalid transaction type'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('notes').optional().trim(),
];

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, type, category, account, sortBy = 'date', sortOrder = 'desc' } = req.query;

    // Build query
    const query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (account) query.account = account;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const transactions = await Transaction.find(query)
      .populate('category', 'name type')
      .populate('account', 'name type currency')
      .sort(sort);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new transaction
router.post('/', auth, validateTransaction, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      account: accountId,
      category,
      type,
      amount,
      description,
      date,
      notes
    } = req.body;

    // Verify account belongs to user
    const account = await Account.findOne({
      _id: accountId,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const transaction = new Transaction({
      user: req.user._id,
      account: accountId,
      category,
      type,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      notes
    });

    await transaction.save();

    // Populate category and account details
    await transaction.populate('category', 'name type');
    await transaction.populate('account', 'name type currency');

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a transaction
router.patch('/:id', auth, validateTransaction, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // If account is being changed, verify new account belongs to user
    if (req.body.account && req.body.account !== transaction.account.toString()) {
      const newAccount = await Account.findOne({
        _id: req.body.account,
        user: req.user._id
      });

      if (!newAccount) {
        return res.status(404).json({ message: 'New account not found' });
      }

      // Revert balance change from old account
      const oldAccount = await Account.findById(transaction.account);
      oldAccount.balance -= transaction.type === 'income' ? transaction.amount : -transaction.amount;
      await oldAccount.save();

      // Apply balance change to new account
      newAccount.balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      await newAccount.save();
    }

    // Update transaction
    const updates = req.body;
    if (updates.amount) {
      updates.amount = parseFloat(updates.amount);
    }
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    Object.keys(updates).forEach(update => {
      transaction[update] = updates[update];
    });

    await transaction.save();

    // Populate category and account details
    await transaction.populate('category', 'name type');
    await transaction.populate('account', 'name type currency');

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.remove();
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { user: req.user._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            type: '$type',
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.type',
          monthly: {
            $push: {
              month: '$_id.month',
              year: '$_id.year',
              total: '$total',
              count: '$count'
            }
          },
          totalAmount: { $sum: '$total' },
          totalCount: { $sum: '$count' }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
