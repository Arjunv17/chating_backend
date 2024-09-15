const express = require('express');
const router = express.Router();
const { sentMessage, getMessage } = require('../controllers/message');
const authentication = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// Message Routes
router.post('/sent_message', upload.array('attachments'), authentication, sentMessage);
router.get('/get_message', authentication, getMessage);

module.exports = router;
