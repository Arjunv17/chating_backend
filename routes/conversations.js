const express = require('express');
const router = express.Router();
const  upload  = require('../middlewares/multer')
const { save } = require('../controllers/conversations');
const authentication = require('../middlewares/auth');

// Conversations Routes
router.post('/save',authentication, save);

module.exports = router; // Corrected export
