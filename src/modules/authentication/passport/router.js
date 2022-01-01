const router = require('express').Router();
const {
    validateSignUp,
    validateSignIn,
    validateEmail,
    validateRefreshToken
} = require('./validate');

const {
    signUp,
    signIn,
    verifyEmail,
    resendVerifyEmail,
    getToken
}  = require("./controller")

router.post("/signup", validateSignUp, signUp);

router.post("/signin", validateSignIn, signIn);

router.get("/verify/:email/:token", verifyEmail);

router.post("/verify/resend", validateEmail, resendVerifyEmail);

router.post("/get-token", validateRefreshToken, getToken);

module.exports = router;