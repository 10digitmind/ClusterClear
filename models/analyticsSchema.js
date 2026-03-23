const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },

  day: String,   // Monday
  week: Number,  // 1–52
  month: Number, // 0–11
  year: Number,

  visits: {
    type: Number,
    default: 0,
  },

  signups: {
    type: Number,
    default: 0,
  },

  sources: {
    type: Map,
    of: Number,
    default: {},
  },

}, { timestamps: true });

module.exports = mongoose.model("Analytics", analyticsSchema);