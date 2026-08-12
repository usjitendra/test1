const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');
router.get('/messages', authMiddleware, getMessages);
module.exports = router;
