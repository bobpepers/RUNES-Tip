"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMaintenanceOrDisabled = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../models"));

var isMaintenanceOrDisabled = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, side) {
    var botSetting;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].bots.findOne({
              where: {
                name: side
              }
            });

          case 2:
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

            return _context.abrupt("return", botSetting);

          case 6:
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