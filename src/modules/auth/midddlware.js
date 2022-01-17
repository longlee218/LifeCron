const passport = require("passport");

exports.passportMiddleware = passport.authenticate("jwt", { session: false });