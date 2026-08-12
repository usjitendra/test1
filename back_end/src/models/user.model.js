const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_type: {
      type: String,
      enum: ["super_admin", "admin", "employee"],
      default: "employee",
    },
    phone: { type: String, default: "" },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Number,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("users", userSchema);
