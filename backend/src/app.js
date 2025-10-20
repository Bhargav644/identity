const express = require('express');
const sessionConfig = require('./config/session');
const authRoutes = require('./routes/authRoutes');

const app = express();
// This middleware does the body parsing
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// This middleware handles the session
app.use(sessionConfig);
// Routes
app.use('/auth', authRoutes);


// 404 handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;