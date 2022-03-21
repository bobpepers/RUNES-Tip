"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordwaterFaucetSettings = exports.discordSettings = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var discordSettings = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, name) {
    var groupId,
        channelId,
        setting,
        capitalize,
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
            capitalize = function capitalize(s) {
              return s && s[0].toUpperCase() + s.slice(1);
            }; // Upper case first letter


            if (!(!setting.enabled && setting.channelId)) {
              _context.next = 22;
              break;
            }

            _context.next = 21;
            return message.channel.send({
              embeds: [(0, _discord.featureDisabledChannelMessage)(capitalize(name))]
            })["catch"](function (e) {
              console.log(e);
            });

          case 21:
            return _context.abrupt("return", false);

          case 22:
            if (!(!setting.enabled && setting.groupId)) {
              _context.next = 26;
              break;
            }

            _context.next = 25;
            return message.channel.send({
              embeds: [(0, _discord.featureDisabledServerMessage)(capitalize(name))]
            })["catch"](function (e) {
              console.log(e);
            });

          case 25:
            return _context.abrupt("return", false);

          case 26:
            if (setting.enabled) {
              _context.next = 30;
              break;
            }

            _context.next = 29;
            return message.channel.send({
              embeds: [(0, _discord.featureDisabledGlobalMessage)(capitalize(name))]
            })["catch"](function (e) {
              console.log(e);
            });

          case 29:
            return _context.abrupt("return", false);

          case 30:
            console.log(setting);
            return _context.abrupt("return", setting);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function discordSettings(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordSettings = discordSettings;

var discordwaterFaucetSettings = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var groupId,
        channelId,
        setting,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            groupId = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
            channelId = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
            _context2.next = 4;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: 'faucet',
                groupId: groupId,
                channelId: channelId
              }
            });

          case 4:
            setting = _context2.sent;

            if (setting) {
              _context2.next = 9;
              break;
            }

            _context2.next = 8;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: 'faucet',
                groupId: groupId,
                channelId: null
              }
            });

          case 8:
            setting = _context2.sent;

          case 9:
            if (setting) {
              _context2.next = 13;
              break;
            }

            _context2.next = 12;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'faucet'
              }
            });

          case 12:
            setting = _context2.sent;

          case 13:
            return _context2.abrupt("return", setting);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function discordwaterFaucetSettings() {
    return _ref2.apply(this, arguments);
  };
}();

exports.discordwaterFaucetSettings = discordwaterFaucetSettings;