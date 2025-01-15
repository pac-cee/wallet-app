import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  Alert,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { transactionsAPI } from '../services/api';

const BudgetManager = ({ wallet, onUpdateBudget }) => {
  const [budget, setBudget] = useState({
    amount: wallet.budget?.amount || 0,
    period: wallet.budget?.period || 'monthly',
    notifications: {
      enabled: wallet.budget?.notifications?.enabled || true,
      threshold: wallet.budget?.notifications?.threshold || 80,
    },
  });

  const [currentSpending, setCurrentSpending] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentSpending();
  }, [wallet._id, budget.period]);

  const fetchCurrentSpending = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getReport({
        walletId: wallet._id,
        period: budget.period,
        type: 'expense',
      });
      setCurrentSpending(response.data.total);
    } catch (err) {
      console.error('Error fetching spending:', err);
      setError('Failed to fetch current spending');
    } finally {
      setLoading(false);
    }
  };

  const spendingPercentage = (currentSpending / budget.amount) * 100;

  const handleBudgetChange = (field) => (event) => {
    setBudget((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNotificationChange = (field) => (event) => {
    setBudget((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: field === 'enabled' ? event.target.checked : event.target.value,
      },
    }));
  };

  const saveBudget = async () => {
    try {
      setError(null);
      await onUpdateBudget(budget);
      await fetchCurrentSpending();
    } catch (err) {
      setError('Failed to update budget settings');
    }
  };

  const getProgressColor = () => {
    if (spendingPercentage >= 100) return 'error';
    if (spendingPercentage >= budget.notifications.threshold) return 'warning';
    return 'success';
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Budget Settings for {wallet.name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Budget Amount"
            type="number"
            value={budget.amount}
            onChange={handleBudgetChange('amount')}
            margin="normal"
            InputProps={{
              startAdornment: wallet.currency,
            }}
          />

          <TextField
            fullWidth
            select
            label="Budget Period"
            value={budget.period}
            onChange={handleBudgetChange('period')}
            margin="normal"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={budget.notifications.enabled}
                onChange={handleNotificationChange('enabled')}
                color="primary"
              />
            }
            label="Enable Budget Notifications"
          />

          {budget.notifications.enabled && (
            <TextField
              fullWidth
              type="number"
              label="Notification Threshold (%)"
              value={budget.notifications.threshold}
              onChange={handleNotificationChange('threshold')}
              margin="normal"
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 100,
                },
              }}
            />
          )}

          <Button
            variant="contained"
            onClick={saveBudget}
            sx={{ mt: 2 }}
            fullWidth
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Budget Settings'}
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Current Spending Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(spendingPercentage, 100)}
              color={getProgressColor()}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {`${Math.round(spendingPercentage)}% of budget used (${currentSpending.toLocaleString('en-US', {
                style: 'currency',
                currency: wallet.currency,
              })} / ${budget.amount.toLocaleString('en-US', {
                style: 'currency',
                currency: wallet.currency,
              })})`}
            </Typography>
          </Box>

          {budget.notifications.enabled && spendingPercentage >= budget.notifications.threshold && (
            <Alert severity={spendingPercentage >= 100 ? 'error' : 'warning'} sx={{ mt: 2 }}>
              {spendingPercentage >= 100
                ? `Budget exceeded! You've spent ${(spendingPercentage - 100).toFixed(1)}% more than your budget.`
                : `Warning: You've used ${spendingPercentage.toFixed(1)}% of your budget.`}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BudgetManager;
