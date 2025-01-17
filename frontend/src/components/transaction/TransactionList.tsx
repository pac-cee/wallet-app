import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import TransactionCard from './TransactionCard';
import AddTransactionDialog from './AddTransactionDialog';
import { Transaction, Category, Account } from '../../types';

interface FilterState {
  search: string;
  type: '' | 'all' | 'income' | 'expense';
  category: string;
  account: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount';
}

interface FormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  date: string;
  notes?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onAddTransaction: (data: Omit<Transaction, '_id'>) => Promise<void>;
  onUpdateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  accounts,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: 'all',
    account: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date'
  });

  const [formData, setFormData] = useState<FormData>({
    description: '',
    amount: 0,
    type: 'expense',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleOpenDialog = () => {
    setSelectedTransaction(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (event: SelectChangeEvent<'all' | 'income' | 'expense'>) => {
    setFilters((prev) => ({
      ...prev,
      type: event.target.value as 'all' | 'income' | 'expense',
    }));
  };

  const handleFormTypeChange = (event: SelectChangeEvent<'income' | 'expense'>) => {
    setFormData((prev) => ({
      ...prev,
      type: event.target.value as 'income' | 'expense',
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterTransactions = (transaction: Transaction): boolean => {
    const searchMatch = transaction.description
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const typeMatch =
      filters.type === 'all' || transaction.type === filters.type;
    const categoryMatch =
      filters.category === 'all' ||
      (typeof transaction.category === 'object' &&
        transaction.category._id === filters.category);
    const accountMatch =
      filters.account === 'all' ||
      (typeof transaction.account === 'object' &&
        transaction.account._id === filters.account);

    return searchMatch && typeMatch && categoryMatch && accountMatch;
  };

  const sortTransactions = (a: Transaction, b: Transaction): number => {
    switch (filters.sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount':
        return b.amount - a.amount;
      default:
        return 0;
    }
  };

  const filteredTransactions = transactions
    .filter(filterTransactions)
    .sort(sortTransactions);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Transaction
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search"
            name="search"
            value={filters.search}
            onChange={handleFilterTextChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={filters.type}
              onChange={handleTypeChange}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={filters.category}
              onChange={handleFilterSelectChange}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Account</InputLabel>
            <Select
              name="account"
              value={filters.account}
              onChange={handleFilterSelectChange}
            >
              <MenuItem value="all">All Accounts</MenuItem>
              {accounts.map((account) => (
                <MenuItem key={account._id} value={account._id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredTransactions.map((transaction) => (
          <Grid item xs={12} key={transaction._id}>
            <TransactionCard
              transaction={transaction}
              onEdit={handleEditTransaction}
              onDelete={onDeleteTransaction}
            />
          </Grid>
        ))}
      </Grid>

      {filteredTransactions.length === 0 && (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 3 }}>
          No transactions found
        </Typography>
      )}

      <AddTransactionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onAdd={onAddTransaction}
        categories={categories}
        accounts={accounts}
      />
    </Box>
  );
};

export default TransactionList;
