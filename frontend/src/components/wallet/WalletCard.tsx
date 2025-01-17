import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  AccountBalance as BankIcon,
  AccountBalanceWallet as CashIcon,
  Phone as MobileIcon,
  CreditCard as CreditCardIcon,
  Savings as SavingsIcon,
  TrendingUp as InvestmentIcon,
} from '@mui/icons-material';
import { Account } from '../../types';

interface WalletCardProps {
  wallet: Account;
  onEdit: (wallet: Account) => void;
  onDelete: (walletId: string) => Promise<void>;
}

const getWalletIcon = (type: Account['type']) => {
  switch (type) {
    case 'bank':
      return <BankIcon />;
    case 'cash':
      return <CashIcon />;
    case 'mobile_money':
      return <MobileIcon />;
    case 'credit_card':
      return <CreditCardIcon />;
    case 'savings':
      return <SavingsIcon />;
    case 'investment':
      return <InvestmentIcon />;
    default:
      return <CashIcon />;
  }
};

const getWalletColor = (type: Account['type']): string => {
  switch (type) {
    case 'bank':
      return '#2196f3'; // Blue
    case 'cash':
      return '#4caf50'; // Green
    case 'mobile_money':
      return '#ff9800'; // Orange
    case 'credit_card':
      return '#f44336'; // Red
    case 'savings':
      return '#9c27b0'; // Purple
    case 'investment':
      return '#009688'; // Teal
    default:
      return '#757575'; // Grey
  }
};

const WalletCard: React.FC<WalletCardProps> = ({ wallet, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(wallet);
  };

  const handleDelete = async () => {
    handleMenuClose();
    await onDelete(wallet._id);
  };

  const formatBalance = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderLeft: `6px solid ${getWalletColor(wallet.type)}`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getWalletIcon(wallet.type)}
            <Typography variant="h6" component="div">
              {wallet.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            aria-label="wallet options"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h5"
          color="primary"
          sx={{ mb: 1, fontWeight: 'bold' }}
        >
          {formatBalance(wallet.balance, wallet.currency)}
        </Typography>

        {wallet.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {wallet.description}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          {wallet.type === 'bank' && wallet.bankName && (
            <Box component="span" sx={{ display: 'block' }}>
              {wallet.bankName}
            </Box>
          )}
          {wallet.type === 'mobile_money' && wallet.mobileProvider && (
            <Box component="span" sx={{ display: 'block' }}>
              {wallet.mobileProvider}
            </Box>
          )}
          {wallet.accountNumber && (
            <Box component="span" sx={{ display: 'block' }}>
              {wallet.accountNumber}
            </Box>
          )}
        </Typography>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default WalletCard;
