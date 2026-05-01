const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  buyerEmail: String,
  buyerPhone: String,
  buyerName: String,

  // if user signs up later
  buyerUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  amountPaid: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },

  status: {
    type: String,
    enum: ["open", "closed", "archived"],
    default: "open",
  },

  lastMessage: String,
  lastMessageAt: Date,

  creatorUnreadCount: {
    type: Number,
    default: 0,
  },

  buyerUnreadCount: {
    type: Number,
    default: 0,
  }

}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);