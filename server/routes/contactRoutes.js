const express = require('express');
const contactController = require('../controller/contactController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', contactController.addContact);
router.get('/', contactController.retrieveContact);
router.patch('/:id', contactController.modifyContact);

module.exports = router;