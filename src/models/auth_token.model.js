const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId, String, Boolean, Date} = Schema.Types;

const authTokenSchema = new Schema({
    user: {type: ObjectId, require: true, ref: "auth_user"},
    access_token: String,
    refresh_token: String,
    is_active: Boolean,
    expires_in: Date
}, {timestamps: {createdAt: true, updatedAt: true}});

const AuthToken = mongoose.model('auth_token', authTokenSchema);
module.exports = AuthToken;