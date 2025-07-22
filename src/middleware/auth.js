export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  }
  next();
};

export const optionalAuth = (req, res, next) => {
  // This middleware allows both authenticated and unauthenticated requests
  next();
};