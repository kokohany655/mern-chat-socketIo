const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return next(new ApiError("Token is Expired Login Again", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (req.params.id) {
    if (req.params.id !== decoded.id) {
      return next( new ApiError("You are not have access to do this action", 403));
    }
  }

  if(!decoded){
    return next(new ApiError("invalid token", 400));
    
  }
  req.user = decoded.id;
  next();
};
