require('dotenv').config();
const { server, db, Logger } = require('./modules/core');

const log = Logger("start app");
Promise.resolve(db())
    .then(server.createServer())
    .catch((error) => log.error(error));
