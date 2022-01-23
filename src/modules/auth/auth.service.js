const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passportConfig = require("./auth.config");
const { ExtractJwt, Strategy } = require("passport-jwt");
const { AuthUser, AuthToken, AccountProfile } = require("../../models");


exports.applyPassportStrategy = (passport) => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = passportConfig.secret;
    passport.use(
        new Strategy(options, async (payload, done) => {
            try {
                const user = await AuthUser.findOne({ _id: payload._id, is_active: true });
                if (user) {
                    user.password = undefined;
                    user.salt = undefined;
                    const profile = await AccountProfile.findOne({ f_user: user._id });
                    return done(null, user, profile);
                }
                return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        })
    );
};

const _makeAccessToken = (infoInToken) => {
    return jwt.sign(infoInToken, passportConfig.secret, {
        expiresIn: passportConfig.expiresIn,
    })
}

const _makeRefreshToken = (infoInToken) => {
    return jwt.sign(infoInToken, passportConfig.secretRefresh, {
        expiresIn: passportConfig.expiresInRefresh,
    })
}

exports.makeAndStoreToken = async (infoInToken) => {
    const accessToken = _makeAccessToken(infoInToken);
    const refreshToken = _makeRefreshToken(infoInToken);
    const now = new Date();
    await AuthToken.create({
        access_token: accessToken,
        refresh_token: refreshToken,
        f_user: infoInToken._id,
        expire_in: now.setSeconds(now.getSeconds() + passportConfig.expiresIn)
    });
    return { accessToken, refreshToken };
}

exports.randomPassword = () => {
    return crypto.randomBytes(20).toString('hex')
}

exports.makeOAuthUser = async (user) => {
    const authUser = await AuthUser.findOne({ email: user.email });
    if (authUser) {
        const infoInToken = {
            _id: authUser._id,
            email: authUser.email,
        };
        const { accessToken, refreshToken } = await makeAndStoreToken(infoInToken);
        return { user, accessToken, refreshToken };
    } else {
        const { salt, passwordHash } = await AuthUser.setPassword(crypto.randomBytes(20).toString('hex'));
        const newUser = await AuthUser.create({
            username: user.displayName,
            email: user.email,
            isActive: true,
            date_joined: new Date(),
            salt,
            password: passwordHash
        });

        const infoInToken = {
            _id: newUser._id,
            email: newUser.email,
        };

        //Generate token
        const accessAndRefresh = await makeAndStoreToken(infoInToken);
        return { user, ...accessAndRefresh };
    }
}