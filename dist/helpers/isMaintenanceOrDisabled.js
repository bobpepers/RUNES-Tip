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

var _telegram = require("../messages/telegram");

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

            if (!(side === 'telegram')) {
              _context.next = 34;
              break;
            }

            if (botSetting.enabled) {
              _context.next = 21;
              break;
            }

            _context.prev = 7;
            _context.t0 = message;
            _context.next = 11;
            return (0, _telegram.telegramBotDisabledMessage)();

          case 11:
            _context.t1 = _context.sent;
            _context.next = 14;
            return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t2 = _context["catch"](7);
            console.log(_context.t2);

          case 19:
            _context.next = 34;
            break;

          case 21:
            if (!botSetting.maintenance) {
              _context.next = 34;
              break;
            }

            _context.prev = 22;
            _context.t3 = message;
            _context.next = 26;
            return (0, _telegram.telegramBotMaintenanceMessage)();

          case 26:
            _context.t4 = _context.sent;
            _context.next = 29;
            return _context.t3.replyWithHTML.call(_context.t3, _context.t4);

          case 29:
            _context.next = 34;
            break;

          case 31:
            _context.prev = 31;
            _context.t5 = _context["catch"](22);
            console.log(_context.t5);

          case 34:
            if (!(side === 'matrix')) {
              _context.next = 43;
              break;
            }

            if (botSetting.enabled) {
              _context.next = 40;
              break;
            }

            _context.next = 38;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixBotDisabledMessage)(), "123");

          case 38:
            _context.next = 43;
            break;

          case 40:
            if (!botSetting.maintenance) {
              _context.next = 43;
              break;
            }

            _context.next = 43;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixBotMaintenanceMessage)(), "123");

          case 43:
            return _context.abrupt("return", botSetting);

          case 44:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 16], [22, 31]]);
  }));

  return function isMaintenanceOrDisabled(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.isMaintenanceOrDisabled = isMaintenanceOrDisabled;