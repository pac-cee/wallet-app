const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

export const getSocialLoginUrl = (provider: 'google' | 'github' | 'apple'): string => {
  const baseUrl = `${API_URL}/users/auth`;
  
  switch (provider) {
    case 'google':
      return `${baseUrl}/google`;
    case 'github':
      return `${baseUrl}/github`;
    case 'apple':
      return `${baseUrl}/apple`;
    default:
      throw new Error('Invalid provider');
  }
};
