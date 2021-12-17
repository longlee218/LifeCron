const mongoose = require('mongoose');
const Environment = require('./environment');
const { Logger } = require('./logger');

const log = Logger("modules:core:db");
const uri = Environment.getConfig().database.connection;

log.info('Connecting to Mongodb...');
const connect = () => mongoose.connect(uri)
module.exports = { connect };