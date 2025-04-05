// server/routes/consultations.js

const express = require('express');
const router = express.Router();

// Dummy GET route
router.get('/', (req, res) => {
  res.send('Consultations API is working!');
});

module.exports = router;
