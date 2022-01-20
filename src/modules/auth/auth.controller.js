const { sendMailVerify } = require("../mailer");
const { APIError } = require("../../utils/MyError");
const { AuthUser, AuthToken } = require("../../models");
const { catchAsync } = require("../../utils/catchAsync");
const AccountService = require("../accounts/account.service");
const { makeAndStoreToken, makeOAuthUser } = require("./auth.service");
const { lang } = require("../../constant");

const langVN = lang.vn;

exports.signUp = catchAsync(async (req, res, next) => {
    const {
        email,
        password,
        timeZone,
        isWithProject
    } = req.body;

    const { salt, passwordHash } = await AuthUser.setPassword(password);
    const session = await AuthUser.startSession();
    session.startTransaction();
    try {
        const username = email.substring(0, email.lastIndexOf("@"));
        const user = await AuthUser.create({
            username,
            email,
            isActive: false,
            date_joined: new Date(),
            salt,
            password: passwordHash
        });

        // Create account
        await AccountService.createAccount(user, timeZone, isWithProject);

        //Generate token
        const { accessToken } = await makeAndStoreToken({ _id: user._id, email: user.email });

        //Send email
        sendMailVerify(req, email, accessToken);

        await session.commitTransaction();
        session.endSession();
        return res.status(201).send(langVN.info.send_email.replace("{xxx}", email));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new APIError({
            message: langVN.error.server.some_thing_wrong,
            errors: error, status: 500
        });
    }
});


exports.signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await AuthUser.findOne({ email });

    if (!user.is_active) {
        throw new APIError({ message: langVN.error.authen.account_not_verify, status: 403 });
    }

    const isPasswordMatched = await AuthUser.comparePassword(user.password, user.salt, password);

    if (!isPasswordMatched) {
        throw new APIError({ message: langVN.error.authen.wrong_password, status: 422 });
    }

    const { accessToken, refreshToken } = await makeAndStoreToken({ _id: user._id, email: user.email });
    user.password = undefined;
    user.salt = undefined;
    return res.status(200).json({
        user, token: {
            accessToken, refreshToken
        }
    });
})

exports.signInOpt = catchAsync(async (req, res, next) => {

})

exports.verifyEmail = catchAsync(async (req, res, next) => {
    const { email, token } = req.params;
    const authToken = await AuthToken.findOne({ access_token: token })
        .orFail(() => new APIError({ message: langVN.error.authen.wrong_token, status: 404 }));

    if (authToken.expires_in < new Date())
        throw new APIError({
            message: langVN.error.authen.expire_email,
            status: 400
        })

    const user = await AuthUser.findOne({ email }).orFail(() =>
        new APIError({ message: langVN.error.authen.user_does_not_exist_already }));

    if (user.is_active) {
        return res.status(200).send(langVN.error.authen.account_already_verified);
    }

    await user.update({ is_active: true });
    return res.status(200).send(langVN.success.authen.verify_email);
})


exports.resendVerifyEmail = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const user = await AuthUser.findOne({ email });

    if (user.is_active) {
        throw new APIError({ message: langVN.error.authen.account_already_verified, status: 400 });
    }

    const { accessToken } = await makeAndStoreToken({ _id: user._id, email: user.email });
    sendMailVerify(req, email, accessToken);
    return res.status(200).send(langVN.info.send_email.replace("{xxx}", email));
})


exports.getToken = catchAsync(async (req, res, next) => {
    const authToken = await AuthToken.findOne({ refresh_token: refreshToken })
        .orFail(() => new APIError({ message: langVN.error.authen.wrong_token }));

    const user = await AuthUser.findOne({ _id: authToken.user, is_active: true })
        .orFail(() => new APIError({ message: langVN.error.authen.user_does_not_exist_already }));

    const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    } = await makeAndStoreToken({ _id: user._id, email: user.email });

    user.password = undefined;
    return res.status(200).json({
        user, token: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    });
});


exports.makeOAuthUser = catchAsync(async (req, res, next) => {
    const { user, accessToken, refreshToken } = await makeOAuthUser(req.user);
    return res.status(200).json({
        user, token: {
            accessToken, refreshToken
        }
    });
});