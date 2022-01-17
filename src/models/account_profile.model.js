const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId, Date, Number, String } = Schema.Types;

const accountProfileSchema = new Schema({
    f_user: {
        type: ObjectId, ref: "auth_users", required: true
    },
    next_report_date: Date,
    reports: {
        type: String, maxlength: 10, enum: ["off", "weekly", "monthly"],
        default: "monthly", required: true
    },
    nag_period: Number,      // day to seconds if daily means 86400 seconds
    next_nag_date: Date,
    ping_log_limit: {
        type: Number, default: 100, require: true
    },
    check_limit: {
        type: Number, default: 20, require: true
    },
    token: {
        type: String, maxLength: 128
    },

    last_sms_date: Date,
    sms_limit: {
        type: Number, default: 5, require: true
    },
    sms_sent: {
        type: Number, default: 0, require: true
    },

    team_limit: {
        type: Number, default: 2, require: true
    },
    sort: {
        type: String, default: "createdAt", require: true
    },
    deletion_notice_date: Date,
    last_active_date: Date,
    tz: {
        type: String, default: "UTC", require: true
    },
    theme: String,
    totp: {
        type: String, maxLength: 2
    },
    totp_created: Date
}, { timestamps: { createdAt: true, updatedAt: true } });


class Profile {

    async getUser() {
        return await AuthUser.findById(this.f_user);
    }

    makeProfileUser(user) {
        if (!process.env.PAYMENT) {
            this.check_limit = 500;
            this.sms_limit = 500;
            this.check_limit = 500;
            this.team_limit = 500;
        }
        this.f_user = user._id;
        return this;
    }
}

accountProfileSchema.loadClass(Profile);
module.exports = mongoose.model("account_profile", accountProfileSchema);