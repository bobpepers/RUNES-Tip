'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('winston'),
    createLogger = _require.createLogger,
    format = _require.format,
    transports = _require.transports,
    addColors = _require.addColors;

var combine = format.combine,
    colorize = format.colorize,
    label = format.label,
    timestamp = format.timestamp,
    json = format.json,
    prettyPrint = format.prettyPrint,
    printf = format.printf;


var myCustomFormat = format.combine(colorize({
  all: true
}), label({
  label: '[LOGGER]'
}), timestamp({
  format: 'YY-MM-DD HH:MM:SS'
}), printf(function (info) {
  return ' ' + info.label + ' ' + info.timestamp + '  ' + info.level + ' : ' + info.message;
}));

addColors({
  info: 'bold blue',
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green'
});

var logger = createLogger({
  level: 'info',
  transports: [new transports.Console({
    format: combine(myCustomFormat),
    prettyPrint: true,
    colorize: true,
    timestamp: true
  })]
});

exports.default = logger;