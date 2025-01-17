import React from 'react';
import { Button } from '@mui/material';
import { categoriesAPI } from '../../services/categoriesAPI';

interface CreateDefaultCategoriesProps {
  onSuccess?: () => void;
}

const CreateDefaultCategories: React.FC<CreateDefaultCategoriesProps> = ({ onSuccess }) => {
  const handleCreateDefaults = async () => {
    try {
      await categoriesAPI.createDefaultCategories();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create default categories:', error);
      alert('Failed to create default categories. Please try again.');
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleCreateDefaults}
    >
      Create Default Categories
    </Button>
  );
};

export default CreateDefaultCategories;
