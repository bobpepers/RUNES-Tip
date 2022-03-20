"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordCoinInfo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var discordCoinInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, io) {
    var blockHeight, priceInfo, activity, user, preActivity, finalActivity;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].block.findOne({
              order: [['id', 'DESC']]
            });

          case 2:
            blockHeight = _context.sent;
            _context.next = 5;
            return _models["default"].priceInfo.findOne({
              order: [['id', 'ASC']]
            });

          case 5:
            priceInfo = _context.sent;

            if (message.channel.type === 'DM') {
              message.author.send({
                embeds: [(0, _discord.coinInfoMessage)(blockHeight.id, priceInfo)]
              })["catch"](function (e) {
                console.log(e);
              });
            }

            if (message.channel.type === 'GUILD_TEXT') {
              message.channel.send({
                embeds: [(0, _discord.warnDirectMessage)(message.author.id, 'Coin Info')]
              });
              message.author.send({
                embeds: [(0, _discord.coinInfoMessage)(blockHeight.id, priceInfo)]
              })["catch"](function (e) {
                console.log(e);
              });
            }

            activity = [];
            _context.next = 11;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(message.author.id)
              }
            });

          case 11:
            user = _context.sent;
            _context.next = 14;
            return _models["default"].activity.create({
              type: 'info',
              earnerId: user.id
            });

          case 14:
            preActivity = _context.sent;
            _context.next = 17;
            return _models["default"].activity.findOne({
              where: {
                id: preActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 17:
            finalActivity = _context.sent;
            activity.unshift(finalActivity);
            io.to('admin').emit('updateActivity', {
              activity: activity
            });
            return _context.abrupt("return", true);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function discordCoinInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordCoinInfo = discordCoinInfo;