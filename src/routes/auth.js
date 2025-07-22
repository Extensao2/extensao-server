import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth login
router.get('/auth/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login?error=oauth_failed' 
  }),
  (req, res) => {
    // Successful authentication
    res.redirect(process.env.NODE_ENV === 'production' 
      ? 'https://extensaoads2.sj.ifsc.edu.br/dashboard' 
      : 'http://localhost:3000/dashboard'
    );
  }
);

// Traditional login endpoint (for compatibility)
router.post('/login', (req, res) => {
  res.status(400).json({ 
    error: 'Traditional login disabled. Please use Google OAuth.',
    oauth_url: '/api/v1/auth/google'
  });
});

// Get current user info
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    avatar: req.user.avatar,
    provider: req.user.provider
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not destroy session' });
      }
      
      res.clearCookie('session_id');
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user ? {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar
    } : null
  });
});

export default router;