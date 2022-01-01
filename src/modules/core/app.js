const fs = require("fs");
const path = require("path");
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {applyPassportStrategy} = require('../authentication');
const {GoogleStrategy, GithubStrategy} = require('../authentication/passport/social');
const {resServerError} = require("../../utils/response");

exports.createServerApp = () => {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use((req, res, next) => {
        const date = new Date();
        req.requestTime = date;
        console.log(date.toLocaleString());
        next()
    })

    // Setting passport and OAuth2
    applyPassportStrategy(passport);
    passport.use('google', GoogleStrategy);
    passport.use('github', GithubStrategy);

    // Router
    const dirs = fs.readdirSync(path.join(__dirname, "..")).filter(dir => dir !== "core");
    dirs.map((dir) => {
        const modulePath = path.join(__dirname, "..", dir);
        if (fs.readdirSync(modulePath).includes("index.js")) {
            const {router} = require(modulePath);
            if (router) {
                app.use("/api/v1", router);
            }
        }
    });

    app.use((error, req, res, next) => {
        if (error) {
            resServerError(res, error.code, error.message, error);
        } else {
            next();
        }
    })

    process.on('uncaughtException', (err) => console.log(err));
    return app;
};