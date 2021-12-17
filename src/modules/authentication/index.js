const { AccountsModule } = require('@accounts/graphql-api');
const accountServerJWT = require('./access/jwt')

const authenticateJWT = async () => {
    const accountsServer = await accountServerJWT();
    return AccountsModule.forRoot({ accountsServer });
}

module.exports = {
    authenticateJWT
}