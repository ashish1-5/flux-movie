const express  = require('express');
const User     = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/* all admin routes require login + admin role */
router.use(protect, adminOnly);

/* ── GET /api/admin/users ── */
router.get('/users', async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? { $or: [
          { name:  { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ] }
      : {};
    const users = await User.find(filter).select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── DELETE /api/admin/users/:id  — remove a user ── */
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You can't delete yourself" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await AuditLog.create({
      msg: `Admin deleted user: ${user.email}`,
      severity: 'danger',
      icon: '🗑️',
    });

    res.json({ success: true, message: `Removed ${user.name}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PATCH /api/admin/users/:id/promote  — make user admin ── */
router.patch('/users/:id/promote', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await AuditLog.create({
      msg: `Admin promoted ${user.email} to admin`,
      severity: 'warn',
      icon: '👑',
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/admin/logs ── */
router.get('/logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/admin/stats ── */
router.get('/stats', async (req, res) => {
  try {
    const total  = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const logs   = await AuditLog.countDocuments();
    res.json({ success: true, stats: { total, admins, regular: total - admins, logs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
