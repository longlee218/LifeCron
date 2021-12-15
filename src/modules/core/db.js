const mongoose = require('mongoose');
const Environment = require('./environment');
const { Logger } = require('./logger');

const log = Logger("modules:core:db");
const uri = Environment.getConfig().database.connection;
log.error('Connect to Mongodb...');

module.exports = () => mongoose.connect(uri);