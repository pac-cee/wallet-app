import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, CircularProgress, Box, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const provider = params.get('provider');

      if (!code || !provider) {
        setError('Invalid callback parameters');
        return;
      }

      try {
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
            setError('Unsupported provider');
            return;
        }

        if (response.data?.user) {
          auth.login(response.data.user);
          navigate('/dashboard');
        } else {
          setError('Failed to authenticate');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, [location, navigate, auth]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default OAuthCallback;
