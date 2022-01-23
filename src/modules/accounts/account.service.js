const uuid = require("uuid");
const {
    AccountProject,
    ApiCheck,
    ApiChannel,
    AccountProfile
} = require("../../models");

exports.createAccount = async (user, timeZone = null, isWithProject = false) => {
    try {
        if (isWithProject) {
            // Create project
            const project = await AccountProject.create({
                f_user: user._id,
                badge_key: uuid.v4(),
            })

            // Create check
            const nameCheck = "First Check";
            const check = await ApiCheck.create({
                f_project: project._id,
                name: nameCheck,
                slug: nameCheck,
            });

            // Create channel
            const channel = await ApiChannel.create({
                f_project: project._id,
                kind: "email",
                value: user.email,
                email_verified: false,
                $push: { f_checks: check._id }
            });

            await check.updateOne({
                $push: { f_channels: channel._id }
            });
        }
        const profile = new AccountProfile();
        profile.makeProfileUser(user);

        if (timeZone) {
            profile.tz = timeZone;
        }
        await profile.save();
        return user;
    } catch (e) {
        throw new APIError({ message: e.message, status: 500 });
    }
}

exports.check2Factor = async (user) => {
    console.log(user);
}