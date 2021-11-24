"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _winston = _interopRequireDefault(require("winston"));

// var appRoot = require('app-root-path');
var options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: "./logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    // 5MB
    maxFiles: 100,
    colorize: true
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: "./logs/error.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    // 5MB
    maxFiles: 100,
    colorize: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
}; // your centralized logger object

module.exports = _winston["default"].createLogger({
  transports: [new _winston["default"].transports.Console(options.console), new _winston["default"].transports.File(options.errorFile), new _winston["default"].transports.File(options.file)],
  exitOnError: false // do not exit on handled exceptions

}); // logger.info('and over your neighbors dog?');
// logger.warn('Whats great for a snack,');
// logger.error('Its log, log, log');
// export default logger;