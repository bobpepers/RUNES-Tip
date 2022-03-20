"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordLeaderboard = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var discordLeaderboard = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, io) {
    var user, activity;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(message.author.id)
              },
              include: [{
                model: _models["default"].reactdrop,
                as: 'reactdrops',
                required: false
              }, {
                model: _models["default"].flood,
                as: 'floods',
                required: false
              }]
            });

          case 2:
            user = _context.sent;
            console.log(user);

            if (user) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return");

          case 6:
            // const reactdrop = await db.reactdrop.find
            if (message.channel.type === 'DM') {
              message.author.send({
                embeds: [(0, _discord.statsMessage)(message)]
              })["catch"](function (e) {
                console.log(e);
              });
            }

            if (message.channel.type === 'GUILD_TEXT') {
              message.channel.send({
                embeds: [(0, _discord.warnDirectMessage)(message.author.id, 'Help')]
              });
              message.author.send({
                embeds: [(0, _discord.statsMessage)(message)]
              })["catch"](function (e) {
                console.log(e);
              });
            }

            return _context.abrupt("return", true);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function discordLeaderboard(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordLeaderboard = discordLeaderboard;