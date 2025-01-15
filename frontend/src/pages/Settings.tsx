import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  Button,
  MenuItem,
  Menu,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  CurrencyExchange as CurrencyIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const Settings: React.FC = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    theme: 'light',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!profileData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Call your API to update profile
      // await userAPI.updateProfile(profileData);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword) {
      setError('Current password is required');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumbers = /\d/.test(passwordData.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setError('Password must contain uppercase, lowercase, numbers, and special characters');
      setLoading(false);
      return;
    }

    try {
      // Call your API to update password
      // await userAPI.updatePassword(passwordData);
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async (key: string, value: string) => {
    try {
      setPreferences(prev => ({ ...prev, [key]: value }));
      // Call your API to update preferences
      // await userAPI.updatePreferences({ [key]: value });
    } catch (err: any) {
      console.error('Failed to update preferences:', err);
    }
  };

  const handleNotificationToggle = async (key: string, value: boolean) => {
    try {
      switch (key) {
        case 'push':
          setNotifications(value);
          break;
        case 'email':
          setEmailNotifications(value);
          break;
        case 'budget':
          setBudgetAlerts(value);
          break;
      }
      // Call your API to update notification settings
      // await userAPI.updateNotifications({ [key]: value });
    } catch (err: any) {
      console.error('Failed to update notifications:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Profile Settings */}
        <Box sx={{ flex: 1 }}>
          <MotionCard
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{ mb: 3, p: 3 }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Profile Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                E
              </Avatar>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{ position: 'relative', top: -30, right: -30 }}
              >
                <input hidden accept="image/*" type="file" />
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                fullWidth
              />
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileUpdate}
            >
              Save Changes
            </Button>
          </MotionCard>

          {/* Security Settings */}
          <MotionCard
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            sx={{ mb: 3, p: 3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Security Settings</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                fullWidth
              />
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePasswordUpdate}
            >
              Update Password
            </Button>
          </MotionCard>
        </Box>

        {/* Preferences and Notifications */}
        <Box sx={{ flex: 1 }}>
          {/* Notifications */}
          <MotionCard
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            sx={{ mb: 3 }}
          >
            <List>
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Notifications</Typography>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive notifications about your transactions"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={notifications}
                    onChange={(e) => handleNotificationToggle('push', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive email updates about your account"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailNotifications}
                    onChange={(e) => handleNotificationToggle('email', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Budget Alerts"
                  secondary="Get notified when you exceed your budget"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={budgetAlerts}
                    onChange={(e) => handleNotificationToggle('budget', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </MotionCard>

          {/* Preferences */}
          <MotionCard
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            sx={{ mb: 3 }}
          >
            <List>
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LanguageIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Preferences</Typography>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <TextField
                  select
                  label="Language"
                  value={preferences.language}
                  onChange={(e) => handlePreferencesUpdate('language', e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </TextField>
              </ListItem>
              <ListItem>
                <TextField
                  select
                  label="Currency"
                  value={preferences.currency}
                  onChange={(e) => handlePreferencesUpdate('currency', e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                </TextField>
              </ListItem>
              <ListItem>
                <TextField
                  select
                  label="Theme"
                  value={preferences.theme}
                  onChange={(e) => handlePreferencesUpdate('theme', e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </TextField>
              </ListItem>
            </List>
          </MotionCard>

          {/* Backup & Sync */}
          <MotionCard
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <List>
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BackupIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Backup & Sync</Typography>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Auto Backup"
                  secondary="Automatically backup your data daily"
                />
                <ListItemSecondaryAction>
                  <Switch edge="end" defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Cloud Sync"
                  secondary="Sync your data across devices"
                />
                <ListItemSecondaryAction>
                  <Switch edge="end" defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <Button
                  variant="outlined"
                  startIcon={<BackupIcon />}
                  fullWidth
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Backup Now
                </Button>
              </ListItem>
            </List>
          </MotionCard>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
