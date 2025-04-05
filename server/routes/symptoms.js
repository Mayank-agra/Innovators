// server/routes/symptoms.js
const express = require('express');
const router = express.Router();

// Example endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Symptoms API is working' });
});

module.exports = router;
