const fs = require("fs").promises;
const path = require("path");
const cors = require('cors');
const morgan = require("morgan");
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const { applyPassportStrategy } = require('../auth');
const { GoogleStrategy, GithubStrategy } = require('../auth/o2auth');
const {Logger} = require("./index");

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

    // Setting o2auth and OAuth2
    applyPassportStrategy(passport);
    passport.use('google', GoogleStrategy);
    passport.use('github', GithubStrategy);

    const prefixAPI = "/api/v1/";

    app.get(prefixAPI, (req, res, next) => {
        res.send("Welcome to LifeCron API version 1");
        next();
    })

    // Router
    const rootPath = path.resolve();
    const modulesPath = path.join(rootPath, "src", "modules");
    const modules = await fs.readdir(modulesPath);

    modules.map(async (module) => {
        if (module !== "core") {
            const modulePath = path.join(modulesPath, module);
            const contentDir = await fs.readdir(modulePath);

            if (contentDir.includes("index.js")) {
                const { router } = require(modulePath);
                if (router) {
                    app.use(prefixAPI, router);
                }
            }
        }
    });

    app.use((error, req, res, next) => {
        res.status(error.status).json(error);
    })

    process.on('uncaughtException', (err) => console.log(err));
    return app;
};