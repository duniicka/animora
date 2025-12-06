const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });
          let isNewUser = false;

          if (user) {
            // User exists, return user
            return done(null, { user, isNewUser: false });
          }

          // Create new user with temporary username
          user = await User.create({
            username: 'temp_' + profile.id.slice(0, 10), // Temporary username
            name: profile.displayName,
            email: profile.emails[0].value,
            password: 'google_oauth_' + profile.id, // Placeholder password
            role: 'client', // Default role, will be updated
            isVerified: true, // Google accounts are pre-verified
            profileImage: profile.photos[0]?.value || '',
          });

          isNewUser = true;
          done(null, { user, isNewUser });
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth configured');
} else {
  console.warn('⚠️  Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not found in .env');
}

module.exports = passport;
