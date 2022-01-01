const {authenticateAccountJSJWT} = require("./accoutjs");
const passportRouter = require("./passport/router");
const {applyPassportStrategy} = require("./passport/service");

module.exports = {
    authenticateAccountJSJWT,             //  using with GraphQL Apollo
    applyPassportStrategy,
    router: passportRouter
}