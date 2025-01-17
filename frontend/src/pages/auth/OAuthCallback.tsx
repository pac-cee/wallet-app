import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

const OAuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const provider = location.pathname.split('/')[2]; // Get provider from URL path

        if (!code) {
          throw new Error('No authorization code received');
        }

        let response;
        switch (provider) {
          case 'google':
            response = await authAPI.handleGoogleCallback(code);
            break;
          case 'github':
            response = await authAPI.handleGithubCallback(code);
            break;
          case 'twitter':
            response = await authAPI.handleTwitterCallback(code);
            break;
          default:
            throw new Error('Unknown provider');
        }

        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        navigate('/dashboard', { replace: true });
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate, setUser]);

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body1">
        Completing authentication...
      </Typography>
    </Box>
  );
};

export default OAuthCallback;
