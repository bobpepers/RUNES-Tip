"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordFeatureSettings = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _utils = require("../../helpers/utils");

/* eslint-disable import/prefer-default-export */
var discordFeatureSettings = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, name) {
    var groupId,
        channelId,
        setting,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            groupId = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            channelId = _args.length > 3 && _args[3] !== undefined ? _args[3] : null;
            _context.next = 4;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId,
                channelId: channelId
              }
            });

          case 4:
            setting = _context.sent;

            if (setting) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId,
                channelId: null
              }
            });

          case 8:
            setting = _context.sent;

          case 9:
            if (setting) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: name
              }
            });

          case 12:
            setting = _context.sent;

          case 13:
            if (setting) {
              _context.next = 17;
              break;
            }

            _context.next = 16;
            return message.channel.send('settings not found')["catch"](function (e) {
              console.log(e);
            });

          case 16:
            return _context.abrupt("return", false);

          case 17:
            if (!(!setting.enabled && setting.channelId)) {
              _context.next = 21;
              break;
            }

            _context.next = 20;
            return message.channel.send({
              embeds: [(0, _discord.featureDisabledChannelMessage)((0, _utils.capitalize)(name))]
            })["catch"](function (e) {
              console.log(e);
            });

          case 20:
            return _context.abrupt("return", false);

          case 21:
            if (!(!setting.enabled && setting.groupId)) {
              _context.next = 25;
              break;
            }

            _context.next = 24;
            return message.channel.send({
              embeds: [(0, _discord.featureDisabledServerMessage)((0, _utils.capitalize)(name))]
            })["catch"](function (e) {
              console.log(e);
            });

          case 24:
            return _context.abrupt("return", false);

          case 25:
            if (setting.enabled) {
              _context.next = 29;
              break;
            }

            _context.next = 28;
            return message.channel.send({
              embeds: [(0, _discord.featureDisabledGlobalMessage)((0, _utils.capitalize)(name))]
            })["catch"](function (e) {
              console.log(e);
            });

          case 28:
            return _context.abrupt("return", false);

          case 29:
            return _context.abrupt("return", setting);

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function discordFeatureSettings(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordFeatureSettings = discordFeatureSettings;