const moment = require("moment");
const { lang } = require("../../constant");
const { AccountProject, AccountMember } = require("../../models");

const langVN = lang.vn;

// Get project user can see
exports.getProjectForUser = async (codeProject, user) => {
    const project = await AccountProject.findById(codeProject);
    if (!project) {
        throw new Error(langVN.error.server.not_found);
    }
    // Owner project
    if (project.f_user.equals(user._id)) {
        return { project, canSee: true };
    }

    // Member in project
    const accountMember = await AccountMember.findOne({ f_project: project._id, f_user: user._id });
    if (!accountMember) {
        throw new Error(langVN.error.server.not_found);
    }
    const isReadOrMember = await accountMember.isReadOrMember();
    return { project, canSee: isReadOrMember };
}

exports.refreshActiveDate = async (profile) => {
    const now = moment();
    if (!profile.last_active_date || moment(profile.last_active_date).diff(now, "days") > 0) {
        profile.last_active_date = now;
        await profile.save();
    }
}

exports.getTagStatuses = async (checks) => {
    const tags = {};
    const down = {};
    const grace = {};
    const numDown = 0;

    checks.forEach(check => {
        const status = await check.getStatus();

        switch (status) {
            case "down":
                numDown += 1;
                break;
            case "grace":
                numDown += 1;
                break;
            default:
                break;
        }
    });
} 