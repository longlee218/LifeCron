const winston = require('winston');
const {combine, timestamp, simple, colorize} = winston.format;
const Debug = require('debug');
const Environment = require('./environment');

const logger = winston.createLogger({
    format: combine(
        // timestamp(),
        // colorize()
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
        winston.format.colorize({all: true}),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [
        new winston.transports.Console({
            // format: simple(),
            level: Environment.getConfig().logger.console.level,
        })
    ],
    exitOnError: false
});

const stream = (streamFunction) => ({
    'stream': streamFunction
});

const write = (writeFunction) => ({
    write: (message) => writeFunction(message)
});

/**
 * Winston logger stream for the morgan plugin
 */
const winstonStream = stream(write(logger.info));

// Configure the debug module
process.env.DEBUG = Environment.getConfig().logger.debug;

const debug = Debug('app:response');

/**
 * Debug stream for the morgan plugin
 */
const debugStream = stream(write(debug));

/**
 * Exports a wrapper for all the loggers we use in this configuration
 */
const format = (scope, message) => `[${scope}] ${message}`;

const parse = (args) => (args.length > 0) ? args : '';

const Logger = (scope) => {
    const scopeDebug = Debug(scope);
    return {
        debug: (message, ...args) => {
            if (Environment.isProduction()) {
                logger.debug(format(scope, message), parse(args));
            }
            scopeDebug(message, parse(args));
        },
        verbose: (message, ...args) => logger.verbose(format(scope, message), parse(args)),
        silly: (message, ...args) => logger.silly(format(scope, message), parse(args)),
        info: (message, ...args) => logger.info(format(scope, message), parse(args)),
        warn: (message, ...args) => logger.warn(format(scope, message), parse(args)),
        error: (message, ...args) => logger.error(format(scope, message), parse(args))
    };
};

module.exports = {
    Logger,
    debugStream,
    winstonStream
};