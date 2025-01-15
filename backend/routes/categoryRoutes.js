const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import category controller
const categoryController = require('../controllers/categoryController');

// Apply auth middleware to all routes
router.use(protect);

// Category routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Subcategory routes
router.post('/:categoryId/subcategories', categoryController.createSubcategory);
router.put('/:categoryId/subcategories/:subcategoryId', categoryController.updateSubcategory);
router.delete('/:categoryId/subcategories/:subcategoryId', categoryController.deleteSubcategory);

module.exports = router;
