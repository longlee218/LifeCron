const crypto = require('crypto');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const {String, Boolean, Date} = Schema.Types;

const authUserSchema = new Schema({
    username: {type: String, maxLength: 100, unique: true},
    password: {type: String, require: true},
    last_login: Date,
    email: {type: String, require: true},
    is_active: {type: Boolean, require: true, default: false},
    date_joined: {type: Date, require: true},
    salt: String,
}, {timestamps: {createdAt: true, updatedAt: true}});

authUserSchema.statics.setPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return {salt, passwordHash};
}

authUserSchema.statics.comparePassword = (passwordHash, salt, passwordCheck) =>
    passwordHash === crypto.pbkdf2Sync(passwordCheck, salt, 1000, 64, 'sha512').toString('hex')

module.exports = mongoose.model("auth_user", authUserSchema);