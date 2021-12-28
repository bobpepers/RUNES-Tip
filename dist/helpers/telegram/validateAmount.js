"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAmount = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

var validateAmount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, t, preAmount, user, setting, type) {
    var tipType,
        usersToTip,
        activity,
        amount,
        capType,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tipType = _args.length > 6 && _args[6] !== undefined ? _args[6] : null;
            usersToTip = _args.length > 7 && _args[7] !== undefined ? _args[7] : null;
            amount = 0;
            capType = capitalize(type);

            if (preAmount) {
              _context.next = 10;
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
            activity = _context.sent;
            ctx.reply((0, _telegram.invalidAmountMessage)());
            return _context.abrupt("return", [activity, amount]);

          case 10:
            if (preAmount.toLowerCase() === 'all') {
              amount = user.wallet.available;
            } else {
              amount = new _bignumber["default"](preAmount).times(1e8).toNumber();
            }

            if (!(amount < Number(setting.min))) {
              _context.next = 17;
              break;
            }

            _context.next = 14;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 14:
            activity = _context.sent;
            ctx.reply((0, _telegram.minimumMessage)(setting, capitalize(type)));
            return _context.abrupt("return", [activity, amount]);

          case 17:
            if (!(amount % 1 !== 0)) {
              _context.next = 23;
              break;
            }

            _context.next = 20;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 20:
            activity = _context.sent;
            ctx.reply((0, _telegram.invalidAmountMessage)());
            return _context.abrupt("return", [activity, amount]);

          case 23:
            if (!(amount <= 0)) {
              _context.next = 29;
              break;
            }

            _context.next = 26;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 26:
            activity = _context.sent;
            ctx.reply((0, _telegram.invalidAmountMessage)());
            return _context.abrupt("return", [activity, amount]);

          case 29:
            if (!(user.wallet.available < amount)) {
              _context.next = 35;
              break;
            }

            _context.next = 32;
            return _models["default"].activity.create({
              type: "".concat(type, "_i"),
              spenderId: user.id,
              amount: amount
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 32:
            activity = _context.sent;
            ctx.reply((0, _telegram.insufficientBalanceMessage)());
            return _context.abrupt("return", [activity, amount]);

          case 35:
            console.log("amount: ".concat(amount));
            return _context.abrupt("return", [activity, amount]);

          case 37:
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