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
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and  password  are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationToken = crypto.randomBytes(20).toString("hex");
    const userName = generateUsername(email);
    const user = await User.create({
      email,
      password: hashedPassword,
      username: userName,
      emailVerificationToken,
      wallet: { balance: 0 } });

    const userEmail = email.toLowerCase().trim();
    const token = emailVerificationToken;

    // Send email verification if email exists
    if (email) {
      await sendVerificationEmail(userEmail, userName, token);
    }

    res.status(201).json({
      message: "User created, verify your email",
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

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });
    if (user.isEmailVerified)
      return res.status(400).json({ message: "Email already verified" });

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    const userEmail = user.email;
    const name = userEmail.split("@")[0];
    const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`;

    welcomeEmail(userEmail, name, dashboardUrl);

    res.json({ message: "Email verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login --tested.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
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
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
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



const createCreatorProfile = async (req, res) => {
  try {
    const { priorityFee } = req.body;

    const userId = req.user.id; // from auth middleware

    // Check if creator profile already exists
    const existingProfile = await CreatorProfile.findOne({ user: userId });


    if (!priorityFee || priorityFee <= 0) {
  return res.status(400).json({
    message: "Priority fee must be greater than 0",
  });
}
    if (existingProfile) {
      return res.status(400).json({
        message: "Creator profile already exists",
      });
    }

    // Create creator profile
    const creatorProfile = new CreatorProfile({
      user: userId,
      priorityFee,
      wallet: { balance: 0 }
    });

    await creatorProfile.save();

    res.status(201).json({
      message: "Creator profile created successfully",
      creatorProfile,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePriorityFee = async (req, res) => {
  try {
    const { priorityFee } = req.body;

    const userId = req.user.id;

    if (!priorityFee || priorityFee <= 0) {
      return res.status(400).json({
        message: "Priority fee must be greater than 0",
      });
    }

    const creatorProfile = await CreatorProfile.findOne({ user: userId });

    if (!creatorProfile) {
      return res.status(404).json({
        message: "Creator profile not found",
      });
    }

    creatorProfile.priorityFee = priorityFee;

    await creatorProfile.save();

    res.status(200).json({
      message: "Priority fee updated successfully",
      priorityFee: creatorProfile.priorityFee,
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
      buyerEmail,
      message: messageText,
      amountPaid,
      reference,
      status: "new",
    });

    // 5️⃣ Update creator stats
    creatorProfile.totalRequests += 1;
    await creatorProfile.save();

    // 6️⃣ Send notifications
    const creatorName = creator.username || creator.email.split("@")[0];

    await Promise.all([
      sendPriorityMessageAlertToCreator(
        creator.email,
        creatorName,
        buyerEmail,
        messageText,
        amountPaid
      ),

      sendPaymentConfirmationToBuyer(
        buyerEmail,
        creatorName,
        messageText
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

  const creatorProfile = await CreatorProfile.findOne({ user: creator._id });

  if (!creatorProfile) {
    return res.status(404).json({ error: "Creator profile not found" });
  }

  // increment click count
  creatorProfile.linkClicks += 1;

  await creatorProfile.save();

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
module.exports = {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  createCreatorProfile,
  updatePriorityFee,
  updateUsername,
  respondToMessage,
  getCreatorDashboardStats,
  initialisePayment,
  verifyPayment,
  trackCreatorLinkClick,
  createWaitList,
  waitListCount,
  trackVisit
};
