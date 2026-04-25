const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  amount: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "paid", "failed", "cancelled"],
    default: "pending"
  },

  bankSnapshot: {
    bankName: String,
    accountNumber: String,
    accountName: String
  },

  requestedAt: { type: Date, default: Date.now },
  processedAt: Date
});

module.exports = mongoose.model("Withdrawal", WithdrawalSchema);