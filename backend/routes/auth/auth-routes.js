const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  editProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Authentication routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user
router.post("/logout", logoutUser); // Logout user
router.put("/edit-profile", authMiddleware, editProfile); // Edit user profile
router.put("/change-password", authMiddleware, changePassword); // Change user password
router.post("/forgot-password", forgotPassword); // Send OTP for password reset
router.post("/reset-password", resetPassword); // Reset password using OTP

// Check authentication status
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
