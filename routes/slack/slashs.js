const express = require('express');
const router = express.Router();

const slashsController = require('../../controllers/slack/slashs');
router.post('/', slashsController.handleSlashs);

module.exports = router;