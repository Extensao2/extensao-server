export const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: 'Could not log out' });

    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: 'Could not destroy session' });

      res.clearCookie('session_id');
      res.status(200).json({ message: 'Logout successful' });
    });
  });
};