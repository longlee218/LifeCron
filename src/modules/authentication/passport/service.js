const passportConfig = require("./config");
const {AuthUser, AuthToken} = require("../../../models");
const crypto = require("crypto");
const {ExtractJwt, Strategy} = require("passport-jwt");
const jwt = require("jsonwebtoken");


const applyPassportStrategy = (passport) => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = passportConfig.secret;
    passport.use(
        new Strategy(options, (payload, done) => {
            AuthUser.findOne({_id: payload._id, is_active: true}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, payload.user);
                }
                return done(null, false);
            });
        })
    );
};

const makeAccessToken = (infoInToken) => {
    return jwt.sign(infoInToken, passportConfig.secret, {
        expiresIn: passportConfig.expiresIn,
    })
}

const makeRefreshToken = (infoInToken) => {
    return jwt.sign(infoInToken, passportConfig.secretRefresh, {
        expiresIn: passportConfig.expiresInRefresh,
    })
}

const makeAndStoreToken = async (infoInToken) => {
    const accessToken = makeAccessToken(infoInToken);
    const refreshToken = makeRefreshToken(infoInToken);
    const now = new Date();
    await AuthToken.create({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: infoInToken._id,
        expire_in: now.setSeconds(now.getSeconds() + passportConfig.expiresIn)
    });
    return {accessToken, refreshToken};
}

const randomPassword = () => {
    return crypto.randomBytes(20).toString('hex')
}

const makeOAuthUser = async (user) => {
    const authUser = await AuthUser.findOne({email: user.email});
    if (authUser) {
        const infoInToken = {
            _id: authUser._id,
            email: authUser.email,
        };
        const {accessToken, refreshToken} = await makeAndStoreToken(infoInToken);
        return {user, accessToken, refreshToken};
    } else {
        const {salt, passwordHash} = await AuthUser.setPassword(crypto.randomBytes(20).toString('hex'));
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
        const {accessToken, refreshToken} = await makeAndStoreToken(infoInToken)
        return {user, accessToken, refreshToken};
    }
}

module.exports = {
    applyPassportStrategy,
    makeAccessToken,
    makeRefreshToken,
    makeAndStoreToken,
    randomPassword,
    makeOAuthUser
}