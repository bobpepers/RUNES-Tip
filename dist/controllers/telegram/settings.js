"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramSettings = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _telegram = require("../../messages/telegram");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var telegramSettings = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, name) {
    var groupId,
        setting,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            groupId = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            _context.next = 3;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId,
                channelId: null
              }
            });

          case 3:
            setting = _context.sent;

            if (setting) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: name
              }
            });

          case 7:
            setting = _context.sent;

          case 8:
            if (setting) {
              _context.next = 11;
              break;
            }

            ctx.reply('settings not found');
            return _context.abrupt("return", false);

          case 11:
            if (!(!setting.enabled && setting.groupId)) {
              _context.next = 14;
              break;
            }

            ctx.reply((0, _telegram.featureDisabledServerMessage)());
            return _context.abrupt("return", false);

          case 14:
            if (setting.enabled) {
              _context.next = 17;
              break;
            }

            ctx.reply((0, _telegram.featureDisabledGlobalMessage)());
            return _context.abrupt("return", false);

          case 17:
            return _context.abrupt("return", setting);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function telegramSettings(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramSettings = telegramSettings;