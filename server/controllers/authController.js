const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { generateVerificationCode, sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, name, username, role, phone, address } = req.body;

    // Validation
    if (!email || !password || !name || !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email, password, name, and username' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists with this email' 
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username is already taken' 
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      role: role || 'client',
      phone,
      address,
      isVerified: false,
      verificationCode,
      verificationCodeExpires
    });

    // Send verification email (optional - won't fail if email not configured)
    try {
      const emailResult = await sendVerificationEmail(email, verificationCode, name);
      if (!emailResult.success) {
        console.warn('Failed to send verification email:', emailResult.error);
      }
    } catch (emailError) {
      console.warn('Email service not configured or failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      userId: newUser._id,
      email: newUser.email,
      requiresVerification: true,
      // For development: show code in response if email fails
      ...(process.env.NODE_ENV === 'development' && { devCode: verificationCode })
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during registration' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email/username and password' 
      });
    }

    // Find user by email OR username (include password for comparison)
    const user = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: email }] 
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if email is verified (optional - can be disabled for testing)
    // if (!user.isVerified) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Please verify your email before logging in'
    //   });
    // }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// Verify email with code
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and verification code'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Verify user
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};

// Resend verification code
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode, user.name);

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Complete Google OAuth profile (username + role)
exports.completeGoogleProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and role'
      });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { username, role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🗑️ Attempting to delete user:', userId);

    // Find and delete user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User deleted successfully:', user.email);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deletion'
    });
  }
};

// Forgot password - send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not (security)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save token and expiry to user (not hashed for simplicity)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    console.log('Generated reset token:', resetToken);
    console.log('Token expires at:', user.resetPasswordExpires);

    // Send email
    try {
      const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);
      console.log('Password reset email result:', emailResult);
      
      // For development: show reset link in console
      if (process.env.NODE_ENV === 'development') {
        console.log('🔗 Password Reset Link:', `http://localhost:5173/auth/reset-password/${resetToken}`);
      }
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
      // For development: include reset link
      ...(process.env.NODE_ENV === 'development' && { devResetLink: `http://localhost:5173/auth/reset-password/${resetToken}` })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log('Reset password attempt with token:', token);

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Find user with valid token (direct comparison, not hashed)
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      // Check if token exists at all
      const userWithToken = await User.findOne({ resetPasswordToken: token });
      console.log('User with this token exists:', userWithToken ? 'Yes' : 'No');
      
      if (userWithToken) {
        console.log('Token expires at:', userWithToken.resetPasswordExpires);
        console.log('Current time:', new Date());
        console.log('Token expired:', new Date() > userWithToken.resetPasswordExpires);
      }
      
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    console.log('Token is valid, proceeding with password reset');

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// Change password (for logged-in users)
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has a password (not Google OAuth user)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for Google OAuth accounts'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log('Password changed successfully for user:', user.email);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};
