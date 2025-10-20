

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Please log in to access this resource',
    });
  }

  next();
};

module.exports = { requireAuth };