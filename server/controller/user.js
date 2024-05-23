const { User } = require("../models/UserModel");
const ApiError = require("../utils/ApiError");

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({
      message: "success",
      result: user.length,
      data: user,
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError("this user not found", 404));
    }

    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return next(new ApiError("this user is already exist", 400));
    }

    const createUser = new User(req.body);

    await createUser.save();

    res.status(201).json({
      message: "Created Successfully",
      data: createUser,
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError("this user not found", 404));
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "success",
      data: updateUser,
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError("this user not found", 404));
    }
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "deleted successfully",
    });
  } catch (error) {
    return next(new ApiError(`${error.message}`, 400));
  }
};
