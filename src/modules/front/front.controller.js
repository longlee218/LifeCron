
const { lang } = require("../../constant");
const { APIError } = require("../../utils/MyError");
const { catchAsync } = require("../../utils/catchAsync");
const { refreshActiveDate, getProjectForUser } = require("./front.service");
const { ApiCheck } = require("../../models");

const langVN = lang.vn;

const VALID_SORT_VALUES = ["name", "-name", "last_ping", "-last_ping", "created_at", "-created_at"];
const VALID_URL_VALUES = ["uuid", "slug"];

exports.myChecks = catchAsync(async (req, res, next) => {
    const { user, authInfo: profile } = req;
    const codeProject = req.params.code;
    try {
        await refreshActiveDate(profile);
        const { project, canSee } = await getProjectForUser(codeProject, user);

        if (!canSee) {
            throw new APIError({ message: langVN.error.server.permission_denied, status: 403 });
        }

        // query params
        const { sort, urls } = req.query;
        if (sort && VALID_SORT_VALUES.includes(sort)) {
            profile.sort = sort;
            await profile.save();
        }

        if (urls && VALID_URL_VALUES.includes(urls)) {
            project.show_slugs = urls === "slug";
            await project.save();
        }

        const checks = ApiCheck.find({ f_project: project._id })
            .populate("f_channel")
            .sort(profile.sort);

        return res.status(200).json(project);
    } catch (e) {
        throw new APIError({ message: e.message, status: 500 });
    }
})