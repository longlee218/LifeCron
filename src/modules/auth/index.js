exports.router =  require("./auth.router");
exports.service = require("./auth.service");
exports.authenticateAccountJSJWT = require("./accountjs");
exports.authMiddleware = require("./midddlware").passportMiddleware;
exports.applyPassportStrategy = require("./auth.service").applyPassportStrategy;
