import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number, type: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(type === 'expense' ? -amount : amount);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Transactions</Typography>
          <Button component={RouterLink} to="/transactions" color="primary">
            View All
          </Button>
        </Box>

        <List>
          {transactions.map((transaction) => (
            <ListItem key={transaction._id} sx={{ px: 0 }}>
              <ListItemText
                primary={transaction.description}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={typeof transaction.category === 'object' ? transaction.category.name : 'Unknown'}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(transaction.date)}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Typography
                  variant="body2"
                  color={transaction.type === 'expense' ? 'error' : 'success'}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {transactions.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No recent transactions
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
