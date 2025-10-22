const express = require('express');
const sessionConfig = require('./auth-strategies/session/config/session');
const sessionRoutes = require('./auth-strategies/session/routes/authRoutes');
const jwtRoutes = require('./auth-strategies/jwt-simple/routes/authRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
// Configure CORS to allow credentials and specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// This middleware parses cookies
app.use(cookieParser());

// This middleware does the body parsing
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// This middleware handles the session
app.use(sessionConfig);
// Routes
app.use('/auth', sessionRoutes,jwtRoutes);


// 404 handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;