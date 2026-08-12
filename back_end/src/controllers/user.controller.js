const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const responseHandler = require("../utils/responseHandler.utils");
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("Controller Error:", err.message);
    return responseHandler.errorResponse(
      res,
      err.status || 500,
      err.message || "Internal Server Error"
    );
  });
};
class UserController {
  constructor() {}
  loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return responseHandler.errorResponse(
        res,
        400,
        "Email and password are required"
      );
    }
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      is_delete: false,
    });
    if (!user) {
      return responseHandler.errorResponse(res, 400, "Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return responseHandler.errorResponse(res, 400, "Invalid credentials");
    }
    if (!user.is_active) {
      return responseHandler.errorResponse(
        res,
        403,
        "Account is inactive. Please contact admin!"
      );
    }
    const tokenSecret = process.env.JWT_SECRET || "super_secret_jwt_key_of_length_at_least_32_characters";
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, user_type: user.user_type, full_name: user.full_name },
      tokenSecret,
      { expiresIn: "1d" }
    );
    return responseHandler.successResponse(res, 200, "Login successful", {
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type,
        phone: user.phone,
      },
      accessToken,
    });
  });
  addUser = asyncHandler(async (req, res) => {
    const { full_name, email, phone, password, user_type = "employee" } = req.body;
    if (!full_name || !email) {
      return responseHandler.errorResponse(
        res,
        400,
        "Full name and email are required"
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return responseHandler.errorResponse(res, 400, "Invalid email format");
    }
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return responseHandler.errorResponse(
        res,
        409,
        "A user with this email already exists"
      );
    }
    const validRole = ["admin", "employee"].includes(user_type) ? user_type : "employee";
    const finalPassword = password || Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(finalPassword, salt);
    const newUser = await UserModel.create({
      full_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      user_type: validRole,
      phone: phone || "",
    });
    return responseHandler.successResponse(
      res,
      201,
      "User created successfully",
      {
        _id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        user_type: newUser.user_type,
        phone: newUser.phone,
      }
    );
  });
  getAllUserDetails = asyncHandler(async (req, res) => {
    let { status, user_type, search = "", page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const matchFilter = { is_delete: false, user_type: { $ne: "super_admin" } };
    if (status === "active") matchFilter.is_active = true;
    if (status === "inactive") matchFilter.is_active = false;
    if (user_type && ["admin", "employee"].includes(user_type)) {
      matchFilter.user_type = user_type;
    }
    if (search) {
      matchFilter.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    const [users, totalUsers, activeUsers, totalEmployees, totalAdmins] = await Promise.all([
      UserModel.find(matchFilter)
        .select("-password -otp -otpExpires -is_delete")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(matchFilter),
      UserModel.countDocuments({ ...matchFilter, is_active: true }),
      UserModel.countDocuments({ is_delete: false, user_type: "employee" }),
      UserModel.countDocuments({ is_delete: false, user_type: "admin" }),
    ]);
    return responseHandler.successResponse(
      res,
      200,
      "Users fetched successfully",
      {
        users,
        total_users: totalUsers,
        active_users: activeUsers,
        total_employees: totalEmployees,
        total_admins: totalAdmins,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1,
        },
      }
    );
  });
  updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { full_name, email, password, user_type, phone, is_active } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return responseHandler.errorResponse(res, 400, "Invalid user ID");
    }
    const user = await UserModel.findOne({ _id: userId, is_delete: false });
    if (!user) {
      return responseHandler.errorResponse(res, 404, "User not found");
    }
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await UserModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (emailExists) {
        return responseHandler.errorResponse(res, 409, "Email already exists");
      }
    }
    const updateData = {
      ...(full_name && { full_name }),
      ...(email && { email: email.toLowerCase() }),
      ...(user_type && ["admin", "employee"].includes(user_type) && { user_type }),
      ...(phone !== undefined && { phone }),
      ...(typeof is_active === "boolean" && { is_active }),
    };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -otp -otpExpires");
    return responseHandler.successResponse(
      res,
      200,
      "User updated successfully",
      updatedUser
    );
  });
  updateUserBySelf = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { full_name, email, password, phone } = req.body;
    const user = await UserModel.findOne({ _id: userId, is_delete: false });
    if (!user) {
      return responseHandler.errorResponse(res, 404, "User not found");
    }
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await UserModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (emailExists) {
        return responseHandler.errorResponse(res, 409, "Email already exists");
      }
    }
    const updateData = {
      ...(full_name && { full_name }),
      ...(email && { email: email.toLowerCase() }),
      ...(phone !== undefined && { phone }),
    };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -otp -otpExpires");
    return responseHandler.successResponse(
      res,
      200,
      "Profile updated successfully",
      updatedUser
    );
  });
  changePassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;
    if (!password) {
      return responseHandler.errorResponse(res, 400, "New password is required");
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return responseHandler.errorResponse(res, 404, "User not found");
    }
    const hashedNewPassword = await bcrypt.hash(password, 10);
    user.password = hashedNewPassword;
    await user.save();
    return responseHandler.successResponse(
      res,
      200,
      "Password changed successfully",
      null
    );
  });
  toggleUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return responseHandler.errorResponse(res, 400, "Invalid user ID");
    }
    const toggleResult = await UserModel.findByIdAndUpdate(
      userId,
      [{ $set: { is_active: { $not: "$is_active" } } }],
      { new: true }
    ).select("-password");
    if (!toggleResult) {
      return responseHandler.errorResponse(res, 404, "User not found");
    }
    return responseHandler.successResponse(
      res,
      200,
      "User status updated successfully",
      toggleResult
    );
  });
  toggleUserDeleteStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return responseHandler.errorResponse(res, 400, "Invalid user ID");
    }
    const toggleResult = await UserModel.findByIdAndUpdate(
      userId,
      [{ $set: { is_delete: { $not: "$is_delete" } } }],
      { new: true }
    ).select("-password");
    if (!toggleResult) {
      return responseHandler.errorResponse(res, 404, "User not found");
    }
    return responseHandler.successResponse(
      res,
      200,
      "User deleted successfully",
      toggleResult
    );
  });
}
module.exports = new UserController();
