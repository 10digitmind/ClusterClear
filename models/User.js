const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.role === "creator"; } },
  role: { type: String, enum: ["creator", "buyer"], default: "creator" },
  fullName: { type: String },
  username: { type: String, unique: true, sparse: true },
  bio: { type: String },
  socialLinks: {
    instagram: String,
    tiktok: String,
    youtube: String,
    twitter: String,
    facebook: String,
  },
  telegramId: String,
  whatsappNumber: String,
  emailVerificationToken: String,
  isEmailVerified: { type: Boolean, default: false },
   isPhoneVerified: { type: Boolean, default: false },
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  subscription: { type: String, enum: ["free", "pay as you go", 'pro'], default: "free" },
  subscriptionStartedAt: Date,
  subscriptionEndsAt: Date,
  isSubscriptionActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);