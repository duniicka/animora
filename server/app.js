const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');
const petRoutes = require('./routes/pets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'animora_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/pets', petRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = app;
