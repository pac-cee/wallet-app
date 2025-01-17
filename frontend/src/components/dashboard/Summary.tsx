import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';

interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyBudget: number;
  monthlyExpenses: number;
}

interface SummaryProps {
  data: SummaryData;
}

const Summary: React.FC<SummaryProps> = ({ data }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateBudgetProgress = (): number => {
    if (data.monthlyBudget === 0) return 0;
    return Math.min((data.monthlyExpenses / data.monthlyBudget) * 100, 100);
  };

  const getBudgetColor = (progress: number): string => {
    if (progress >= 90) return 'error';
    if (progress >= 70) return 'warning';
    return 'success';
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BalanceIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Balance</Typography>
            </Box>
            <Typography variant="h4">{formatCurrency(data.totalBalance)}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <IncomeIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Income</Typography>
            </Box>
            <Typography variant="h4" color="success.main">
              {formatCurrency(data.totalIncome)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ExpenseIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Expenses</Typography>
            </Box>
            <Typography variant="h4" color="error.main">
              {formatCurrency(data.totalExpenses)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Budget
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(data.monthlyExpenses)} of {formatCurrency(data.monthlyBudget)} spent
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateBudgetProgress()}
                color={getBudgetColor(calculateBudgetProgress()) as any}
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {(100 - calculateBudgetProgress()).toFixed(1)}% of budget remaining
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Summary;
