const express = require('express');
const {requireAuth}=require("../middleware/authMiddleware");
const { registerJwt, loginJwt, getProfileJwt, logoutJwt } = require('../controllers/authController');

const router = express.Router();

router.post("/login-jwt",loginJwt);
router.post("/register-jwt", registerJwt);
router.get("/profile-jwt", requireAuth, getProfileJwt);
router.post("/logout-jwt", requireAuth, logoutJwt);

module.exports = router;