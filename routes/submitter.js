const express = require('express');
const router = express.Router();

// get gui
router.get('/', (req, res, next) => {
  res.render('maze');
});

module.exports = router;
