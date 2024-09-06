const express = require('express');
const router = express.Router();
const  upload  = require('../middlewares/multer')
const { saveUser , login,getalluser } = require('../controllers/user');
const authentication = require('../middlewares/auth');

// User Routes
router.post('/save', upload.single('profile_image'), saveUser);
router.post('/login', login);
router.get('/getalluser', authentication, getalluser);

module.exports = router; // Corrected export
