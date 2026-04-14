const express = require("express");
const router = express.Router();
const  multer = require("multer") ;

const storage = multer.memoryStorage();
const upload = multer({ storage });
const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateCreatorProfile,
  updateUsername,
  trackCreatorLinkClick,
  getCreatorDashboardStats,
  createWaitList,
  waitListCount,
  trackVisit,
  checkAvailableUsername,
   stepOne,
    stepTwo,
    completeOnboarding,
    resendVerificationEmail
} = require("../controller/user");
const authMiddleware = require("../Middleware/auth");

// Auth routes
router.post("/signup", signup);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.post("/onboarding-step-one", authMiddleware, stepOne);
router.post("/creator-profile", authMiddleware,upload.single("profilePic"), stepTwo);
router.post("/complete-onboarding", authMiddleware, completeOnboarding);
router.put("/update-creator-profile", authMiddleware,   upload.single("profilePic"), updateCreatorProfile);
router.put("/update-username", authMiddleware, updateUsername);
router.post("/track-link-click/:username", trackCreatorLinkClick);
router.get("/creator-dashboard-stats", authMiddleware, getCreatorDashboardStats);
router.post("/create-waitlist", createWaitList);
router.get("/waitlist-count", waitListCount);
router.post("/track-visit", trackVisit);
router.get("/check-username/:username", checkAvailableUsername);
router.post("/resend-verification", resendVerificationEmail);


 module.exports = router;