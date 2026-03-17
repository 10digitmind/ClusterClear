const mongoose = require("mongoose");

const creatorProfileSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    priorityFee: {
        type: Number,
        required: true,
        default: 5
    },
    linkClicks:{
type: Number,
default: 0
    },
  wallet: {
    balance: { type: Number, default: 0 },
  },
    responseRate: {
  type: Number,
  default: 0
},

totalRequests: {
  type: Number,
  default: 0
},

totalResponded: {
  type: Number,
  default: 0
},

totalResponseTime: {
  type: Number,
  default: 0
},

averageResponseTime: {
  type: Number,
  default: 0
},

    subscriptionStatus: {
        type: String,
        enum: ["free", "pro"],
        default: "free"
    },

    subscriptionEndsAt: Date
},
{
    timestamps: true
}
);

module.exports = mongoose.model("CreatorProfile", creatorProfileSchema);