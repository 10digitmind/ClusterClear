const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const generateUsername = require("../controller/Utils/generateUsername");
const generateToken = require("../controller/Utils/generateToken");
const CreatorProfile = require("../models/CreatorProfile");
const Message = require("../models/Message");
const Waitlist = require("../models/Waitlist");
const Analytics = require("../models/analyticsSchema");
const getDateParts = require('../controller/Utils/getDateParts')
const uploadToCloudflare = require('../controller/Utils/cloudinaryConfig')



const {
  sendVerificationEmail,
  welcomeEmail,
  sendPasswordResetEmail,
  changePasswordEmail,
  waitlist
} = require("../Mailer/sender");
// Helper: generate JWT

const signup = async (req, res) => {
  try {
    const { email, password, } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and  password  are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists please log in " });

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationToken = crypto.randomBytes(20).toString("hex");
  const userName = await generateUsername(email);
    const user = await User.create({
      email,
      password: hashedPassword,
      emailVerificationToken,
      wallet: {
    availableBalance: 0,
    pendingBalance: 0,
    totalEarned: 0,
    lifetimeWithdrawn: 0,
  },

   bankDetails: {
    bankName: null,
    accountName: null,
    accountNumber: null,

  },
      onboardingStage:'none'
    
    });

  
      

    const userEmail = email.toLowerCase().trim();
    const token = emailVerificationToken;

    // Send email verification if email exists
    if (email) {
      await sendVerificationEmail(userEmail, userName, token);
    }

    res.status(201).json({
      message: "Check your email to verify your account 📩",
      token: generateToken(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Email ---tested.
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      $or: [
        { emailVerificationToken: token },
        { isEmailVerified: true }
      ]
    });
    if (!user) {
      return res.status(400).json({ status: "invalid" });
    }

    // Optional but IMPORTANT if you use expiry
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({ status: "expired" });
    }

    if (user.isEmailVerified) {
      return res.json({ status: "already_verified" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    const userEmail = user.email;
    const name = userEmail.split("@")[0];
    const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`;

    // IMPORTANT: await email
    await welcomeEmail(userEmail, name, dashboardUrl);

    return res.json({
      status: "verified",
      user:user.onboardingStage
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error" });
  }
};

// Login --tested.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ✅ DO NOT exclude password here
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Remove password manually before sending
    const userSafe = user.toObject();
    delete userSafe.password;

    res.json({
      token: generateToken(user),
      user: userSafe,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password--tested
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const userName = user.username;
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, userName, resetUrl);
    res.json({ message: "Reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password--tested
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    console.log("Reset token:", token);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password-- tested
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.userId; // from auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/dashboard`;
    const changedAt = new Date().toLocaleString();
    changePasswordEmail(user.email, user.username, resetUrl, changedAt);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// create profile 



const updateCreatorProfile = async (req, res) => {
  try {
    const { priorityFee, profileBio } = req.body;
    const userId = req.user.id;

    const creatorProfile = await CreatorProfile.findOne({ user: userId });

    if (!creatorProfile) {
      return res.status(404).json({
        message: "Creator profile not found",
      });
    }

    // update fee
    if (priorityFee !== undefined) {
      if (priorityFee <= 0) {
        return res.status(400).json({
          message: "Priority fee must be greater than 0",
        });
      }
      creatorProfile.priorityFee = priorityFee;
    }

    // update bio
    if (profileBio !== undefined) {
      creatorProfile.profileBio = profileBio;
    }

    // update image (UPLOAD FLOW)
    if (req.file) {
      const imageUrl = await uploadToCloudflare(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      creatorProfile.profilePic = imageUrl;
    }

    await creatorProfile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      creatorProfile,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if username is already taken
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Update username
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { username: username },           // use the variable, not string
      { returnDocument: 'after' }       // returns the updated document
    );

    res.json({
      message: "Username updated",
      username: updatedUser.username,
      link: `https://clusterclear.app/${updatedUser.username}` // use updatedUser
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const initialisePayment = async (req, res) => {
  try {
    const { creatorId, buyerEmail, message } = req.body;

    if (!creatorId || !buyerEmail || !message) {
      return res.status(400).json({
        error: "Creator ID, buyer email and message are required.",
      });
    }

    // Find creator profile
    const creatorProfile = await CreatorProfile.findOne({ user: creatorId });

    if (!creatorProfile) {
      return res.status(404).json({ error: "Creator profile not found." });
    }

    const priorityFee = creatorProfile.priorityFee;

    // Create metadata for Paystack
    const metadata = {
      creatorId,
      message,
    };

    // Initialize Paystack transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: buyerEmail,
        amount: priorityFee * 100, // convert to kobo
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      paymentLink: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });

  } catch (error) {
    console.error(
      "Error initializing payment:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      error: "Failed to initialize payment.",
    });
  }
};


const verifyPayment = async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ error: "Reference is required." });
  }

  try {
    // 1️⃣ Verify transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const transaction = response.data.data;

    if (transaction.status !== "success") {
      return res.status(400).json({ error: "Payment not successful." });
    }

    const metadata = transaction.metadata;

    const creatorId = metadata.creatorId;
    const messageText = metadata.message;

    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ error: "Invalid creator ID." });
    }

    // 2️⃣ Get creator
    const creator = await User.findById(creatorId);

    if (!creator) {
      return res.status(404).json({ error: "Creator not found." });
    }

    const creatorProfile = await CreatorProfile.findOne({ user: creatorId });

    if (!creatorProfile) {
      return res.status(404).json({ error: "Creator profile not found." });
    }

    const buyerEmail = transaction.customer.email;
    const amountPaid = transaction.amount / 100;

    // 3️⃣ Prevent duplicate messages
    const existingMessage = await Message.findOne({ reference });

    if (existingMessage) {
      return res.json({
        success: true,
        message: "Message already delivered.",
      });
    }



    // 4️⃣ Create message
    const message = await Message.create({
      creator: creatorId,
      message: messageText,
      amountPaid,
      reference,
      status: "new",
    });

    // 5️⃣ Update creator stats
    creatorProfile.totalRequests += 1;
    await creatorProfile.save();

    let user = await User.findOne({ email: buyerEmail });

if (!user) {
  user = await User.create({
    email: buyerEmail,
    role: "buyer",
    isPaidUser: true,
    isEmailVerified: false,

  });
} else {
  user.role = "buyer";
  user.isPaidUser = true;
  await user.save();
}
  const emailVerificationToken = crypto.randomBytes(20).toString("hex");
    // 6️⃣ Send notifications
    const creatorName = creator.username || creator.email.split("@")[0];

    await Promise.all([
      sendPriorityMessageAlertToCreator(
        creator.email,
        creatorName,
        buyerEmail,
        amountPaid
      ),

      sendPaymentConfirmationToBuyer(
        buyerEmail,
        creatorName,
        emailVerificationToken
      ),
    ]);

    // 7️⃣ Success response
    res.json({
      success: true,
      message: "Priority message delivered to creator.",
      creator: creator.username,
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      error: "Failed to verify payment.",
    });
  }
};

const trackCreatorLinkClick = async (req, res) => {
  const { username } = req.params;

  const creator = await User.findOne({ username });

  if (!creator) {
    return res.status(404).json({ error: "Creator not found" });
  }

  // increment click count
  creator.linkClicks += 1;

  await creator.save();

  res.json({
    success: true,
    message: "Click tracked",
  });
}

const respondToMessage = async (req, res) => {
  const { messageId } = req.body;

  if (!messageId) {
    return res.status(400).json({ error: "Message ID required" });
  }

  const message = await Message.findById(messageId);

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (message.status === "responded") {
    return res.json({
      success: true,
      message: "Already responded",
    });
  }

  message.status = "responded";
  message.respondedAt = new Date();

  await message.save();

  // Update creator stats
  const creatorProfile = await CreatorProfile.findOne({
    user: message.creator,
  });

  const responseTime =
 (message.respondedAt - message.createdAt) / (1000 * 60 * 60); // hours

creator.totalResponded += 1;
creator.totalResponseTime += responseTime;

creator.averageResponseTime =
 creator.totalResponseTime / creator.totalResponded;

creator.responseRate =
 (creator.totalResponded / creator.totalRequests) * 100;

await creator.save();

  res.json({
    success: true,
    message: "Response recorded",
  });
}


const getCreatorDashboardStats = async (req, res) => {
  const creatorId = req.user._id;

  const creatorProfile = await CreatorProfile.findOne({ user: creatorId });

  if (!creatorProfile) {
    return res.status(404).json({
      error: "Creator profile not found",
    });
  }

  const {
    linkClicks,
    totalRequests,
    totalResponded,
    averageResponseTime,
    responseRate,
    priorityFee
  } = creatorProfile;

  // conversion rate
  const conversionRate =
    linkClicks > 0 ? ((totalRequests / linkClicks) * 100).toFixed(2) : 0;

  res.json({
    success: true,
    stats: {
      linkClicks,
      totalRequests,
      totalResponded,
      responseRate,
      averageResponseTime,
      conversionRate,
      priorityFee
    }
  });
};


const createWaitList = async (req, res) => {
  try {
    const { email, platform, missedDeals, monetise } = req.body;

    // ✅ Basic validation
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // ✅ Normalize email (VERY important)
    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Check if user already exists
    const existing = await Waitlist.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(200).json({
        msg: "You're already on the waitlist 🚀",
        existing: true,
      });
    }

    // ✅ Create new user
    const newUser = new Waitlist({
      email: normalizedEmail,
      platform,
      missedDeals,
      monetise,
    });

    await newUser.save();
await waitlist(normalizedEmail)
    // ✅ Success response
    res.status(201).json({
      msg: "Thanks for joining 🚀 We’ll notify you when we launch",
      existing: false,
    });

  } catch (err) {
    console.error("WAITLIST ERROR:", err);
    res.status(500).json({
      msg: "Something went wrong. Please try again.",
    });
  }
};


const waitListCount = async (req, res) => {
  try {
  const count = await Waitlist.countDocuments();
  res.json({ count })
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

const trackVisit = async (req, res) => {
  try {
    const { date, day, week, month, year } = getDateParts();
    const { source } = req.body;

    let record = await Analytics.findOne({ date });

    if (!record) {
      record = new Analytics({ date, day, week, month, year });
    }

    record.visits += 1;

    if (source) {
      const current = record.sources.get(source) || 0;
      record.sources.set(source, current + 1);
    }

    await record.save();

    res.json({ msg: "Tracked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error tracking visit" });
  }
};


// GET /buyer/messages
const getBuyerMessages = async (req, res) => {
  try {
    const email = req.user.email;

    const messages = await Message.find({ buyerEmail: email })
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// GET /creator/messages
const getCreatorMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({ creator: userId })
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// GET /me
const getMe = async (req, res) => {

  try {
    const user = await User.findById(req.userId).select("-password");


    res.json(user);
  } catch (error) {
 
    res.status(500).json({ message: "Server error" });
  }
};

const checkAvailableUsername = async (req, res) => {
  try {
    let { username } = req.params;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        available: false
      });
    }

    username = username.trim().toLowerCase();

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Invalid username format",
        available: false
      });
    }

    const reserved = ["admin", "support", "login", "signup", "root"];

    if (reserved.includes(username)) {
      return res.status(400).json({
        message: "Username not allowed",
        available: false
      });
    }

    const existingUser = await User.findOne({ username });

    return res.json({
      available: !existingUser
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      available: false
    });
  }
};

const stepOne = async (req, res) => {
  try {
    const { username, fullName, userType } = req.body;

    if (!username || !userType) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const normalizedUsername = username.toLowerCase().trim();

    
    const existingUser = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: req.userId }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId, // ✅ FIXED
      {
        username: normalizedUsername,
        fullName,
        role: userType,
        onboardingStage: "step_two",
        creatorLink: `https://clusterclear.app/creator/${normalizedUsername}`
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Step one completed",
      user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const stepTwo = async (req, res) => {
  try {
    const { bio, priorityFee } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profilePicUrl;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    // ✅ Validate file type
    if (req.file && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only images allowed.",
      });
    }

    // ✅ Validate file size
    if (req.file && req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        message: "File too large (max 2MB)",
      });
    }

    // ✅ Upload file
    if (req.file) {
      profilePicUrl = await uploadToCloudflare(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const updateData = {};

    if (profilePicUrl) {
      updateData.profilePic = profilePicUrl;
    }

    // ✅ Creator-specific logic
    if (user.role === "creator") {
      const fee = Number(priorityFee);

      if (isNaN(fee) || fee <= 0) {
        return res.status(400).json({
          message: "Priority fee must be a number greater than 0",
        });
      }

      if (bio !== undefined) updateData.bio = bio;
      updateData.priorityFee = fee;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
      });
    }

    // ✅ Move onboarding forward
    updateData.onboardingStage = "completed";

    const updatedUser = await User.findByIdAndUpdate(
  req.userId,
  updateData,
  { returnDocument: "after" }
).select("-password");

    return res.status(200).json({updatedUser,message:"Onboarding completed"});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const completeOnboarding = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { onboardingCompleted: true },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // 🔐 Generate new token
    const token = crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = token;
    user.verificationTokenExpiry = Date.now() + 1000 * 60 * 60 * 24; // 24h

    await user.save();

    // 🌍 Send email
    await sendVerificationEmail(
      user.email,
      user.name,
      token
    );

    return res.json({
      message: "Verification email sent successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updateCreatorProfile,
  updateUsername,
  respondToMessage,
  getCreatorDashboardStats,
  initialisePayment,
  verifyPayment,
  trackCreatorLinkClick,
  createWaitList,
  waitListCount,
  trackVisit,
  getBuyerMessages,
  getCreatorMessages,
  getMe,
  checkAvailableUsername,
  stepOne,
  stepTwo,
  completeOnboarding,
  resendVerificationEmail
};
