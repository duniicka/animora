const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-code', authController.resendVerificationCode);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.post('/complete-google-profile', authMiddleware, authController.completeGoogleProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.delete('/delete-account', authMiddleware, authController.deleteAccount);

module.exports = router;
