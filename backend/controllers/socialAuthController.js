const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper function to get user info from social profile
const createUserFromSocialProfile = async (profile, provider) => {
  const email = profile.email;
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user if doesn't exist
    user = await User.create({
      name: profile.name,
      email: profile.email,
      password: jwt.sign({ date: Date.now() }, process.env.JWT_SECRET), // Generate random secure password
      provider,
      providerId: profile.id,
    });
  }

  return user;
};

// @desc    Handle Google OAuth callback
// @route   POST /api/auth/google/callback
// @access  Public
const handleGoogleCallback = asyncHandler(async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.FRONTEND_URL}/auth/google/callback`,
      grant_type: 'authorization_code',
    });

    // Get user profile
    const { access_token } = tokenResponse.data;
    const profileResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const profile = {
      id: profileResponse.data.sub,
      name: profileResponse.data.name,
      email: profileResponse.data.email,
    };

    // Create or get user
    const user = await createUserFromSocialProfile(profile, 'google');
    
    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401);
    throw new Error('Invalid authorization code');
  }
});

// @desc    Handle GitHub OAuth callback
// @route   POST /api/auth/github/callback
// @access  Public
const handleGithubCallback = asyncHandler(async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.FRONTEND_URL}/auth/github/callback`,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    // Get user profile
    const { access_token } = tokenResponse.data;
    const profileResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    // Get user email (GitHub might not provide email in profile)
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const primaryEmail = emailResponse.data.find(email => email.primary)?.email;

    const profile = {
      id: profileResponse.data.id.toString(),
      name: profileResponse.data.name || profileResponse.data.login,
      email: primaryEmail,
    };

    // Create or get user
    const user = await createUserFromSocialProfile(profile, 'github');
    
    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(401);
    throw new Error('Invalid authorization code');
  }
});

// @desc    Handle Twitter OAuth callback
// @route   POST /api/auth/twitter/callback
// @access  Public
const handleTwitterCallback = asyncHandler(async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: `${process.env.FRONTEND_URL}/auth/twitter/callback`,
        code_verifier: 'challenge',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    // Get user profile
    const { access_token } = tokenResponse.data;
    const profileResponse = await axios.get(
      'https://api.twitter.com/2/users/me',
      {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
          'user.fields': 'name,username,email',
        },
      }
    );

    const profile = {
      id: profileResponse.data.data.id,
      name: profileResponse.data.data.name,
      email: profileResponse.data.data.email || `${profileResponse.data.data.username}@twitter.com`,
    };

    // Create or get user
    const user = await createUserFromSocialProfile(profile, 'twitter');
    
    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Twitter auth error:', error);
    res.status(401);
    throw new Error('Invalid authorization code');
  }
});

module.exports = {
  handleGoogleCallback,
  handleGithubCallback,
  handleTwitterCallback,
};
