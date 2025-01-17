const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
    default: 'expense'
  },
  color: {
    type: String,
    default: '#000000'
  },
  icon: {
    type: String,
    default: 'attach_money'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create default categories for new users
categorySchema.statics.createDefaultCategories = async function(userId) {
  const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income', color: '#4CAF50', icon: 'work' },
    { name: 'Investment', type: 'income', color: '#2196F3', icon: 'trending_up' },
    { name: 'Gifts', type: 'income', color: '#9C27B0', icon: 'card_giftcard' },
    { name: 'Other Income', type: 'income', color: '#607D8B', icon: 'add' },

    // Expense categories
    { name: 'Food & Dining', type: 'expense', color: '#F44336', icon: 'restaurant' },
    { name: 'Transportation', type: 'expense', color: '#FF9800', icon: 'directions_car' },
    { name: 'Housing', type: 'expense', color: '#795548', icon: 'home' },
    { name: 'Utilities', type: 'expense', color: '#607D8B', icon: 'power' },
    { name: 'Shopping', type: 'expense', color: '#E91E63', icon: 'shopping_cart' },
    { name: 'Entertainment', type: 'expense', color: '#673AB7', icon: 'movie' },
    { name: 'Healthcare', type: 'expense', color: '#00BCD4', icon: 'local_hospital' },
    { name: 'Education', type: 'expense', color: '#3F51B5', icon: 'school' }
  ];

  const categories = defaultCategories.map(category => ({
    ...category,
    user: userId
  }));

  return this.insertMany(categories);
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
