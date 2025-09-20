const express = require('express');
const contactController = require('../controller/contactController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', contactController.createContact);
router.get('/', contactController.getContact);
router.patch('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;