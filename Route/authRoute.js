const express = require("express");
const router = express.Router();
const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  createCreatorProfile,
  updatePriorityFee,
  updateUsername,
  trackCreatorLinkClick,
  getCreatorDashboardStats,
  createWaitList
} = require("../controller/user");
const authMiddleware = require("../Middleware/auth");

// Auth routes
router.post("/signup", signup);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.post("/creator-profile", authMiddleware, createCreatorProfile);
router.put("/updatepriority-fee", authMiddleware, updatePriorityFee);
router.put("/update-username", authMiddleware, updateUsername);
router.post("/track-link-click/:username", trackCreatorLinkClick);
router.get("/creator-dashboard-stats", authMiddleware, getCreatorDashboardStats);
router.post("/create-waitlist", createWaitList);

 module.exports = router;