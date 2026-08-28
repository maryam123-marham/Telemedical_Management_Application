const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { User } = require('../models');
const { auth, validate, safeUser, findUser } = require('../middleware');
const { jwtSecret, adminInviteCode } = require('../config');

const credentials = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  ...credentials
], validate, async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email is already registered' });
  const role = adminInviteCode && req.body.inviteCode === adminInviteCode ? 'admin' : 'staff';
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role });
  const token = jwt.sign({ id: user._id.toString(), role: user.role, name: user.name }, jwtSecret, { expiresIn: '8h' });
  res.status(201).json({ token, user: safeUser(user) });
});

router.post('/login', credentials, validate, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user._id.toString(), role: user.role, name: user.name }, jwtSecret, { expiresIn: '8h' });
  res.json({ token, user: safeUser(user) });
});

router.get('/me', auth, async (req, res) => {
  const user = await findUser(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});
module.exports = router;
