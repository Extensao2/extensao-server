export const getMe = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    avatar: req.user.avatar,
    provider: req.user.provider
  });
};

export const status = (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user ? {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar
    } : null
  });
};