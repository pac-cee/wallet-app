const express = require('express');
const router = express.Router();
const {
  handleGoogleCallback,
  handleGithubCallback,
  handleTwitterCallback,
} = require('../controllers/socialAuthController');

// OAuth callback routes
router.post('/google/callback', handleGoogleCallback);
router.post('/github/callback', handleGithubCallback);
router.post('/twitter/callback', handleTwitterCallback);

module.exports = router;
