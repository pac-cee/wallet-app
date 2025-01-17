import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';
import { transactionsAPI } from '../services/transactionsAPI';
import { accountsAPI } from '../services/accountsAPI';
import { categoriesAPI } from '../services/categoriesAPI';
import { useAuth } from '../contexts/AuthContext';
import CreateTestTransactions from '../components/transaction/CreateTestTransactions';
import { Transaction, Category, Account } from '../types';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, categoriesRes, accountsRes] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
        accountsAPI.getAll(),
      ]);
      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
      setAccounts(accountsRes.data);
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
        category: typeof transaction.category === 'string' ? transaction.category : transaction.category._id,
        account: typeof transaction.account === 'string' ? transaction.account : transaction.account._id,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setSelectedTransaction(null);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        account: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.description) {
      setError('Please enter a description');
      return;
    }

    if (!formData.amount || isNaN(Number(formData.amount))) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.account) {
      setError('Please select an account');
      return;
    }

    try {
      if (selectedTransaction) {
        await transactionsAPI.update(selectedTransaction._id, formData);
      } else {
        await transactionsAPI.create(formData);
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError('Failed to save transaction');
    }
  };

  const handleDelete = async (id: string) => {
    const transaction = transactions.find(t => t._id === id);
    if (!transaction) return;

    const account = getAccountById(typeof transaction.account === 'string' ? transaction.account : transaction.account._id);
    if (!account) return;

    const message = `Are you sure you want to delete this transaction?\n\nDescription: ${transaction.description}\nAmount: $${transaction.amount.toFixed(2)}\nAccount: ${account.name}\nDate: ${new Date(transaction.date).toLocaleDateString()}\n\nThis action cannot be undone.`;

    if (window.confirm(message)) {
      try {
        await transactionsAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat._id === id);
  };

  const getAccountById = (id: string) => {
    return accounts.find((account) => account._id === id);
  };

  const renderTransactionForm = () => (
    <form onSubmit={handleSubmit}>
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
          .filter(cat => cat.type === formData.type)
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
        label="Account"
        name="account"
        value={formData.account}
        onChange={handleChange}
        required
      >
        {accounts.map(account => (
          <MenuItem key={account._id} value={account._id}>
            {account.name} (Balance: ${account.balance.toFixed(2)})
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
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </form>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Transactions</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CreateTestTransactions 
            categories={categories} 
            accounts={accounts} 
            onSuccess={fetchData} 
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Account</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              const category = typeof transaction.category === 'string' 
                ? getCategoryById(transaction.category)
                : transaction.category;
              const account = typeof transaction.account === 'string'
                ? getAccountById(transaction.account)
                : transaction.account;
              
              return (
                <TableRow key={transaction._id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: category?.color 
                    }}>
                      {category?.name}
                    </Box>
                  </TableCell>
                  <TableCell>{account?.name}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {transaction.type === 'income' ? (
                        <IncomeIcon sx={{ color: 'success.main', mr: 1 }} fontSize="small" />
                      ) : (
                        <ExpenseIcon sx={{ color: 'error.main', mr: 1 }} fontSize="small" />
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          {renderTransactionForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedTransaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;
