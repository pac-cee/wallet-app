import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  AccountBalance as WalletIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
} from '@mui/icons-material';

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          p: 1,
          borderRadius: 1,
          mr: 2,
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const Summary = ({ wallets }) => {
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  // In a real app, you'd calculate these from actual transactions
  const monthlyIncome = 5000; // Example value
  const monthlyExpenses = 3000; // Example value

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <SummaryCard
          title="Total Balance"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalBalance)}
          icon={WalletIcon}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SummaryCard
          title="Monthly Income"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(monthlyIncome)}
          icon={IncomeIcon}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SummaryCard
          title="Monthly Expenses"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(monthlyExpenses)}
          icon={ExpenseIcon}
          color="error"
        />
      </Grid>
    </Grid>
  );
};

export default Summary;
