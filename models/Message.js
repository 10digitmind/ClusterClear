const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  amountPaid: Number,

  reference: {
    type: String,
    unique: true,
  },

  status: {
    type: String,
    enum: ["new", "responded"],
    default: "new",
  },

  respondedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);