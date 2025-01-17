import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.verify();
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setUser(null);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      setUser(userData);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const response = await authAPI.loginWithGoogle();
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google login failed');
      return false;
    }
  };

  const loginWithGithub = async () => {
    try {
      setError(null);
      const response = await authAPI.loginWithGithub();
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (err) {
      console.error('GitHub login error:', err);
      setError(err.response?.data?.message || 'GitHub login failed');
      return false;
    }
  };

  const loginWithTwitter = async () => {
    try {
      setError(null);
      const response = await authAPI.loginWithTwitter();
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (err) {
      console.error('Twitter login error:', err);
      setError(err.response?.data?.message || 'Twitter login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authAPI.register({ name, email, password });
      const { token, ...userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      setUser(userData);
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithGithub,
    loginWithTwitter,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
