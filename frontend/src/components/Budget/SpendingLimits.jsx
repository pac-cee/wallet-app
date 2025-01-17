import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  LinearProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

const SpendingLimits = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: 0,
    period: 'monthly',
    startDate: new Date(),
    endDate: new Date(),
    notifications: {
      enabled: true,
      threshold: 80
    }
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenDialog = (budget = null) => {
    if (budget) {
      setSelectedBudget(budget);
      setFormData({
        category: budget.category._id,
        amount: budget.amount,
        period: budget.period,
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
        notifications: budget.notifications
      });
    } else {
      setSelectedBudget(null);
      setFormData({
        category: '',
        amount: 0,
        period: 'monthly',
        startDate: new Date(),
        endDate: new Date(),
        notifications: {
          enabled: true,
          threshold: 80
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (selectedBudget) {
        await axios.put(`/api/budgets/${selectedBudget._id}`, formData);
      } else {
        await axios.post('/api/budgets', formData);
      }
      fetchBudgets();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const calculateProgress = (budget) => {
    const spent = budget.spent || 0;
    return (spent / budget.amount) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'error';
    if (progress >= 70) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Spending Limits</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Limit
            </Button>
          </Box>
        </Grid>

        {budgets.map((budget) => (
          <Grid item xs={12} md={6} key={budget._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">{budget.category.name}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(budget)}
                  >
                    Edit
                  </Button>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Period: {budget.period}
                </Typography>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>
                    ${budget.spent || 0} of ${budget.amount}
                  </Typography>
                  <Typography>
                    {Math.round(calculateProgress(budget))}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={calculateProgress(budget)}
                  color={getProgressColor(calculateProgress(budget))}
                  sx={{ height: 10, borderRadius: 5 }}
                />

                {calculateProgress(budget) >= budget.notifications.threshold && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    You've reached {budget.notifications.threshold}% of your budget!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedBudget ? 'Edit Spending Limit' : 'Add Spending Limit'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={formData.period}
                  label="Period"
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) =>
                  setFormData({ ...formData, startDate: newValue })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) =>
                  setFormData({ ...formData, endDate: newValue })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          enabled: e.target.checked
                        }
                      })
                    }
                  />
                }
                label="Enable Notifications"
              />
            </Grid>
            {formData.notifications.enabled && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notification Threshold (%)"
                  type="number"
                  value={formData.notifications.threshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        threshold: Number(e.target.value)
                      }
                    })
                  }
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedBudget ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpendingLimits;
