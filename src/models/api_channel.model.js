const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { String, Date, ObjectId, Number, Boolean } = Schema.Types;

const apiChannelSchema = new Schema({
    name: {
        type: String, maxLength: 100
    },
    f_project: {
        type: ObjectId, required: true, ref: "account_projects"
    },
    kind: {
        type: String,
        enum: ["webhook", "email", "zalo", "trello", "slack", "discord", "messenger", "mcsteam"],
        default: "email",
        required: true
    },
    value: String,
    email_verified: {
        type: Boolean, default: false, required: true
    },
    last_notify: Date,
    last_error: Date,
    f_checks: [{
        type: ObjectId, ref: "api_checks", required: true
    }]
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = mongoose.model("api_channels", apiChannelSchema);