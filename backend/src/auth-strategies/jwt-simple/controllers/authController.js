const authService = require("../../../services/authService");
const jwt = require("jsonwebtoken");
const {
  validateLoginData,
  validateRegisterData,
} = require("../../../utils/validators");
const cookieConfig = require("../../../config/cookie");

const registerJwt = async (req, res, next) => {
  try {
    const validation = validateRegisterData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }
    const { email, password, name } = req.body;
    const user = await authService.registerUser({ email, password, name });
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { ...cookieConfig });
    res.status(200).json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const loginJwt = async (req, res, next) => {
  try {
    const validation = validateLoginData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { ...cookieConfig });
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getProfileJwt = async (req, res, next) => {
  try {
    res.status(200).json({
      user:req.user,
    });
  } catch (error) {
    next(error);
  }
};

const logoutJwt = (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({ message: 'Logout successful' });
}

module.exports = { registerJwt, loginJwt,getProfileJwt,logoutJwt };
