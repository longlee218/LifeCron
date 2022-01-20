
const { lang } = require("../../constant");
const { APIError } = require("../../utils/MyError");
const { catchAsync } = require("../../utils/catchAsync");
const { refreshActiveDate, getProjectForUser } = require("./front.service");

const langVN = lang.vn;

exports.myChecks = catchAsync(async (req, res, next) => {
    const { user, authInfo: profile } = req;
    const codeProject = req.params.code;
    try {
        await refreshActiveDate(profile);
        const { project, canSee } = await getProjectForUser(codeProject, user);

        if (!canSee) {
            throw new APIError({ message: langVN.error.server.permission_denied, status: 401 });
        }
        return res.status(200).json(project);
    } catch (e) {
        throw new APIError({ message: e.message, status: 500 });
    }
})