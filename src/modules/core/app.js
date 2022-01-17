const path = require("path");
const cors = require('cors');
const morgan = require("morgan");
const fs = require("fs");
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const { applyPassportStrategy } = require('../auth');
const { GoogleStrategy, GithubStrategy } = require('../auth/o2auth');
const { Logger } = require("./index");
const rootPath = path.resolve();

exports.createServerApp = async () => {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use((req, res, next) => {
        req.requestTime = new Date();
        next()
    })

    // Morgan
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms", {
        write: (message) => Logger.Logger.info(message)
    }));

    // Setting OAuth2
    applyPassportStrategy(passport);
    passport.use('google', GoogleStrategy);
    passport.use('github', GithubStrategy);

    const prefixAPI = process.env.API_PREFIX || "/api/v1/";

    app.get(prefixAPI, (req, res, next) => {
        res.send("Welcome to LifeCron API version 1");
        next();
    })

    // Router
    const modulesPath = path.join(rootPath, "src", "modules");
    const modules = fs.readdirSync(modulesPath);

    modules.map(module => {
        const modulePath = path.join(modulesPath, module);
        const contentDir = fs.readdirSync(modulePath);
        if (contentDir.includes("index.js")) {
            const { router } = require(modulePath);
            if (router) {
                app.use(prefixAPI, router);
            }
        }
    })

    // HandleError
    app.use((error, req, res, next) => {
        res.status(500).json(error);
    })

    process.on('uncaughtException', (err) => { });
    return app;
};