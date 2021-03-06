"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramFeatureSettings = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _telegram = require("../../messages/telegram");

var _models = _interopRequireDefault(require("../../models"));

var _utils = require("../../helpers/utils");

/* eslint-disable import/prefer-default-export */
var telegramFeatureSettings = /*#__PURE__*/function () {
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
              _context.next = 18;
              break;
            }

            _context.prev = 9;
            _context.next = 12;
            return ctx.reply('settings not found');

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](9);
            console.log(_context.t0);

          case 17:
            return _context.abrupt("return", false);

          case 18:
            if (!(!setting.enabled && setting.groupId)) {
              _context.next = 32;
              break;
            }

            _context.prev = 19;
            _context.t1 = ctx;
            _context.next = 23;
            return (0, _telegram.featureDisabledServerMessage)((0, _utils.capitalize)(name));

          case 23:
            _context.t2 = _context.sent;
            _context.next = 26;
            return _context.t1.replyWithHTML.call(_context.t1, _context.t2);

          case 26:
            _context.next = 31;
            break;

          case 28:
            _context.prev = 28;
            _context.t3 = _context["catch"](19);
            console.log(_context.t3);

          case 31:
            return _context.abrupt("return", false);

          case 32:
            if (setting.enabled) {
              _context.next = 46;
              break;
            }

            _context.prev = 33;
            _context.t4 = ctx;
            _context.next = 37;
            return (0, _telegram.featureDisabledGlobalMessage)((0, _utils.capitalize)(name));

          case 37:
            _context.t5 = _context.sent;
            _context.next = 40;
            return _context.t4.replyWithHTML.call(_context.t4, _context.t5);

          case 40:
            _context.next = 45;
            break;

          case 42:
            _context.prev = 42;
            _context.t6 = _context["catch"](33);
            console.log(_context.t6);

          case 45:
            return _context.abrupt("return", false);

          case 46:
            return _context.abrupt("return", setting);

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 14], [19, 28], [33, 42]]);
  }));

  return function telegramFeatureSettings(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramFeatureSettings = telegramFeatureSettings;