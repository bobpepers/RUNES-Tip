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
    var withdraw, activity, user;
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

            if (message.channel.type === 'DM') {
              message.author.send({
                embeds: [(0, _discord.helpMessage)(withdraw)]
              });
            }

            if (message.channel.type === 'GUILD_TEXT') {
              message.channel.send({
                embeds: [(0, _discord.warnDirectMessage)(message.author.id, 'Help')]
              });
              message.author.send({
                embeds: [(0, _discord.helpMessage)(withdraw)]
              });
            }

            _context.next = 8;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(message.author.id)
              }
            });

          case 8:
            user = _context.sent;

            if (user) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return");

          case 11:
            _context.next = 13;
            return _models["default"].activity.create({
              type: 'help',
              earnerId: user.id
            });

          case 13:
            activity = _context.sent;
            _context.next = 16;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 16:
            activity = _context.sent;
            io.to('admin').emit('updateActivity', {
              activity: activity
            });
            return _context.abrupt("return", true);

          case 19:
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