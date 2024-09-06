const express = require('express');
const router = express.Router();
const  upload  = require('../middlewares/multer')
const { sentMessage } = require('../controllers/message');
const authentication = require('../middlewares/auth');

// Message Routes
router.post('/sent_message', upload.array('attachments'),authentication, sentMessage);

module.exports = router; // Corrected export
