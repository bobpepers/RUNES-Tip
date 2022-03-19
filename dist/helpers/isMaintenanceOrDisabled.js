"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMaintenanceOrDisabled = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../models"));

var _matrix = require("../messages/matrix");

var isMaintenanceOrDisabled = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, side) {
    var matrixClient,
        botSetting,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            matrixClient = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            _context.next = 3;
            return _models["default"].bots.findOne({
              where: {
                name: side
              }
            });

          case 3:
            botSetting = _context.sent;

            if (side === 'discord') {
              if (!botSetting.enabled) {
                message.reply('Discord tipbot disabled');
              } else if (botSetting.maintenance) {
                message.reply('Discord tipbot maintenance');
              }
            }

            if (side === 'telegram') {
              if (!botSetting.enabled) {
                message.reply('Telegram tipbot disabled');
              } else if (botSetting.maintenance) {
                message.reply('Telegram tipbot maintenance');
              }
            }

            if (!(side === 'matrix')) {
              _context.next = 15;
              break;
            }

            if (botSetting.enabled) {
              _context.next = 12;
              break;
            }

            _context.next = 10;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixBotDisabledMessage)(), "123");

          case 10:
            _context.next = 15;
            break;

          case 12:
            if (!botSetting.maintenance) {
              _context.next = 15;
              break;
            }

            _context.next = 15;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixBotMaintenanceMessage)(), "123");

          case 15:
            return _context.abrupt("return", botSetting);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isMaintenanceOrDisabled(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.isMaintenanceOrDisabled = isMaintenanceOrDisabled;