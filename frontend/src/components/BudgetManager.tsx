import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Budget, Category } from '../types';

interface FormData {
  category: string;
  limit: number;
  period: 'monthly' | 'yearly';
  notifications: boolean;
  notificationThreshold?: number;
}

interface BudgetManagerProps {
  budgets: Budget[];
  categories: Category[];
  onAddBudget: (budget: FormData) => Promise<void>;
  onUpdateBudget: (id: string, budget: Partial<FormData>) => Promise<void>;
  onDeleteBudget: (id: string) => Promise<void>;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  categories,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<FormData>({
    category: '',
    limit: 0,
    period: 'monthly',
    notifications: true,
    notificationThreshold: 80,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedBudget) {
      setFormData({
        category: typeof selectedBudget.category === 'object' ? selectedBudget.category._id : selectedBudget.category,
        limit: selectedBudget.limit,
        period: selectedBudget.period,
        notifications: selectedBudget.notifications,
        notificationThreshold: selectedBudget.notificationThreshold,
      });
    }
  }, [selectedBudget]);

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setSelectedBudget(budget);
    } else {
      setSelectedBudget(null);
      setFormData({
        category: '',
        limit: 0,
        period: 'monthly',
        notifications: true,
        notificationThreshold: 80,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBudget(null);
    setError('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedBudget) {
        await onUpdateBudget(selectedBudget._id, formData);
      } else {
        await onAddBudget(formData);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save budget');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteBudget(id);
    } catch (err) {
      setError('Failed to delete budget');
    }
  };

  const calculateProgress = (spent: number, limit: number): number => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'error';
    if (progress >= 70) return 'warning';
    return 'success';
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Budget Manager
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Budget
        </Button>
      </Box>

      <Grid container spacing={3}>
        {budgets.map((budget) => (
          <Grid item xs={12} sm={6} md={4} key={budget._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {typeof budget.category === 'object' ? budget.category.name : 'Unknown Category'}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(budget)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(budget._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                </Typography>

                <Box sx={{ mt: 2, mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(budget.spent, budget.limit)}
                    color={getProgressColor(calculateProgress(budget.spent, budget.limit)) as any}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">
                    Spent: ${budget.spent.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Limit: ${budget.limit.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedBudget ? 'Edit Budget' : 'Add New Budget'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Budget Limit"
                name="limit"
                type="number"
                value={formData.limit}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleSwitchChange('notifications')}
                  />
                }
                label="Enable Notifications"
                sx={{ mb: 2 }}
              />

              {formData.notifications && (
                <TextField
                  fullWidth
                  label="Notification Threshold (%)"
                  name="notificationThreshold"
                  type="number"
                  value={formData.notificationThreshold}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  required
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedBudget ? 'Update' : 'Add'} Budget
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default BudgetManager;
