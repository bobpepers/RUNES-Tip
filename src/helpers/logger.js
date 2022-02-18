// var appRoot = require('app-root-path');
// import winston from "winston";
const winston = require('winston');

const options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: `./logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: `./logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// your centralized logger object
module.exports = winston.createLogger({
  transports: [
    new (winston.transports.Console)(options.console),
    new (winston.transports.File)(options.errorFile),
    new (winston.transports.File)(options.file),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// logger.info('and over your neighbors dog?');
// logger.warn('Whats great for a snack,');
// logger.error('Its log, log, log');

// export default logger;
