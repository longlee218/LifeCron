const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId, Boolean, String } = Schema.Types;
const { AuthUser } = require('./index');


const accountProfileSchema = new Schema({
    name: {
        type: String, maxlength: 150
    },
    api_key: {
        type: String, maxlength: 128, index: true
    },
    api_key_readonly: {
        type: String, maxlength: 128, index: true
    },
    f_user: {
        type: ObjectId, required: true, ref: "auth_users"
    },
    badge_key: {
        type: String, require: true, maxlength: 150, unique: true
    },
    ping_key: {
        type: String, maxlength: 128, unique: true
    },
    show_slugs: {
        type: Boolean, require: true, default: false
    }
}, { timestamps: { createdAt: true, updatedAt: true } });

// Get name of project
accountProfileSchema.statics.getName = async function () {
    const user = await AuthUser.findById(this.f_user);
    return this.name ?? user.email;
}


module.exports = mongoose.model('account_projects', accountProfileSchema);