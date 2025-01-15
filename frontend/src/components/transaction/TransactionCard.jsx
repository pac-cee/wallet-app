import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';

const TransactionCard = ({ transaction, onEdit, onDelete, currency }) => {
  const { type, amount, category, description, date } = transaction;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
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
    <ListItem
      sx={{
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: type === 'income' ? 'success.main' : 'error.main',
          mr: 2,
        }}
      >
        {type === 'income' ? <IncomeIcon /> : <ExpenseIcon />}
      </Box>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">{category}</Typography>
            <Typography
              variant="subtitle1"
              color={type === 'income' ? 'success.main' : 'error.main'}
            >
              {type === 'expense' ? '-' : '+'}
              {formatAmount(amount)}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {description || category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(date)}
            </Typography>
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => onEdit(transaction)} size="small">
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          onClick={() => onDelete(transaction._id)}
          size="small"
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TransactionCard;
