const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = require("../models/user.model");
const responseHandler = require("../utils/responseHandler.utils");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return responseHandler.errorResponse(
        res,
        401,
        "Authorization header with Bearer token required"
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token?.trim()) {
      return responseHandler.errorResponse(res, 401, "Invalid token format");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_of_length_at_least_32_characters");
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return responseHandler.errorResponse(
          res,
          401,
          "Session expired - please login again"
        );
      }
      return responseHandler.errorResponse(res, 401, "Invalid or expired token");
    }

    if (!decoded?.id || !decoded?.user_type) {
      return responseHandler.errorResponse(res, 401, "Invalid token payload");
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return responseHandler.errorResponse(res, 401, "Invalid user identifier");
    }

    const user = await UserModel.findOne({
      _id: decoded.id,
      is_delete: false,
    }).select("_id email full_name user_type is_active").lean();

    if (!user || !user.is_active) {
      return responseHandler.errorResponse(
        res,
        401,
        "User not found or inactive"
      );
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      user_type: user.user_type,
    };

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);
    return responseHandler.errorResponse(
      res,
      500,
      "Internal authentication error"
    );
  }
};

module.exports = authMiddleware;
