const express = require('express');
const router = express.Router();

// Import your individual route files
const userRoutes = require('./user');
const messageRoutes = require('./message');
const conversationRoutes = require('./conversations');
const contactRoutes = require('./contacts');

// Use the user routes under the `/user` endpoint
router.use('/user', userRoutes);

// Use the message routes under the `/message` endpoint
router.use('/message', messageRoutes);

// Use the conversation routes under the `/conversation` endpoint
router.use('/conversation', conversationRoutes);

// Use the contact routes under the `/contact` endpoint
router.use('/contact', contactRoutes);


module.exports = router; // Export the combined router
