const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.put('/register', userController.register);

router.post('/login', userController.login);

module.exports = router;