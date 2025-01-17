import React, { useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import WalletCard from './WalletCard';
import AddWalletDialog from './AddWalletDialog';
import { Account, AccountFormData } from '../../types';

interface WalletListProps {
  wallets: Account[];
  onAddWallet: (data: AccountFormData) => Promise<void>;
  onUpdateWallet: (id: string, data: Partial<AccountFormData>) => Promise<void>;
  onDeleteWallet: (id: string) => Promise<void>;
}

const WalletList: React.FC<WalletListProps> = ({
  wallets,
  onAddWallet,
  onUpdateWallet,
  onDeleteWallet,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Account | null>(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWallet(null);
  };

  const handleEdit = (wallet: Account) => {
    setSelectedWallet(wallet);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Account
        </Button>
      </Box>

      <Grid container spacing={3}>
        {wallets.map((wallet) => (
          <Grid item xs={12} sm={6} md={4} key={wallet._id}>
            <WalletCard
              wallet={wallet}
              onEdit={handleEdit}
              onDelete={onDeleteWallet}
            />
          </Grid>
        ))}
      </Grid>

      <AddWalletDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onAdd={onAddWallet}
      />
    </Box>
  );
};

export default WalletList;
