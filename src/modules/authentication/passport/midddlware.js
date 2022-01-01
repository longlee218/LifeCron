const passport = require("passport");

const passportMiddleware = passport.authenticate("jwt", {session: false}, (res) => {
    res.status(403).json("Forbidden");
});

module.exports = {
    passportMiddleware
}