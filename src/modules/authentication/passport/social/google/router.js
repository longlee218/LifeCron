const passport = require("passport");


router.get('/google', passport.authenticate('google', {
    session: false,
    scope: ['email', 'profile'],
}));

router.get('/google/callback', passport.authenticate('google', {session: false}),
    async (req, res) => {
        const {user} = req;
        return await checkOAuthUser(user, res);
    }
);
