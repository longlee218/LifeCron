const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId, Date } = Schema.Types;

const enumRole = [
    "read-only",
    "member",
    "manager"
]

const accountMemberSchema = new Schema({
    f_user: {
        type: ObjectId,
        ref: "auth_users",
        required: true,
    },
    f_project: {
        type: ObjectId,
        ref: "account_projects",
        required: true,
    },
    transfer_request_date: Date,
    role: {
        type: String, required: true, enum: enumRole
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

accountMemberSchema.statics.isReadOrMember = function () {
    return enumRole.includes(this.role);
}

module.exports = mongoose.model('account_members', accountMemberSchema);