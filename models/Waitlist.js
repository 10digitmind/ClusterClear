const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  platform: String,
  missedDeals: String,
  monetise: String,

}, { timestamps: true });

module.exports = mongoose.model("Waitlist", waitlistSchema);