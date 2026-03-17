const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "NGN"
    },

    paymentType: {
        type: String,
        enum: ["priority_request", "subscription"]
    },

    status: {
        type: String,
        enum: ["success", "failed", "pending"]
    },

    gateway: String,
    gatewayResponse: Object
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Payment", paymentSchema);