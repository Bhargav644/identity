const authService = require('../services/authService');
const {  validateLoginData, validateRegisterData } = require('../utils/validators');

const registerSession = async (req, res, next) => {
    try {
        const validation = validateRegisterData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.errors,
            });
        }
        const user = await authService.registerUser(req.body);
        req.session.userId = user.id;
        res.status(201).json({
            message: 'Registration successful',
            user,
        });
    }
    catch (error) {
        next(error);
    }
}


const loginSession = async (req, res, next) => {
    try {
        const validation = validateLoginData(req.body);
        if (!validation.isValid) {
          return res.status(400).json({
            error: 'Validation failed',
            details: validation.errors,
          });
        }
    
        const { email, password } = req.body;
        const user = await authService.validateUser(email, password);
        req.session.regenerate((err) => {
        if (err) return next(err);
            req.session.userId = user.id;
            res.status(200).json({
                message: 'Login successful',
                user,
            });
        });
    }
    catch (error) {
        next(error);
    }
}


const getProfileSession = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const user = await authService.getUserById(userId);

    res.status(200).json({
      user,
      session: {
        id: req.session.id,
        expiresAt: req.session.cookie.expires,
      },
    });
  } catch (error) {
    next(error);
  }
};


const logoutSession = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) next(error);
        // keep in mind that this cookie was created by express-session middleware automatically
        res.clearCookie(process.env.SESSION_NAME || 'sessionId');
        res.status(200).json({ message: 'Logout successful' });
    })
}

module.exports = {
    registerSession,
    loginSession,
    getProfileSession,
    logoutSession,
};