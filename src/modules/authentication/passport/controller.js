const {AuthUser} = require("../../../models");
const {makeAndStoreToken, makeOAuthUser} = require("./service");
const {sendMailVerify} = require("../../mailer");
const MyError = require("../../../utils/MyError");
const {catchAsync} = require("../../../utils/catchAsync");
const {resServerSuccess} = require('../../../utils').response;

const sendMail = async (host, email, accessToken) => {
    const link = `http://${host}/api/v1/verify/${email}/${accessToken}`;
    await sendMailVerify(email, link);
    return `Hệ thống đã gửi E-mail xác nhận tới địa chỉ: ${email}, và sẽ hết hạn sau 1 giờ. Nếu bạn chưa nhận được E-mail, hãy click vào đây để nhận lại.`;
}

exports.signUp = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    const {salt, passwordHash} = await AuthUser.setPassword(password);
    const session = await AuthUser.startSession();
    session.startTransaction();
    try {
        const user = await AuthUser.create({
            email,
            isActive: false,
            date_joined: new Date(),
            salt,
            password: passwordHash
        });
        //Generate token
        const {accessToken} = await makeAndStoreToken({_id: user._id, email: user.email});
        //Send email
        const msg = await sendMail(req.host, email, accessToken);
        await session.commitTransaction();
        session.endSession();
        return resServerSuccess(res, 200, msg);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new MyError("Oops", 500);
    }
});


exports.signIn = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await AuthUser.findOne({email});
    if (!user.is_active) {
        throw new MyError("Tài khoản chưa được xác thực.", 403);
    }
    const isPasswordMatched = await AuthUser.comparePassword(user.password, user.salt, password);
    if (!isPasswordMatched) {
        throw new MyError("Mật khẩu không đúng.", 422);
    }
    const {accessToken, refreshToken} = await makeAndStoreToken({_id: user._id, email: user.email});
    user.password = undefined;
    return resServerSuccess(res, 200, "ok", {
        user,
        token: {
            accessToken,
            refreshToken
        }
    })
})

exports.verifyEmail = catchAsync(async (req, res, next) => {
    const {email, token} = req.params;
    const authToken = await AuthToken.findOne({access_token: token});
    if (!authToken)
        throw new MyError("Token không chính xác.", 422);

    if (authToken.expires_in < new Date())
        throw new MyError("E-mail xác thực của bạn đã hết hạn, vui lòng click vào đây để nhận lại.", 400);

    const user = await AuthUser.findOne({email});
    if (user) {
        if (user.is_active) {
            return resServerSuccess(res, 200, `Tài khoản đã được xác thực vào lúc:${new Date(user.updatedAt).toLocaleString()}.`);
        }
        await user.update({is_active: true});
        return resServerSuccess(res, 200, "Tài khoản đã xác thực thành công.");
    }
    throw new MyError("Tài khoản không tồn tại.", 404);
})

exports.resendVerifyEmail = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const user = await AuthUser.findOne({email});
    if (user.is_active) {
        throw new MyError("Tài khoản đã được xác thực.", 400);
    }
    const {accessToken} = await makeAndStoreToken({_id: user._id, email: user.email});
    const msg = await sendMail(req.host, email, accessToken);
    return resServerSuccess(res, 200, msg, []);
})

exports.getToken = catchAsync(async (req, res, next) => {
    const authToken = await AuthToken.findOne({refresh_token: refreshToken});
    if (!authToken) {
        throw new MyError("Token không hợp lệ.", 404);
    }
    const user = await AuthUser.findOne({_id: authToken.user, is_active: true});

    if (!user) {
        throw new MyError("Không tìm thấy tài khoản.", 404);
    }
    const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    } = await makeAndStoreToken({_id: user._id, email: user.email});
    user.password = undefined;
    return resServerSuccess(res, 200, "ok", {
        user,
        token: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    });
});

exports.makeOAuthUser = catchAsync(async (req, res, next) => {
    const {user, accessToken, refreshToken} = await makeOAuthUser(req.user);
    return resServerSuccess(res, 200, "ok", {
        user,
        token: {
            accessToken,
            refreshToken
        }
    })
});