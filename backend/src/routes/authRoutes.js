const express = require('express');

const router = express.Router();


router.post('/register-session', registerSession);
router.post('/login-session', loginSession);
router.get('/profile-session', requireAuth, getProfileSession);
router.post('/logout-session', requireAuth, logoutSession);
