const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { jwtSecret } = require('./config');
const { User } = require('./models');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Insufficient permissions' });
  next();
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  next();
};

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });
const findUser = (id) => User.findById(id).select('-passwordHash');

module.exports = { auth, requireRole, validate, safeUser, findUser };
