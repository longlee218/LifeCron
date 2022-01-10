const {sendMailVerify} = require("../mailer");
const {APIError} = require("../../utils/MyError");
const {AuthUser, AuthToken} = require("../../models");
const {catchAsync} = require("../../utils/catchAsync");
const {makeAndStoreToken, makeOAuthUser} = require("./auth.service");

exports.signUp = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    const {salt, passwordHash} = await AuthUser.setPassword(password);
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
        //Generate token
        const {accessToken} = await makeAndStoreToken({_id: user._id, email: user.email});
        //Send email
        const host = req.host;
        const link = `http://${host}/api/v1/verify/${email}/${accessToken}`;
        const msg = await sendMailVerify(email, link);

        await session.commitTransaction();
        session.endSession();
        return res.status(201).send(msg);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new APIError({message: "Something went wrong", errors: error, status: 500});
    }
});


exports.signIn = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await AuthUser.findOne({email});
    if (!user.is_active) {
        throw new APIError({message: "Tài khoản chưa được xác thực.", status: 403});
    }
    const isPasswordMatched = await AuthUser.comparePassword(user.password, user.salt, password);
    if (!isPasswordMatched) {
        throw new APIError({message: "Mật khẩu không đúng.", status: 422});
    }
    const {accessToken, refreshToken} = await makeAndStoreToken({_id: user._id, email: user.email});
    user.password = undefined;
    return res.status(200).json({
        user, token: {
            accessToken, refreshToken
        }
    });
})

exports.verifyEmail = catchAsync(async (req, res, next) => {
    const {email, token} = req.params;
    const authToken = await AuthToken.findOne({access_token: token})
        .orFail(() => new APIError({message: "Token không chính xác.", status: 404}));

    if (authToken.expires_in < new Date())
        throw new APIError({
            message: "E-mail xác thực của bạn đã hết hạn, vui lòng click vào đây để nhận lại.",
            status: 400
        })

    const user = await AuthUser.findOne({email}).orFail(() => new APIError({message: "Tài khoản không tồn tại."}));
    if (user.is_active) {
        return resServerSuccess(res, 200, `Tài khoản đã được xác thực vào lúc:${new Date(user.updatedAt).toLocaleString()}.`);
    }
    await user.update({is_active: true});
    return res.status(200).send("Tài khoản đã xác thực thành công.");
})

exports.resendVerifyEmail = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const user = await AuthUser.findOne({email});
    if (user.is_active) {
        throw new APIError({message: "Tài khoản đã được xác thực.", status: 400});
    }
    const {accessToken} = await makeAndStoreToken({_id: user._id, email: user.email});
    const host = req.host;
    const link = `http://${host}/api/v1/verify/${email}/${accessToken}`;
    const msg = await sendMailVerify(email, link);
    return res.status(200).send(msg);
})

exports.getToken = catchAsync(async (req, res, next) => {
    const authToken = await AuthToken.findOne({refresh_token: refreshToken})
        .orFail(() => new APIError({message: "Token không chính xác."}));

    const user = await AuthUser.findOne({_id: authToken.user, is_active: true})
        .orFail(() => new APIError({message: "Không tìm thấy tài khoản."}));

    const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    } = await makeAndStoreToken({_id: user._id, email: user.email});
    user.password = undefined;
    return res.status(200).json({
        user, token: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    });
});

exports.makeOAuthUser = catchAsync(async (req, res, next) => {
    const {user, accessToken, refreshToken} = await makeOAuthUser(req.user);
    return res.status(200).json({
        user, token: {
            accessToken, refreshToken
        }
    });
});