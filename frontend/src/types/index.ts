// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    budget: boolean;
  };
}

// Account types
export type AccountType = 'bank' | 'mobile_money' | 'cash' | 'credit_card' | 'savings' | 'investment';

export interface Account {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string;
  accountNumber?: string;
  bankName?: string;
  mobileProvider?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountFormData {
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
  description?: string;
  accountNumber?: string;
  bankName?: string;
  mobileProvider?: string;
  isDefault?: boolean;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
}

// Transaction types
export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string | Category;
  account: string | Account;
  date: string;
  notes?: string;
  attachments?: string[];
  recurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface TransactionFormData {
  description: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  account: string;
  date: string;
  notes?: string;
}

// Budget types
export interface Budget {
  _id: string;
  category: string | Category;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  notifications: boolean;
  notificationThreshold: number;
}

// Report types
export interface Report {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  categoryBreakdown: CategoryBreakdown[];
  transactions: Transaction[];
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CategoryForm {
  name: string;
  type: Category['type'];
  color: string;
  icon?: string;
}

export interface TransactionForm {
  description: string;
  amount: number;
  type: Transaction['type'];
  category: string;
  account: string;
  date: string;
  notes?: string;
  attachments?: File[];
  recurring?: boolean;
  recurringInterval?: Transaction['recurringInterval'];
}

export interface BudgetForm {
  category: string;
  limit: number;
  period: Budget['period'];
  notifications: boolean;
  notificationThreshold: number;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
