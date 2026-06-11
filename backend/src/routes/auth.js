const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

const router = express.Router();

/* helper — sign and return a JWT */
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/* ── POST /api/auth/signup ── */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Account already exists. Sign in instead.' });
    }

    /* first-ever user becomes admin */
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);

    await AuditLog.create({
      msg: `New user registered: ${email}${role === 'admin' ? ' [ADMIN]' : ''}`,
      severity: role === 'admin' ? 'warn' : 'info',
      icon: role === 'admin' ? '👑' : '✅',
    });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, joined: user.joined },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /api/auth/login ── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found. Sign up first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const token = signToken(user._id);

    await AuditLog.create({
      msg: `User signed in: ${email}`,
      severity: 'info',
      icon: '🔑',
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, joined: user.joined },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/auth/me  (protected) ── */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, joined: user.joined },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /api/auth/logout  (protected) ── */
router.post('/logout', protect, async (req, res) => {
  try {
    await AuditLog.create({
      msg: `User signed out: ${req.user.email}`,
      severity: 'info',
      icon: '🚪',
    });
    /* JWT is stateless — client simply discards the token */
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
