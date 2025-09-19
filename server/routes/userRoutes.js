const express = require('express');
const userController = require('../controller/userController');
// const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.register);

module.exports = router;