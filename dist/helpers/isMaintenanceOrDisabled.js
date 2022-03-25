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

var _discord = require("../messages/discord");

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

            if (!(side === 'discord')) {
              _context.next = 13;
              break;
            }

            if (botSetting.enabled) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return message.reply({
              embeds: [(0, _discord.discordBotDisabledMessage)()]
            })["catch"](function (e) {
              console.log(e);
            });

          case 8:
            _context.next = 13;
            break;

          case 10:
            if (!botSetting.maintenance) {
              _context.next = 13;
              break;
            }

            _context.next = 13;
            return message.reply({
              embeds: [(0, _discord.discordBotMaintenanceMessage)()]
            })["catch"](function (e) {
              console.log(e);
            });

          case 13:
            if (!(side === 'telegram')) {
              _context.next = 42;
              break;
            }

            if (botSetting.enabled) {
              _context.next = 29;
              break;
            }

            _context.prev = 15;
            _context.t0 = message;
            _context.next = 19;
            return (0, _telegram.telegramBotDisabledMessage)();

          case 19:
            _context.t1 = _context.sent;
            _context.next = 22;
            return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

          case 22:
            _context.next = 27;
            break;

          case 24:
            _context.prev = 24;
            _context.t2 = _context["catch"](15);
            console.log(_context.t2);

          case 27:
            _context.next = 42;
            break;

          case 29:
            if (!botSetting.maintenance) {
              _context.next = 42;
              break;
            }

            _context.prev = 30;
            _context.t3 = message;
            _context.next = 34;
            return (0, _telegram.telegramBotMaintenanceMessage)();

          case 34:
            _context.t4 = _context.sent;
            _context.next = 37;
            return _context.t3.replyWithHTML.call(_context.t3, _context.t4);

          case 37:
            _context.next = 42;
            break;

          case 39:
            _context.prev = 39;
            _context.t5 = _context["catch"](30);
            console.log(_context.t5);

          case 42:
            if (!(side === 'matrix')) {
              _context.next = 51;
              break;
            }

            if (botSetting.enabled) {
              _context.next = 48;
              break;
            }

            _context.next = 46;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixBotDisabledMessage)(), "123");

          case 46:
            _context.next = 51;
            break;

          case 48:
            if (!botSetting.maintenance) {
              _context.next = 51;
              break;
            }

            _context.next = 51;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixBotMaintenanceMessage)(), "123");

          case 51:
            return _context.abrupt("return", botSetting);

          case 52:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[15, 24], [30, 39]]);
  }));

  return function isMaintenanceOrDisabled(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.isMaintenanceOrDisabled = isMaintenanceOrDisabled;