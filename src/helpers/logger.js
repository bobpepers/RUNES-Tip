const {
  createLogger, format, transports, addColors,
} = require('winston');

const {
  combine, colorize, label, timestamp, json, prettyPrint, printf,
} = format;

const myCustomFormat = format.combine(
  colorize({
    all: true,
  }),
  label({
    label: '[LOGGER]',
  }),
  timestamp({
    format: 'YY-MM-DD HH:MM:SS',
  }),
  printf((info) => ` ${info.label} ${info.timestamp}  ${info.level} : ${info.message}`),
);

addColors({
  info: 'bold blue',
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green',
});

const logger = createLogger({
  level: 'info',
  transports: [new transports.Console({
    format: combine(myCustomFormat),
    prettyPrint: true,
    colorize: true,
    timestamp: true,
  })],
});

export default logger;
