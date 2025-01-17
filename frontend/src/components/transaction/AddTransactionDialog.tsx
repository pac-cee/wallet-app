import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Transaction, Category, Account, TransactionFormData } from '../../types';
import { transactionsAPI } from '../../services/transactionsAPI';

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Transaction) => Promise<void>;
  categories: Category[];
  accounts: Account[];
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onClose,
  onAdd,
  categories,
  accounts,
}) => {
  const [formData, setFormData] = React.useState<TransactionFormData>({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }

      if (!formData.amount || isNaN(parseFloat(formData.amount))) {
        throw new Error('Please enter a valid amount');
      }

      if (!formData.category) {
        throw new Error('Category is required');
      }

      if (!formData.account) {
        throw new Error('Account is required');
      }

      if (!formData.date) {
        throw new Error('Date is required');
      }

      const transaction = await transactionsAPI.create(formData);
      onAdd(transaction.data);
      onClose();
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        account: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (error: any) {
      console.error('Failed to add transaction:', error);
      alert(error.response?.data?.message || error.message || 'Failed to add transaction');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Transaction</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="amount"
          label="Amount"
          type="number"
          fullWidth
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleSelectChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Account</InputLabel>
          <Select
            name="account"
            value={formData.account}
            onChange={handleSelectChange}
            required
          >
            {accounts.map((account) => (
              <MenuItem key={account._id} value={account._id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="date"
          label="Date"
          type="date"
          fullWidth
          value={formData.date}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="notes"
          label="Notes"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.notes}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionDialog;
