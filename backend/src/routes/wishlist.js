const express = require('express');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/* ── GET /api/wishlist  — get current user's wishlist ── */
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /api/wishlist  — add a movie ── */
router.post('/', protect, async (req, res) => {
  try {
    const { imdbID, Title, Year, Poster, imdbRating, Genre, Type } = req.body;
    if (!imdbID) return res.status(400).json({ success: false, message: 'imdbID required' });

    const user = await User.findById(req.user._id);
    const already = user.wishlist.some(m => m.imdbID === imdbID);
    if (already) return res.status(409).json({ success: false, message: 'Already in wishlist' });

    user.wishlist.unshift({ imdbID, Title, Year, Poster, imdbRating, Genre, Type });
    await user.save();

    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── DELETE /api/wishlist/:imdbID  — remove a movie ── */
router.delete('/:imdbID', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(m => m.imdbID !== req.params.imdbID);
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
