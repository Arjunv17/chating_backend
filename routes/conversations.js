const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const { save, getConversation } = require('../controllers/conversations');
const authentication = require('../middlewares/auth');

// Conversations Routes
router.post('/save', authentication, save);
router.get('/get_conversation', authentication, getConversation);

module.exports = router; // Corrected export
