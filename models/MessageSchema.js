const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },

  senderType: {
    type: String,
    enum: ["creator", "buyer"],
    required: true,
  },

  senderUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  text: {
    type: String,
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);