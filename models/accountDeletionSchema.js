const mongoose = require("mongoose");

const accountDeletionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "Too expensive",
        "Not enough value",
        "Found alternative",
        "Too many bugs",
        "No longer needed",
        "Poor support",
        "Privacy concerns",
        "Other",
      ],
    },

    feedback: {
      type: String,
      maxlength: 1000,
      default: "",
      trim: true,
    },

    deletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AccountDeletion",
  accountDeletionSchema
);