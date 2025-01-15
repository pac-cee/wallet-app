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

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const AddWalletDialog = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    balance: initialData?.balance || '',
    currency: initialData?.currency || 'USD',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      balance: parseFloat(formData.balance),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Wallet' : 'Add New Wallet'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              name="name"
              label="Wallet Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              name="balance"
              label="Initial Balance"
              type="number"
              fullWidth
              value={formData.balance}
              onChange={handleChange}
              required
              inputProps={{ step: '0.01' }}
            />
            <TextField
              name="currency"
              label="Currency"
              select
              fullWidth
              value={formData.currency}
              onChange={handleChange}
              required
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Save Changes' : 'Add Wallet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddWalletDialog;
