const passport = require("passport");

exports.passportMiddleware = passport.authenticate("jwt", {session: false}, (res) => {
    res.status(403).json("Forbidden");
});