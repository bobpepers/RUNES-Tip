"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchHelp = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _telegraf = require("telegraf");

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _models = _interopRequireDefault(require("../../models"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var settings = (0, _settings["default"])();

var fetchHelp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, io) {
    var withdraw, activity, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(ctx.update.message.chat.type !== 'private')) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return ctx.reply("i have sent you a direct message");

          case 3:
            _context.next = 5;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'withdraw'
              }
            });

          case 5:
            withdraw = _context.sent;
            ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.helpMessage)(withdraw), _objectSpread({
              parse_mode: 'HTML'
            }, _telegraf.Markup.inlineKeyboard(settings.coin.setting === 'Runebase' ? [[_telegraf.Markup.button.callback('Balance', 'Balance'), _telegraf.Markup.button.callback('Price', 'Price')], [_telegraf.Markup.button.callback('Info', 'Info'), _telegraf.Markup.button.callback('Deposit', 'Deposit')], [_telegraf.Markup.button.callback('Referral', 'Referral'), _telegraf.Markup.button.callback('Referral Top 10', 'ReferralTop')]] : [[_telegraf.Markup.button.callback('Balance', 'Balance'), _telegraf.Markup.button.callback('Price', 'Price')], [_telegraf.Markup.button.callback('Info', 'Info'), _telegraf.Markup.button.callback('Deposit', 'Deposit')]])));
            _context.next = 9;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(ctx.update.message.from.id)
              }
            });

          case 9:
            user = _context.sent;

            if (user) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return");

          case 12:
            _context.next = 14;
            return _models["default"].activity.create({
              type: 'help',
              earnerId: user.id
            });

          case 14:
            activity = _context.sent;
            _context.next = 17;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 17:
            activity = _context.sent;
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 19:
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