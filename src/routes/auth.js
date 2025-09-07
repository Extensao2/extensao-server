import express from 'express';
import { authController } from '../controllers/auth/index.js';
import passport from '../config/passport.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
  (req, res) => res.redirect('https://extensaoads2.sj.ifsc.edu.br/api/v1/events')
);

// Traditional login (disabled)
router.post('/login', authController.login);

// Logout
router.post('/logout', requireAuth, authController.logout);

// Profile endpoints
router.get('/me', requireAuth, authController.getMe);
router.get('/status', authController.status);

export default router;