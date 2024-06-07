const { User } = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;

    // Validate input data
    if (!name || !email || !password) {
      return next(new ApiError("Name, email, and password are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError("User already exists", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pic,
    });
    await newUser.save();

    res.status(201).json({
      message: "Account created successfully. Proceed to login.",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError("Incorrect email or password", 401));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ApiError("Incorrect email or password", 401));
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
        },
      });
  } catch (error) {
    next(error);
  }
};

exports.getIdUserFromToken = (token) => {
  if (!token) {
    return next(new ApiError("Token not found", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded.id;
};

exports.getLoggedUser = async (req, res, next) => {
  try {
    const id = req?.user;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
