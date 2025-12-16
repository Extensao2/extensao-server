import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/auth/google', (req, res, next) => {
  const rawRedirectTo = req.query.redirectTo;
  const redirectTo = Array.isArray(rawRedirectTo) ? rawRedirectTo[0] : rawRedirectTo;

  let validatedRedirect = '';
  if (typeof redirectTo === 'string') {
    validatedRedirect = redirectTo;
  }

  const state = validatedRedirect
    ? Buffer.from(validatedRedirect).toString('base64')
    : '';

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  })(req, res, next);
});

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Recupera o redirectTo do state parameter
    const state = req.query.state;
    let finalUrl = process.env.OAUTH_SUCCESS_REDIRECT_URL || '/default';

    if (state) {
      try {
        const decoded = Buffer.from(state, 'base64').toString('utf-8');
        // Valida se o resultado é um path relativo seguro (não permite URLs externas)
        if (decoded) {
          finalUrl = decoded;
        }
      } catch (err) {
        console.error('Error decoding state:', err);
      }
    }

    res.redirect(finalUrl);
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
