const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username must not exceed 30 characters"],
      trim: true, // Trim whitespace
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
      lowercase: true, // Store email in lowercase
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"], // Added role validation
      default: "user",
    },
    otp: {
      type: String,
      select: false, // Don't include OTP in queries by default
    },
    otpExpires: {
      type: Date,
      validate: {
        validator: function (v) {
          return v > Date.now(); // Ensure OTP expiry time is in the future
        },
        message: "OTP expiration time must be in the future",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
