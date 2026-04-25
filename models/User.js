const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.role === "creator"; } },
  role: { type: String, enum: ["creator", "Fan"], default: "creator" },
  fullName: { type: String },
  username: { type: String, unique: true, sparse: true },
  priorityFee: { type: Number, default: 0 },
  profilePic: { type: String },
  bio: { type:String,
default:'Priority creator inbox active. Message for collaborations, promotions, or paid requests. Fast response guaranteed for serious inquiries'
    },
  socialLinks: {
    instagram: String,
    tiktok: String,
    youtube: String,
    twitter: String,
    facebook: String,
  },
    wallet: {
    availableBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    lifetimeWithdrawn: { type: Number, default: 0 },
  },

  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: String,

  },
  linkClicks:{ type: Number, default: 0 },
  telegramId: String,
  whatsappNumber: String,
  emailVerificationToken: String,
  isEmailVerified: { type: Boolean, default: false },
   isPhoneVerified: { type: Boolean, default: false },
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isPaidUser:Boolean,
onboardingStage: {
  type: String,
  enum: ["none", "step_one", "step_two", "completed"],
  default: "none"
},
creatorLink: { type: String },
  subscription: { type: String, enum: ["free", "pay as you go", 'pro'], default: "free" },
  subscriptionStartedAt: Date,
  subscriptionEndsAt: Date,
  onboardingCompleted: { type: Boolean, default: false },
  isSubscriptionActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);