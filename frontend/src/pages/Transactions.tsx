import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';
import { transactionsAPI, walletsAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  wallet: string;
  date: string;
}

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

interface Wallet {
  _id: string;
  name: string;
  balance: number;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    wallet: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, categoriesRes, walletsRes] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
        walletsAPI.getAll(),
      ]);

      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
      setWallets(walletsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        wallet: transaction.wallet,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setSelectedTransaction(null);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        wallet: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransaction(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes to ensure category matches transaction type
      ...(name === 'type' ? { category: '' } : {}),
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    if (!formData.type || !['income', 'expense'].includes(formData.type)) {
      setError('Please select a valid type');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.wallet) {
      setError('Please select a wallet');
      return;
    }

    if (!formData.date || isNaN(Date.parse(formData.date)) || new Date(formData.date) > new Date()) {
      setError('Please select a valid date not in the future');
      return;
    }

    try {
      const transactionData = {
        ...formData,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      if (selectedTransaction) {
        await transactionsAPI.update(selectedTransaction._id, transactionData);
      } else {
        await transactionsAPI.create(transactionData);
      }
      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      if (error.response?.status === 400) {
        setError(error.response.data.message || 'Invalid transaction data');
      } else if (error.response?.status === 404) {
        setError('Selected wallet or category not found');
      } else {
        setError('Failed to save transaction. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const transaction = transactions.find(t => t._id === id);
    if (!transaction) return;

    const wallet = getWalletById(transaction.wallet);
    if (!wallet) return;

    const message = `Are you sure you want to delete this transaction?\n\nDescription: ${transaction.description}\nAmount: $${transaction.amount.toFixed(2)}\nWallet: ${wallet.name}\nDate: ${new Date(transaction.date).toLocaleDateString()}\n\nThis action cannot be undone.`;

    if (window.confirm(message)) {
      try {
        await transactionsAPI.delete(id);
        fetchData();
      } catch (error: any) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat._id === id);
  };

  const getWalletById = (id: string) => {
    return wallets.find((wallet) => wallet._id === id);
  };

  const renderTransactionForm = () => (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        select
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>
      <TextField
        fullWidth
        margin="normal"
        select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        {categories
          .filter(category => category.type === formData.type)
          .map(category => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        fullWidth
        margin="normal"
        select
        label="Wallet"
        name="wallet"
        value={formData.wallet}
        onChange={handleChange}
        required
      >
        {wallets.map(wallet => (
          <MenuItem key={wallet._id} value={wallet._id}>
            {wallet.name} (Balance: ${wallet.balance.toFixed(2)})
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        margin="normal"
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : selectedTransaction ? 'Update' : 'Add'} Transaction
        </Button>
      </DialogActions>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Transaction
        </Button>
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent>
          {renderTransactionForm()}
        </DialogContent>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Wallet</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              const category = getCategoryById(transaction.category);
              const wallet = getWalletById(transaction.wallet);
              
              return (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={category?.name}
                      size="small"
                      sx={{
                        bgcolor: category?.color,
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>{wallet?.name}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {transaction.type === 'income' ? (
                        <IncomeIcon sx={{ color: 'success.main', mr: 1 }} />
                      ) : (
                        <ExpenseIcon sx={{ color: 'error.main', mr: 1 }} />
                      )}
                      ${transaction.amount.toFixed(2)}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(transaction)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(transaction._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Transactions;
