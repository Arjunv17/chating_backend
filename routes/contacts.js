const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const { save , getverify_contacts} = require('../controllers/contacts');
const authentication = require('../middlewares/auth');

// Contacts Routes
router.post('/save', authentication, save);
router.get('/getverify_contacts', authentication, getverify_contacts);

module.exports = router; // Corrected export
