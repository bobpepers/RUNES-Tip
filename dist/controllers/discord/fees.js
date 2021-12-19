"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFee = exports.fetchFeeSchedule = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var findFee = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name, groupId, channelId) {
    var fee;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId,
                channelId: channelId
              }
            });

          case 2:
            fee = _context.sent;

            if (fee) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId
              }
            });

          case 6:
            fee = _context.sent;

          case 7:
            if (fee) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: name
              }
            });

          case 10:
            fee = _context.sent;

          case 11:
            return _context.abrupt("return", fee);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function findFee(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.findFee = findFee;

var fetchFeeSchedule = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, io) {
    var guildId,
        channelId,
        fee,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            guildId = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null;
            channelId = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : null;
            fee = {};
            _context2.next = 5;
            return findFee('reactdrop', guildId, channelId);

          case 5:
            fee.reactdrop = _context2.sent;
            _context2.next = 8;
            return findFee('soak', guildId, channelId);

          case 8:
            fee.soak = _context2.sent;
            _context2.next = 11;
            return findFee('rain', guildId, channelId);

          case 11:
            fee.rain = _context2.sent;
            _context2.next = 14;
            return findFee('voicerain', guildId, channelId);

          case 14:
            fee.voicerain = _context2.sent;
            _context2.next = 17;
            return findFee('thunder', guildId, channelId);

          case 17:
            fee.thunder = _context2.sent;
            _context2.next = 20;
            return findFee('thunderstorm', guildId, channelId);

          case 20:
            fee.thunderstorm = _context2.sent;
            _context2.next = 23;
            return findFee('hurricane', guildId, channelId);

          case 23:
            fee.hurricane = _context2.sent;
            _context2.next = 26;
            return findFee('flood', guildId, channelId);

          case 26:
            fee.flood = _context2.sent;
            _context2.next = 29;
            return findFee('sleet', guildId, channelId);

          case 29:
            fee.sleet = _context2.sent;
            _context2.next = 32;
            return findFee('withdraw', guildId, channelId);

          case 32:
            fee.withdraw = _context2.sent;
            console.log(fee);
            _context2.next = 36;
            return message.reply({
              embeds: [(0, _discord.DiscordFeeMessage)(message, fee)]
            });

          case 36:
            console.log(fee);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchFeeSchedule(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchFeeSchedule = fetchFeeSchedule;