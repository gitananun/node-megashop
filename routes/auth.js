const express = require('express');

const router = express.Router();

const authValidations = require('../middleware/validations/auth');

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', authValidations.login, authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', authValidations.signup, authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPasssword);

module.exports = router;
