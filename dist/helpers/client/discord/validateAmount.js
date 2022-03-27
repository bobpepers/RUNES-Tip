"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAmount = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../../models"));

var _discord = require("../../../messages/discord");

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

var validateAmount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, t, preAmount, user, setting, type) {
    var tipType,
        usersToTip,
        activity,
        capType,
        amount,
        noPreAmountActivity,
        minAmountActivity,
        invalidAmountActivity,
        insufActivity,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tipType = _args.length > 6 && _args[6] !== undefined ? _args[6] : null;
            usersToTip = _args.length > 7 && _args[7] !== undefined ? _args[7] : null;
            capType = capitalize(type);
            amount = 0;

            if (preAmount) {
              _context.next = 14;
              break;
            }

            _context.next = 7;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 7:
            noPreAmountActivity = _context.sent;
            _context.next = 10;
            return _models["default"].activity.findOne({
              where: {
                id: noPreAmountActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'spender'
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 10:
            activity = _context.sent;
            _context.next = 13;
            return message.channel.send({
              embeds: [(0, _discord.invalidAmountMessage)(message, capType)]
            });

          case 13:
            return _context.abrupt("return", [activity, amount]);

          case 14:
            if (preAmount.toLowerCase() === 'all') {
              amount = user.wallet.available;
            } else {
              amount = new _bignumber["default"](preAmount).times(1e8).toNumber();
            }

            if (!(amount < setting.min)) {
              _context.next = 25;
              break;
            }

            _context.next = 18;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id,
              spender_balance: user.wallet.available
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 18:
            minAmountActivity = _context.sent;
            _context.next = 21;
            return _models["default"].activity.findOne({
              where: {
                id: minAmountActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'spender'
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 21:
            activity = _context.sent;
            _context.next = 24;
            return message.channel.send({
              embeds: [(0, _discord.minimumMessage)(message, setting, capType)]
            });

          case 24:
            return _context.abrupt("return", [activity, amount]);

          case 25:
            if (tipType === 'each' && preAmount.toLowerCase() !== 'all') {
              amount *= usersToTip.length;
            }

            if (!(amount % 1 !== 0)) {
              _context.next = 36;
              break;
            }

            _context.next = 29;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id,
              spender_balance: user.wallet.available
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 29:
            invalidAmountActivity = _context.sent;
            _context.next = 32;
            return _models["default"].activity.findOne({
              where: {
                id: invalidAmountActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'spender'
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 32:
            activity = _context.sent;
            _context.next = 35;
            return message.channel.send({
              embeds: [(0, _discord.invalidAmountMessage)(message, capType)]
            });

          case 35:
            return _context.abrupt("return", [activity, amount]);

          case 36:
            if (!(amount <= 0)) {
              _context.next = 43;
              break;
            }

            _context.next = 39;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 39:
            activity = _context.sent;
            _context.next = 42;
            return message.channel.send({
              embeds: [(0, _discord.invalidAmountMessage)(message, capType)]
            });

          case 42:
            return _context.abrupt("return", [activity, amount]);

          case 43:
            if (!(user.wallet.available < amount)) {
              _context.next = 53;
              break;
            }

            _context.next = 46;
            return _models["default"].activity.create({
              type: "".concat(type, "_i"),
              spenderId: user.id,
              spender_balance: user.wallet.available,
              amount: amount
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 46:
            insufActivity = _context.sent;
            _context.next = 49;
            return _models["default"].activity.findOne({
              where: {
                id: insufActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'spender'
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 49:
            activity = _context.sent;
            _context.next = 52;
            return message.channel.send({
              embeds: [(0, _discord.insufficientBalanceMessage)(message, capType)]
            });

          case 52:
            return _context.abrupt("return", [activity, amount]);

          case 53:
            return _context.abrupt("return", [activity, amount]);

          case 54:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function validateAmount(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

exports.validateAmount = validateAmount;