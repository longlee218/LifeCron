const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId, Date, Number, String} = Schema.Types;

const accountProfileSchema = new Schema({
    user_id: {
        type: ObjectId,
        ref: "auth_user"
    },
    next_report: Date,
    ping_log_time: Number,
    token: String,
    check_limit: Number,
    last_sms_date: Date,
    sms_limit: Number,
    sms_sent: Number,
    team_limit: Number,
    sort: String,
    nag_period: Number,
    next_nag_date: Date,
    deletion_notice_date: Date,
    last_active_date: Date,
    call_limit: Number,
    calls_sent: Number,
    last_call_sent: Date,
    reports: String,
    tz: String,
    theme: String,
    totp: String,
    totp_created: Date
}, {timestamps: {createdAt: true, updatedAt: true}});

const AccountProfile = mongoose.model('api_account', accountProfileSchema);
module.exports = AccountProfile;