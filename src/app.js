require("dotenv").config();
const mongoose = require("mongoose");
const { server, database, logger } = require("./modules/core");
const { createServer } = server;
const { connectMongoDB } = database;
const { Logger } = logger;

const log = Logger("modules:core:db");

connectMongoDB
    .then((conn) => {
        log.info('Connection to Database is successful')
        return createServer();
    })
    .then(() => console.log("All db and server start success"))
    .catch(err => console.log(err));




