const mongoose = require("mongoose");

const priorityRequestSchema = new mongoose.Schema(
{
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreatorProfile",
        required: true
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: String,
    email: String,
    phone: String,
    company: String,

    message: {
        type: String,
        required: true
    },

    budget: Number,
    timeline: String,

    amountPaid: Number,

    status: {
        type: String,
        enum: ["pending", "responded", "ignored"],
        default: "pending"
    },

    respondedAt: Date
},
{
    timestamps: true
}
);

module.exports = mongoose.model("PriorityRequest", priorityRequestSchema);