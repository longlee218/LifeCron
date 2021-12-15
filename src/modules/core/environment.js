const config = require('./config');

const getName = () => process.env.NODE_ENV || 'development'

const isTest = () => getName() === 'test';

const isDevelopment = () => getName() === 'development';

const isProduction = () => getName() === 'production';

const getConfig = () => config[getName()];

module.exports = {
    getName,
    isTest,
    isDevelopment,
    isProduction,
    getConfig
}