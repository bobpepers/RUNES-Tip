"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordHelp = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var discordHelp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, io) {
    var withdraw, activity, user, preActivity, finalActivity;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'withdraw'
              }
            });

          case 2:
            withdraw = _context.sent;
            console.log(withdraw);

            if (!(message.channel.type === 'DM')) {
              _context.next = 9;
              break;
            }

            _context.next = 7;
            return message.author.send({
              embeds: [(0, _discord.helpMessageOne)(withdraw)]
            });

          case 7:
            _context.next = 9;
            return message.author.send({
              embeds: [(0, _discord.helpMessageTwo)(withdraw)]
            });

          case 9:
            if (!(message.channel.type === 'GUILD_TEXT')) {
              _context.next = 15;
              break;
            }

            message.channel.send({
              embeds: [(0, _discord.warnDirectMessage)(message.author.id, 'Help')]
            });
            _context.next = 13;
            return message.author.send({
              embeds: [(0, _discord.helpMessageOne)(withdraw)]
            });

          case 13:
            _context.next = 15;
            return message.author.send({
              embeds: [(0, _discord.helpMessageTwo)(withdraw)]
            });

          case 15:
            activity = [];
            _context.next = 18;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(message.author.id)
              }
            });

          case 18:
            user = _context.sent;

            if (user) {
              _context.next = 21;
              break;
            }

            return _context.abrupt("return");

          case 21:
            _context.next = 23;
            return _models["default"].activity.create({
              type: 'help',
              earnerId: user.id
            });

          case 23:
            preActivity = _context.sent;
            _context.next = 26;
            return _models["default"].activity.findOne({
              where: {
                id: preActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 26:
            finalActivity = _context.sent;
            activity.unshift(finalActivity);
            io.to('admin').emit('updateActivity', {
              activity: activity
            });
            return _context.abrupt("return", true);

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function discordHelp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordHelp = discordHelp;