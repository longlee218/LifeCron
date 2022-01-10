const {AccountsModule} = require('@accounts/graphql-api');
const accountServerJWT = require('./jwt');

module.exports = async () => {
    const accountsServer = await accountServerJWT();
    return AccountsModule.forRoot({accountsServer});
}