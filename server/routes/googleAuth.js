const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login', session: false }),
  (req, res) => {
    const { user, isNewUser } = req.user;

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token and isNewUser flag
    res.redirect(`http://localhost:5173/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user.toJSON()))}&isNewUser=${isNewUser}`);
  }
);

module.exports = router;
