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
  Grid,
  IconButton,
  CircularProgress,
  MenuItem,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountIcon,
} from '@mui/icons-material';
import { walletsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Wallet {
  _id: string;
  name: string;
  balance: number;
  type: string;
  currency: string;
}

const walletTypes = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Account' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
];

const currencies = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
];

const Accounts = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    type: 'bank',
    currency: 'USD',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await walletsAPI.getAll();
      setWallets(response.data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (wallet?: Wallet) => {
    if (wallet) {
      setSelectedWallet(wallet);
      setFormData({
        name: wallet.name,
        balance: wallet.balance.toString(),
        type: wallet.type,
        currency: wallet.currency,
      });
    } else {
      setSelectedWallet(null);
      setFormData({
        name: '',
        balance: '',
        type: 'bank',
        currency: 'USD',
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWallet(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      setError('Account name is required');
      return;
    }

    if (!formData.balance || isNaN(parseFloat(formData.balance))) {
      setError('Please enter a valid balance amount');
      return;
    }

    if (!formData.type) {
      setError('Please select an account type');
      return;
    }

    if (!formData.currency) {
      setError('Please select a currency');
      return;
    }

    try {
      const walletData = {
        ...formData,
        name: formData.name.trim(),
        balance: parseFloat(formData.balance),
      };

      if (selectedWallet) {
        await walletsAPI.update(selectedWallet._id, walletData);
      } else {
        await walletsAPI.create(walletData);
      }
      handleCloseDialog();
      fetchWallets();
    } catch (error: any) {
      console.error('Error saving wallet:', error);
      setError(error.response?.data?.message || 'Failed to save account');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        await walletsAPI.delete(id);
        fetchWallets();
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    }
  };

  const getWalletTypeIcon = (type: string) => {
    return <AccountIcon />;
  };

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
        <Typography variant="h4">My Accounts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Account
        </Button>
      </Box>

      <Grid container spacing={3}>
        {wallets.map((wallet) => (
          <Grid item xs={12} sm={6} md={4} key={wallet._id}>
            <Card sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{wallet.name}</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {wallet.currency} {wallet.balance.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {wallet.type ? wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1) : 'N/A'}
              </Typography>
              <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(wallet)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(wallet._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedWallet ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Account Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Balance"
              name="balance"
              type="number"
              value={formData.balance}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{
                step: "0.01",
                min: "0",
              }}
            />
            <TextField
              fullWidth
              select
              label="Account Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              margin="normal"
            >
              {walletTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              margin="normal"
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedWallet ? 'Save Changes' : 'Add Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts;
