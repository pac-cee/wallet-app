import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';
import { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(transaction);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await onDelete(transaction._id);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
    handleMenuClose();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" component="div">
              {transaction.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                label={typeof transaction.category === 'object' ? transaction.category.name : 'Unknown'}
                size="small"
                color={transaction.type === 'expense' ? 'error' : 'success'}
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(transaction.date)}
              </Typography>
            </Box>
            {transaction.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {transaction.notes}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              {transaction.type === 'expense' ? (
                <ExpenseIcon color="error" sx={{ mr: 0.5 }} />
              ) : (
                <IncomeIcon color="success" sx={{ mr: 0.5 }} />
              )}
              <Typography
                variant="h6"
                color={transaction.type === 'expense' ? 'error' : 'success'}
              >
                {formatCurrency(transaction.amount)}
              </Typography>
            </Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
