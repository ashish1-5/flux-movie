require('dotenv').config();
console.log('URI:', process.env.MONGO_URI);
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');

const authRoutes     = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes    = require('./routes/admin');

const app = express();

/* ── middleware ── */
app.use(cors({
  origin: '*',         // in production, set to your frontend URL
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

/* ── routes ── */
app.use('/api/auth',     authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin',    adminRoutes);

/* ── health check ── */
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

/* ── 404 handler ── */
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* ── error handler ── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

/* ── tmdb proxy ── */
const TMDB_KEY = '429e28badca0bf190c93d31df32dcf4b';
const TMDB_BASE = 'https://api.themoviedb.org/3';

app.get('/api/tmdb/*', async (req, res) => {
  try {
    const tmdbPath = req.params[0];
    const query = new URLSearchParams(req.query);
    query.set('api_key', TMDB_KEY);
    const url = `${TMDB_BASE}/${tmdbPath}?${query.toString()}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ message: 'TMDB proxy error', error: err.message });
  }
});

/* ── start ── */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Flux Movie Backend running on http://localhost:${PORT}`);
  });
});
