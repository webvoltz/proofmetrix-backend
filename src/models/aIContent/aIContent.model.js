const mongoose = require("mongoose");

const aIContentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        contentType: {
            type: String,
            enum: ["Headlines", "Sub-Headlines", "Sales Bullets", "Email Subject Lines"],
        },
        isDeleted: { type: Boolean, default: false },
        userPrompt: {
            type: Object,
        },
        aiResponse: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const aIContentModel = mongoose.model("aIContent", aIContentSchema);
module.exports = aIContentModel;
