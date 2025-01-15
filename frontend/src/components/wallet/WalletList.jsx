import React, { useState } from 'react';
import { Grid, Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import WalletCard from './WalletCard';
import AddWalletDialog from './AddWalletDialog';
import { walletsAPI } from '../../services/api';

const WalletList = ({ wallets, onWalletChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

  const handleAddClick = () => {
    setEditingWallet(null);
    setDialogOpen(true);
  };

  const handleEditClick = (wallet) => {
    setEditingWallet(wallet);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (walletId) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        await walletsAPI.delete(walletId);
        onWalletChange();
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingWallet(null);
  };

  const handleDialogSubmit = async (data) => {
    try {
      if (editingWallet) {
        await walletsAPI.update(editingWallet._id, data);
      } else {
        await walletsAPI.create(data);
      }
      onWalletChange();
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Wallet
        </Button>
      </Box>
      <Grid container spacing={3}>
        {wallets.map((wallet) => (
          <Grid item xs={12} sm={6} md={4} key={wallet._id}>
            <WalletCard
              wallet={wallet}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </Grid>
        ))}
      </Grid>
      <AddWalletDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editingWallet}
      />
    </>
  );
};

export default WalletList;
