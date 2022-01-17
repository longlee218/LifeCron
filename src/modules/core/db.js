const mongoose = require('mongoose');
const Environment = require('./environment');
const { Logger } = require('./logger');

const log = Logger("modules:core:db");
const uri = Environment.getConfig().database.connection;

exports.connectMongoDB = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});