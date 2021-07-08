const express = require('express');

const router = express.Router();

const etcController = require('../controllers/etc');

router.use('/', etcController.get404);

module.exports = router;
