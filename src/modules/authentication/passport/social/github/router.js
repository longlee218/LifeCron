const passport = require("passport");

router.get('/github', passport.authenticate('github', {
    session: false,
    scope: ['user:email']
}));

router.get('/github/callback', passport.authenticate('github', {session: false}), async (req, res) => {
    const {user} = req;
    return await checkOAuthUser(user, res);
});
