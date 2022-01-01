require('dotenv').config();
const { server, database, Logger } = require('./modules/core');

const log = Logger.Logger("start app");
Promise.resolve(() => database.connect())
    .then(() => server.createServer())
    .catch((error) => log.error("This is bug: ", error));
