const { catchAsync } = require("../../utils/catchAsync");
const { AuthUser, AccountCredential, AccountProvider } = require("../../models");

exports.profileInfo = catchAsync(async (req, res, next) => {
    const credential = await AccountCredential.find({ f_user: req.user._id });
    const profile = await AccountProvider.findOne({ f_user: req.user._id });

    if (credential || profile.totp) {

    }

    return res.status(200).json({ user: req.user });
})