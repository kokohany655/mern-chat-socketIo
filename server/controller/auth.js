const { User } = require("../models/UserModel");
const ApiError = require("../utils/ApiError");
const APiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(new APiError("this user is already exist", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      pic,
      password: hashPassword,
    };

    const user = new User(payload);

    await user.save();

    res.status(201).json({
      message: "created account successfully go to login",
      data: user,
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return next(new APiError("Incorrect email or password", 400));
    }

    // Check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return next(new APiError("Incorrect email or password", 400));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // Send response
    res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .json({
        message: "Login Successfully",
        data: user,
        token,
      });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};

exports.getLoggedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new ApiError("Token expired", 400));
    }

    // Assuming token is in the format "Bearer <token>"

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { httpOnly: true, secure: true }).status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};
