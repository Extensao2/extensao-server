export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const optionalAuth = (req, res, next) => {
  // This middleware allows both authenticated and unauthenticated requests
  next();
};