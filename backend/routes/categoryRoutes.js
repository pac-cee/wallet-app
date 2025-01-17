const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format'),
  body('icon').optional().notEmpty().withMessage('Icon cannot be empty if provided')
];

// Apply auth middleware to all routes
router.use(auth);

// Category routes
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = new Category({
      ...req.body,
      user: req.user._id
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create default categories
router.post('/defaults', async (req, res) => {
  try {
    await Category.createDefaultCategories(req.user._id);
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    console.error('Error creating default categories:', err);
    res.status(500).json({ message: 'Failed to create default categories' });
  }
});

// Create default categories for a user
router.post('/create-defaults', async (req, res) => {
  try {
    await Category.createDefaultCategories(req.user._id);
    const categories = await Category.find({ user: req.user._id });
    res.status(201).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Subcategory routes
router.post('/:categoryId/subcategories', async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.categoryId, user: req.user._id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = new Category({
      ...req.body,
      user: req.user._id,
      parent: req.params.categoryId
    });

    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.categoryId, user: req.user._id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = await Category.findOneAndUpdate(
      { _id: req.params.subcategoryId, user: req.user._id, parent: req.params.categoryId },
      { $set: req.body },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.categoryId, user: req.user._id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = await Category.findOneAndDelete({
      _id: req.params.subcategoryId,
      user: req.user._id,
      parent: req.params.categoryId
    });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
