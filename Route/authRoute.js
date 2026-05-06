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
    resendVerificationEmail,
    getMe,
    updateBankDetails,
    getCreatorByUsername,
    deleteAccount,
    initialisePayment,
    verifyPayment
} = require("../controller/user");
const authMiddleware = require("../Middleware/auth");

// Auth routes
router.post("/signup", signup);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/change-password", authMiddleware, changePassword);
router.patch("/step-one", authMiddleware, stepOne);
router.patch("/step-two", authMiddleware,upload.single("profilePic"), stepTwo);
router.post("/complete-onboarding", authMiddleware, completeOnboarding);
router.patch("/update-creator-profile",authMiddleware,upload.single("profilePic"), updateCreatorProfile);
router.put("/update-username", authMiddleware, updateUsername);
router.get("/track-link-click/:username", trackCreatorLinkClick);
router.get("/creator-dashboard-stats", authMiddleware, getCreatorDashboardStats);
router.post("/create-waitlist", createWaitList);
router.get("/waitlist-count", waitListCount);
router.post("/track-visit", trackVisit);
router.get("/check-username/:username", checkAvailableUsername);
router.post("/resend-verification", resendVerificationEmail);
router.get("/me", authMiddleware, getMe);
router.patch("/update-bank-details", authMiddleware, updateBankDetails);
router.delete("/delete-account", authMiddleware, deleteAccount);
router.get("/creator/:username", getCreatorByUsername);
router.post("/initialise-payment", initialisePayment);
router.get("/verify-payment/:reference", verifyPayment);


 module.exports = router;