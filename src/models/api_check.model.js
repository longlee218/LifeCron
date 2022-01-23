const moment = require("moment");
const slugify = require("slugify");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { String, Date, ObjectId, Number, Boolean } = Schema.Types;

// Enum
const METHODS_ALLOW = ["POST", "GET", "PUT", "DELETE", "OPTIONS"];
const STATUS_VARIABLES = ["up", "down", "new", "pause"];

const DEFAULT_GRACE_MICRO_SECONDS = 3600 * 1000;
const DEFAULT_TIMEOUT_MICRO_SECONDS = 3600 * 24 * 1000;

const apiCheckSchema = new Schema({
    name: { type: String, maxLength: 100 },
    slug: { type: String, maxLength: 100, set: (name) => slugify(name) },
    tags: [{ type: String, maxLength: 20 }],
    desc: String,
    f_project: {
        type: ObjectId, ref: "account_projects", required: true
    },
    f_channel: [{
        type: ObjectId, ref: "api_channels"
    }],
    kind: {
        type: String, maxLength: 10, enum: ["simple", "cron"], default: "simple"
    },
    timeout: {
        type: Number, default: DEFAULT_TIMEOUT_MICRO_SECONDS
    },
    grace: {
        type: Number, default: DEFAULT_GRACE_MICRO_SECONDS
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
        type: String, enum: METHODS_ALLOW, default: "GET",
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
        type: String, enum: STATUS_VARIABLES, default: "new", required: true
    }
}, { timestamps: { createdAt: true, updatedAt: true } });


apiCheckSchema.statics.getGraceStart = async function (withStarted = true) {

}

apiCheckSchema.statics.getStatus = async function (nowM = undefined, withStarted = false) {
    if (!nowM) {
        nowM = moment();
    }

    if (this.last_start) {
        const lastStartM = moment(this.last_start);
        if (nowM.diff(lastStartM.set("millisecond", this.grace)) >= 0) {
            return "down";
        }
        if (withStarted) {
            return "started";
        }
    }

    if (["new", "paused", "down"].includes(this.status)) {
        return this.status;
    }

    const graceStart = this.getGraceStart();

    return "up";
}

module.exports = mongoose.model("api_checks", apiCheckSchema);