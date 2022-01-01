const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const authTokenSchema = new Schema({
    user: { type: Types.ObjectId, require: true, ref: 'auth_users' },
    access_token: { type: String, require: true },
    refresh_token: { type: String, require: true },
    is_active: Boolean,
    expires_in: Date
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const AuthToken = mongoose.model('auth_token', authTokenSchema);
module.exports = AuthToken;