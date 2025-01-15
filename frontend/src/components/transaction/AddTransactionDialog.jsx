import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';

const categories = {
  income: [
    'Salary',
    'Investment',
    'Freelance',
    'Gift',
    'Other Income',
  ],
  expense: [
    'Food',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Other Expense',
  ],
};

const AddTransactionDialog = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}), // Reset category when type changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="type"
              label="Transaction Type"
              select
              fullWidth
              value={formData.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
            <TextField
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleChange}
              required
              inputProps={{ step: '0.01', min: '0' }}
            />
            <TextField
              name="category"
              label="Category"
              select
              fullWidth
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories[formData.type].map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="description"
              label="Description"
              fullWidth
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTransactionDialog;
