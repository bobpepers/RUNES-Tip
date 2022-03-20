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
        activity,
        user,
        preActivityFail,
        finalActivityFail,
        preActivity,
        finalActivity,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            guildId = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null;
            channelId = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : null;
            fee = {};
            activity = [];
            _context2.next = 6;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(message.author.id)
              }
            });

          case 6:
            user = _context2.sent;

            if (user) {
              _context2.next = 17;
              break;
            }

            _context2.next = 10;
            return _models["default"].activity.create({
              type: 'fees_f',
              earnerId: user.id
            });

          case 10:
            preActivityFail = _context2.sent;
            _context2.next = 13;
            return _models["default"].activity.findOne({
              where: {
                id: preActivityFail.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 13:
            finalActivityFail = _context2.sent;
            activity.unshift(finalActivityFail);
            _context2.next = 17;
            return message.author.send("User not found!")["catch"](function (e) {
              console.log(e);
            });

          case 17:
            _context2.next = 19;
            return findFee('tip', guildId, channelId);

          case 19:
            fee.tip = _context2.sent;
            _context2.next = 22;
            return findFee('reactdrop', guildId, channelId);

          case 22:
            fee.reactdrop = _context2.sent;
            _context2.next = 25;
            return findFee('trivia', guildId, channelId);

          case 25:
            fee.trivia = _context2.sent;
            _context2.next = 28;
            return findFee('soak', guildId, channelId);

          case 28:
            fee.soak = _context2.sent;
            _context2.next = 31;
            return findFee('rain', guildId, channelId);

          case 31:
            fee.rain = _context2.sent;
            _context2.next = 34;
            return findFee('voicerain', guildId, channelId);

          case 34:
            fee.voicerain = _context2.sent;
            _context2.next = 37;
            return findFee('thunder', guildId, channelId);

          case 37:
            fee.thunder = _context2.sent;
            _context2.next = 40;
            return findFee('thunderstorm', guildId, channelId);

          case 40:
            fee.thunderstorm = _context2.sent;
            _context2.next = 43;
            return findFee('hurricane', guildId, channelId);

          case 43:
            fee.hurricane = _context2.sent;
            _context2.next = 46;
            return findFee('flood', guildId, channelId);

          case 46:
            fee.flood = _context2.sent;
            _context2.next = 49;
            return findFee('sleet', guildId, channelId);

          case 49:
            fee.sleet = _context2.sent;
            _context2.next = 52;
            return findFee('withdraw', guildId, channelId);

          case 52:
            fee.withdraw = _context2.sent;
            _context2.next = 55;
            return _models["default"].activity.create({
              type: 'fees_s',
              earnerId: user.id
            });

          case 55:
            preActivity = _context2.sent;
            _context2.next = 58;
            return _models["default"].activity.findOne({
              where: {
                id: preActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 58:
            finalActivity = _context2.sent;
            activity.unshift(finalActivity);
            _context2.next = 62;
            return message.reply({
              embeds: [(0, _discord.DiscordFeeMessage)(message, fee)]
            });

          case 62:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 63:
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