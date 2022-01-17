const passport = require("passport");
const router = require("express").Router();

const {
    validateSignUp,
    validateSignIn,
    validateEmail,
    validateRefreshToken
} = require("./auth.validate");

const {
    signUp,
    signIn,
    verifyEmail,
    resendVerifyEmail,
    getToken,
    makeOAuthUser
} = require("./auth.controller")

router.post("/signup", validateSignUp, signUp);

router.post("/signin", validateSignIn, signIn);

router.get("/verify/:email/:token", verifyEmail);

router.post("/verify/resend", validateEmail, resendVerifyEmail);

router.post("/get-token", validateRefreshToken, getToken);

router.get("/google", passport.authenticate("google", {
    session: false,
    scope: ['email', 'profile']
}));

router.get("/google/callback", passport.authenticate("google", {
    session: false,
    scope: ['email', 'profile']
}), makeOAuthUser)

router.get('/github', passport.authenticate('github', {
    session: false,
    scope: ['user:email']
}));

router.get('/github/callback', passport.authenticate('github', {
    session: false,
    scope: ['user:email']
}), makeOAuthUser);

module.exports = router;