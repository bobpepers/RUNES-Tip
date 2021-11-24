"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchHelp = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _telegraf = require("telegraf");

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var fetchHelp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, io) {
    var activity, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(ctx.update.message.chat.type !== 'private')) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return ctx.reply("i have send you a direct message");

          case 3:
            ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.helpMessage)(), _telegraf.Markup.inlineKeyboard(_settings["default"].coin.name === 'Runebase' ? [[_telegraf.Markup.button.callback('Balance', 'Balance'), _telegraf.Markup.button.callback('Price', 'Price')], [_telegraf.Markup.button.callback('Exchanges', 'Exchanges'), _telegraf.Markup.button.callback('Deposit', 'Deposit')], [_telegraf.Markup.button.callback('Referral', 'Referral'), _telegraf.Markup.button.callback('Referral Top 10', 'ReferralTop')]] : [[_telegraf.Markup.button.callback('Balance', 'Balance'), _telegraf.Markup.button.callback('Price', 'Price')], [_telegraf.Markup.button.callback('Exchanges', 'Exchanges'), _telegraf.Markup.button.callback('Deposit', 'Deposit')]]));
            _context.next = 6;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(ctx.update.message.from.id)
              }
            });

          case 6:
            user = _context.sent;

            if (user) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return");

          case 9:
            _context.next = 11;
            return _models["default"].activity.create({
              type: 'help',
              earnerId: user.id
            });

          case 11:
            activity = _context.sent;
            _context.next = 14;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 14:
            activity = _context.sent;
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchHelp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchHelp = fetchHelp;