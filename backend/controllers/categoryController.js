const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, type, color, icon } = req.body;

  // Validate required fields
  if (!name || !type) {
    res.status(400);
    throw new Error('Name and type are required');
  }

  // Validate type
  if (!['income', 'expense'].includes(type)) {
    res.status(400);
    throw new Error('Type must be either income or expense');
  }

  const category = await Category.create({
    name,
    type,
    color: color || '#1976d2',
    icon: icon || 'category',
    user: req.user._id,
  });

  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { name, type, color, icon } = req.body;
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (type && !['income', 'expense'].includes(type)) {
    res.status(400);
    throw new Error('Type must be either income or expense');
  }

  category.name = name || category.name;
  category.type = type || category.type;
  category.color = color || category.color;
  category.icon = icon || category.icon;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ message: 'Category deleted' });
});

// @desc    Create subcategory
// @route   POST /api/categories/:categoryId/subcategories
// @access  Private
const createSubcategory = asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  const category = await Category.findOne({ _id: req.params.categoryId, user: req.user._id });
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (!name || !color) {
    res.status(400);
    throw new Error('Name and color are required');
  }

  const subcategory = {
    name,
    color,
  };

  category.subcategories.push(subcategory);
  const updatedCategory = await category.save();
  
  res.status(201).json(updatedCategory.subcategories[updatedCategory.subcategories.length - 1]);
});

// @desc    Update subcategory
// @route   PUT /api/categories/:categoryId/subcategories/:subcategoryId
// @access  Private
const updateSubcategory = asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  const category = await Category.findOne({ _id: req.params.categoryId, user: req.user._id });
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const subcategory = category.subcategories.id(req.params.subcategoryId);
  if (!subcategory) {
    res.status(404);
    throw new Error('Subcategory not found');
  }

  subcategory.name = name || subcategory.name;
  subcategory.color = color || subcategory.color;

  const updatedCategory = await category.save();
  res.json(subcategory);
});

// @desc    Delete subcategory
// @route   DELETE /api/categories/:categoryId/subcategories/:subcategoryId
// @access  Private
const deleteSubcategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.categoryId, user: req.user._id });
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const subcategory = category.subcategories.id(req.params.subcategoryId);
  if (!subcategory) {
    res.status(404);
    throw new Error('Subcategory not found');
  }

  category.subcategories.pull(subcategory);
  await category.save();
  res.json({ message: 'Subcategory deleted' });
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
