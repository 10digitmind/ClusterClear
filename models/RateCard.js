const mongoose = require("mongoose");

const rateCardSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreatorProfile",
    required: true
  },

  instagramPost: Number,
  instagramStory: Number,
  tiktokVideo: Number,
  youtubeIntegration: Number,
  brandAmbassador: Number,
  eventAppearance: Number,

  customServices: [
    {
      name: String,
      price: Number
    }
  ],

  currency: {
    type: String,
    default: "NGN"
  }

}, { timestamps: true });

module.exports = mongoose.model("RateCard", rateCardSchema);