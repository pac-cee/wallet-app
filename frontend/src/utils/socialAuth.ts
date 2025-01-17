const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

export const getSocialLoginUrl = (provider: 'google' | 'github' | 'twitter'): string => {
  const redirectUri = `${window.location.origin}/auth/${provider}/callback`;
  
  switch (provider) {
    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=email profile` +
        `&access_type=offline` +
        `&prompt=consent`;
    
    case 'github':
      return `https://github.com/login/oauth/authorize?` +
        `client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=user:email`;
    
    case 'twitter':
      return `https://twitter.com/i/oauth2/authorize?` +
        `client_id=${process.env.REACT_APP_TWITTER_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=tweet.read users.read`;
    
    default:
      throw new Error('Invalid provider');
  }
};
