import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import {
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';

const RecentTransactions = ({ transactions = [], currency = 'USD' }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      {transactions.length === 0 ? (
        <Typography color="text.secondary">No recent transactions</Typography>
      ) : (
        <List>
          {transactions.map((transaction) => (
            <ListItem key={transaction._id} sx={{ px: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color:
                    transaction.type === 'income'
                      ? 'success.main'
                      : 'error.main',
                  mr: 2,
                }}
              >
                {transaction.type === 'income' ? (
                  <IncomeIcon />
                ) : (
                  <ExpenseIcon />
                )}
              </Box>
              <ListItemText
                primary={transaction.category}
                secondary={transaction.description || transaction.category}
              />
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="body2"
                  color={
                    transaction.type === 'income'
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatAmount(transaction.amount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(transaction.date)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RecentTransactions;
