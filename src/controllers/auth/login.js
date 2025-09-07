export const login = (req, res) => {
  res.status(400).json({
    error: 'Traditional login disabled. Please use Google OAuth.',
    oauth_url: '/api/v1/auth/google'
  });
};