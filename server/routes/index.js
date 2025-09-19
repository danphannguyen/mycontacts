const express = require('express');
const userRoutes = require('./userRoutes');
const contactRoutes = require('./contactRoutes');

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/contact', contactRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;