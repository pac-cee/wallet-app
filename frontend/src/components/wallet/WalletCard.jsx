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
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const WalletCard = ({ wallet, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(wallet);
  };

  const handleDelete = () => {
    handleClose();
    onDelete(wallet._id);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>
        <Typography variant="h6" component="div" gutterBottom>
          {wallet.name}
        </Typography>
        <Typography variant="h4" color="primary">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: wallet.currency,
          }).format(wallet.balance)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {wallet.currency}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
