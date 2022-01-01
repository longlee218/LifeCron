const {AccountsModule} = require('@accounts/graphql-api');
const accountServerJWT = require('./jwt');

const authenticateAccountJSJWT = async () => {
    const accountsServer = await accountServerJWT();
    return AccountsModule.forRoot({accountsServer});
}

module.exports = {authenticateAccountJSJWT};
