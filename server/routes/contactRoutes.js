const express = require('express');
const contactController = require('../controller/contactController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.put('/', contactController.addContact);

module.exports = router;