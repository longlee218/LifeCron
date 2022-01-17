const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId, String, Boolean, Date } = Schema.Types;

const authTokenSchema = new Schema({
    f_user: { type: ObjectId, require: true, ref: "auth_users" },
    access_token: String,
    refresh_token: String,
    is_active: Boolean,
    expires_in: Date
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = mongoose.model("auth_tokens", authTokenSchema);