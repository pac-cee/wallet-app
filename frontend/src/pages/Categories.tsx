import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemSecondaryAction,
  Collapse,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { categoriesAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import CreateDefaultCategories from '../components/category/CreateDefaultCategories';

interface SubCategory {
  _id: string;
  name: string;
  color: string;
}

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  subcategories?: SubCategory[];
}

interface FormData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  parentCategoryId?: string;
}

const initialFormData: FormData = {
  name: '',
  type: 'expense',
  color: '#1976d2'
};

const categoryTypes = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const colors = [
  { value: '#1976d2', label: 'Blue' },
  { value: '#2e7d32', label: 'Green' },
  { value: '#d32f2f', label: 'Red' },
  { value: '#ed6c02', label: 'Orange' },
  { value: '#9c27b0', label: 'Purple' },
  { value: '#0288d1', label: 'Light Blue' },
  { value: '#388e3c', label: 'Light Green' },
  { value: '#d81b60', label: 'Pink' },
];

const Categories = () => {
  const { showNotification } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.data) {
        setCategories(response.data);
      } else {
        setCategories([]);
        showNotification('warning', 'No categories found');
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      if (error.response?.status === 404) {
        showNotification('info', 'No categories found. Create your first category!');
      } else {
        showNotification('error', error.response?.data?.message || 'Failed to fetch categories');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category, subcategory?: SubCategory) => {
    if (subcategory) {
      setSelectedSubCategory(subcategory);
      setSelectedCategory(category || null);
      setFormData({
        name: subcategory.name,
        type: category?.type || 'expense',
        color: subcategory.color,
        parentCategoryId: category?._id || '',
      });
    } else if (category) {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        parentCategoryId: '',
      });
    } else {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const categoryData: FormData = {
        name: formData.name.trim(),
        type: formData.type,
        color: formData.color
      };

      console.log('Submitting category:', {
        isUpdate: !!selectedCategory,
        isSubcategory: !!formData.parentCategoryId,
        data: categoryData,
        selectedCategory,
        selectedSubCategory,
        parentCategoryId: formData.parentCategoryId
      });

      if (selectedSubCategory) {
        // Update subcategory
        await categoriesAPI.updateSubcategory(
          formData.parentCategoryId!,
          selectedSubCategory._id,
          { 
            name: categoryData.name,
            color: categoryData.color
          }
        );
        showNotification('success', 'Subcategory updated successfully');
      } else if (selectedCategory) {
        // Update category
        await categoriesAPI.update(selectedCategory._id, {
          name: categoryData.name,
          type: categoryData.type,
          color: categoryData.color
        });
        showNotification('success', 'Category updated successfully');
      } else if (formData.parentCategoryId) {
        // Create subcategory
        await categoriesAPI.createSubcategory(
          formData.parentCategoryId,
          { 
            name: categoryData.name,
            color: categoryData.color
          }
        );
        showNotification('success', 'Subcategory created successfully');
      } else {
        // Create new category
        await categoriesAPI.create({
          name: categoryData.name,
          type: categoryData.type,
          color: categoryData.color
        });
        showNotification('success', 'Category created successfully');
      }
      
      handleCloseDialog();
      await fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      if (error.response?.status === 404) {
        setError('The specified category or endpoint was not found. Please check your connection.');
      } else if (error.response?.status === 400) {
        setError(error.response.data?.message || 'Invalid category data');
      } else {
        setError('Failed to save category. Please try again.');
      }
    }
  };

  const handleDelete = async (categoryId: string, subcategoryId?: string) => {
    const itemType = subcategoryId ? 'subcategory' : 'category';
    const message = `Are you sure you want to delete this ${itemType}? This action cannot be undone and will affect any transactions using this ${itemType}.`;
    
    if (window.confirm(message)) {
      try {
        if (subcategoryId) {
          await categoriesAPI.deleteSubcategory(categoryId, subcategoryId);
          showNotification('success', 'Subcategory deleted successfully');
        } else {
          await categoriesAPI.delete(categoryId);
          showNotification('success', 'Category deleted successfully');
        }
        fetchCategories();
      } catch (error: any) {
        console.error(`Error deleting ${itemType}:`, error);
        if (error.response?.status === 409) {
          showNotification('error', `This ${itemType} is being used by some transactions and cannot be deleted.`);
        } else {
          showNotification('error', `Failed to delete ${itemType}. Please try again.`);
        }
      }
    }
  };

  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Categories</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CreateDefaultCategories onSuccess={fetchCategories} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} key={category._id}>
            <Card sx={{ p: 2 }}>
              <List component="nav" disablePadding>
                <ListItem
                  button
                  onClick={() => handleToggleCategory(category._id)}
                  sx={{
                    borderLeft: 6,
                    borderColor: category.color,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <CategoryIcon sx={{ mr: 2, color: category.color }} />
                  <ListItemText
                    primary={category.name}
                    secondary={`${category.type} • ${
                      category.subcategories?.length || 0
                    } subcategories`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(category);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({
                          ...prev,
                          parentCategoryId: category._id,
                          type: category.type,
                        }));
                        handleOpenDialog();
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                    {category.subcategories?.length ? (
                      expandedCategories.includes(category._id) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : null}
                  </ListItemSecondaryAction>
                </ListItem>
                
                {category.subcategories?.length ? (
                  <Collapse in={expandedCategories.includes(category._id)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {category.subcategories.map((subcategory) => (
                        <ListItem
                          key={subcategory._id}
                          sx={{
                            pl: 4,
                            borderLeft: 6,
                            borderColor: 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <SubdirectoryArrowRightIcon sx={{ mr: 2, color: subcategory.color }} />
                          <ListItemText primary={subcategory.name} />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleOpenDialog(category, subcategory)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => handleDelete(category._id, subcategory._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                ) : null}
              </List>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSubCategory
            ? 'Edit Subcategory'
            : selectedCategory
            ? 'Edit Category'
            : formData.parentCategoryId
            ? 'Add Subcategory'
            : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!error}
              helperText={error}
              sx={{ mb: 2 }}
              autoFocus
            />
            
            {!formData.parentCategoryId && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange as (event: SelectChangeEvent<'income' | 'expense'>) => void}
                >
                  {categoryTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color-label"
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange as (event: SelectChangeEvent<string>) => void}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: selected,
                        mr: 1,
                      }}
                    />
                    {colors.find(c => c.value === selected)?.label}
                  </Box>
                )}
              >
                {colors.map((color) => (
                  <MenuItem key={color.value} value={color.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: color.value,
                          mr: 1,
                        }}
                      />
                      {color.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedCategory || selectedSubCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
