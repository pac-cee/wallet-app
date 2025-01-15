import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
} from '@mui/material';
import { Add, Edit, Delete, Category } from '@mui/icons-material';
import { ChromePicker } from 'react-color';

const CategoryManager = ({ categories, onAdd, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#1976d2',
    icon: 'category',
    parent: null,
  });

  const handleOpen = (category = null) => {
    if (category) {
      setEditMode(true);
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
        parent: category.parent,
      });
    } else {
      setEditMode(false);
      setSelectedCategory(null);
      setFormData({
        name: '',
        type: 'expense',
        color: '#1976d2',
        icon: 'category',
        parent: null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedCategory(null);
  };

  const handleSubmit = () => {
    if (editMode) {
      onEdit(selectedCategory._id, formData);
    } else {
      onAdd(formData);
    }
    handleClose();
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parent);
  };

  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Categories & Subcategories
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Category
        </Button>
      </Box>

      <List>
        {getParentCategories().map((category) => (
          <React.Fragment key={category._id}>
            <ListItem
              sx={{
                borderLeft: `4px solid ${category.color}`,
                mb: 1,
                bgcolor: 'background.paper',
              }}
            >
              <Category sx={{ color: category.color, mr: 1 }} />
              <ListItemText
                primary={category.name}
                secondary={`Type: ${category.type}`}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleOpen(category)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(category._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            
            {/* Subcategories */}
            <List sx={{ pl: 4 }}>
              {getSubcategories(category._id).map((subcategory) => (
                <ListItem
                  key={subcategory._id}
                  sx={{
                    borderLeft: `2px solid ${subcategory.color}`,
                    mb: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Category sx={{ color: subcategory.color, mr: 1 }} />
                  <ListItemText
                    primary={subcategory.name}
                    secondary={`Type: ${subcategory.type}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpen(subcategory)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(subcategory._id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </React.Fragment>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={formData.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          
          <TextField
            fullWidth
            select
            label="Type"
            value={formData.type}
            onChange={handleChange('type')}
            margin="normal"
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Parent Category"
            value={formData.parent || ''}
            onChange={handleChange('parent')}
            margin="normal"
          >
            <MenuItem value="">None (Main Category)</MenuItem>
            {getParentCategories().map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Category Color
            </Typography>
            <ChromePicker
              color={formData.color}
              onChange={(color) => setFormData(prev => ({ ...prev, color: color.hex }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoryManager;
