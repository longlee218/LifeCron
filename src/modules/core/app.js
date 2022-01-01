const fs = require("fs");
const path = require("path");
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {applyPassportStrategy} = require('../authentication');
const {GoogleStrategy, GithubStrategy} = require('../authentication/passport/social');

exports.createServerApp = async () => {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));


    // Setting passport and OAuth2
    applyPassportStrategy(passport);
    passport.use('google', GoogleStrategy);
    passport.use('github', GithubStrategy);

    const dirs = fs.readdirSync(path.join(__dirname, "..")).filter(dir => dir !== "core");
    dirs.map((dir) => {
        const modulePath = path.join(__dirname, "..", dir);
        if (fs.readdirSync(modulePath).includes("index.js")) {
            const {router} = require(modulePath);
            if (router) {
                app.use("api/v1", router);
            }
        }
    });

    // app.use((req, res, route, err) => {
    //   const log = Logger.Logger("error");
    //   log.error(err);
    //   switch (err.type) {
    //     case 'redirect':
    //       res.redirect('/error');
    //       break;
    //     case 'time-out':
    //       return generateServerErrorCode(res, 408, "TIME_OUT", err?.message, err.fileName);
    //     default:
    //       return generateServerErrorCode(res, 500, "INTERNAL_SERVER_ERROR", err?.message, err.fileName);
    //   }
    // });
    process.on('uncaughtException', (err) => console.log(err));
    return app;
};