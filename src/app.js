require("dotenv").config();
const {server, Logger} = require("./modules/core");
const mongoose = require("mongoose");
const Environment = require("./modules/core/environment");

const uri = Environment.getConfig().database.connection;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, async (error) => {
    if (error) {
        console.log("ERROR: ", error);
    } else {
        const log = Logger.Logger("mongodb");
        log.info("Connect success at: " + uri)
        await server.createServer()
    }
});
