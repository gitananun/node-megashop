const express = require('express');

const router = express.Router();

const etcController = require('../controllers/etc');

router.get('/500', etcController.get500);
router.use('/', etcController.get404);

module.exports = router;
