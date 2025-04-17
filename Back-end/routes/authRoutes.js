const express = require('express');
const authController = require('../controllers/authControllers');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);

router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;