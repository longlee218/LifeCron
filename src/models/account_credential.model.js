const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId, String } = Schema.Types;

const accountCredentialSchema = new Schema({
    name: {
        type: String, required: true, maxLength: 100
    },
    f_user: {
        type: ObjectId,
        ref: "auth_users",
        required: true,
    },
    data: {
        type: String, required: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

module.exports = mongoose.model('account_credentials', accountCredentialSchema);