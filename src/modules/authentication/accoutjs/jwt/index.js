const { AccountsServer } = require('@accounts/server');
const { Mongo } = require('@accounts/mongo');
const { AccountsPassword } = require('@accounts/password');
const transporter = require('../../../mailer');
const database = require('../../../core/db');

module.exports = async () => {
    const accountsPassword = new AccountsPassword({
        validateUsername: (username) => username.length > 5 && /[^-\s]/.test(username),
    });

    accountsPassword.sendVerificationEmail = async (address) => {
        // This token will be got in mongodb
        const token = "82df53a6c9b533a046a26d5c5767347a46cc41da7098faafebbe5965eca5e6696ab4fd204d42e89062c7dc";
        const verifyLink = `http://127.0.0.1/verify?token=${token}`;
        await transporter.sendMail({
            from: "LifeCron Application",
            to: address,
            subject: "Reset mail",
            text: `To verify your account email please click on this link: ${verifyLink}`,
            html: `<p>To verify your account email please click on <a href="${verifyLink}" target="_blank">this link</a><p>`,
        });
    }
    accountsPassword.verifyEmail = async (token) => {

    }
    const db = await database.connect();
    const accountsMongo = new Mongo(db.connection);
    const accountsServer = new AccountsServer({
        db: accountsMongo,
        tokenSecret: process.env.TOKEN,
    }, {
        password: accountsPassword,
    });
    await accountsMongo.setupIndexes();
    return accountsServer;
}