const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;
const { String, Date, ObjectId, Number, Boolean } = Schema.Types;

const setNameSlug = (name) => slugify(name);

const apiCheckSchema = new Schema({
    name: { type: String, maxLength: 100 },
    slug: { type: String, maxLength: 100, set: setNameSlug },
    tags: [{ type: String, maxLength: 20 }],
    desc: String,
    f_project: {
        type: ObjectId, ref: "account_projects", required: true
    },
    kind: {
        type: String, maxLength: 10, enum: ["simple", "cron"], default: "simple"
    },
    timeout: {
        type: Number, default: 86400 // 24h = 24 * 60 * 60
    },
    grace: {
        type: Number, default: 3600
    },
    schedule: {
        type: String, default: "* * * * * *", maxLength: 100, required: true
    },
    timeZone: {
        type: String, maxLength: 20, default: "UTC"
    },
    subject: {
        type: String, maxLength: 200
    },
    subject_fail: {
        type: String, maxLength: 200
    },
    methods: {
        type: String, enum: ["POST", "GET", "PUT", "DELETE", "OPTIONS"], default: "GET",
    },
    manual_resume: {
        type: Boolean, default: false, required: true
    },
    n_pings: {
        type: Number, default: 0, required: true
    },
    last_ping: Date,
    last_start: Date,
    last_duration: Date,
    last_ping_was_fail: {
        type: Boolean, default: false, required: true
    },
    has_confirmation_link: {
        type: Boolean, default: false, required: true
    },
    alert_after: Date,
    status: {
        type: String, enum: ["up", "down", "new", "pause"], default: "new", required: true
    }
}, { timestamps: { createdAt: true, updatedAt: true } });


module.exports = mongoose.model("api_checks", apiCheckSchema);