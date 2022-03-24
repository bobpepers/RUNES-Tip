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

var _telegram = require("../../../messages/telegram");

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
              _context.next = 15;
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
            _context.t0 = ctx;
            _context.next = 11;
            return (0, _telegram.invalidAmountMessage)();

          case 11:
            _context.t1 = _context.sent;
            _context.next = 14;
            return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

          case 14:
            return _context.abrupt("return", [activity, amount]);

          case 15:
            if (preAmount.toLowerCase() === 'all') {
              amount = user.wallet.available;
            } else {
              amount = new _bignumber["default"](preAmount).times(1e8).toNumber();
            }

            if (!(amount < Number(setting.min))) {
              _context.next = 27;
              break;
            }

            _context.next = 19;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 19:
            activity = _context.sent;
            _context.t2 = ctx;
            _context.next = 23;
            return (0, _telegram.minimumMessage)(setting, capitalize(type));

          case 23:
            _context.t3 = _context.sent;
            _context.next = 26;
            return _context.t2.replyWithHTML.call(_context.t2, _context.t3);

          case 26:
            return _context.abrupt("return", [activity, amount]);

          case 27:
            if (tipType === 'each' && preAmount.toLowerCase() !== 'all') {
              amount *= usersToTip.length;
            }

            if (!(amount % 1 !== 0)) {
              _context.next = 39;
              break;
            }

            _context.next = 31;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 31:
            activity = _context.sent;
            _context.t4 = ctx;
            _context.next = 35;
            return (0, _telegram.invalidAmountMessage)();

          case 35:
            _context.t5 = _context.sent;
            _context.next = 38;
            return _context.t4.replyWithHTML.call(_context.t4, _context.t5);

          case 38:
            return _context.abrupt("return", [activity, amount]);

          case 39:
            if (!(amount <= 0)) {
              _context.next = 50;
              break;
            }

            _context.next = 42;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 42:
            activity = _context.sent;
            _context.t6 = ctx;
            _context.next = 46;
            return (0, _telegram.invalidAmountMessage)();

          case 46:
            _context.t7 = _context.sent;
            _context.next = 49;
            return _context.t6.replyWithHTML.call(_context.t6, _context.t7);

          case 49:
            return _context.abrupt("return", [activity, amount]);

          case 50:
            if (!(user.wallet.available < amount)) {
              _context.next = 61;
              break;
            }

            _context.next = 53;
            return _models["default"].activity.create({
              type: "".concat(type, "_i"),
              spenderId: user.id,
              amount: amount
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 53:
            activity = _context.sent;
            _context.t8 = ctx;
            _context.next = 57;
            return (0, _telegram.insufficientBalanceMessage)(capType);

          case 57:
            _context.t9 = _context.sent;
            _context.next = 60;
            return _context.t8.replyWithHTML.call(_context.t8, _context.t9);

          case 60:
            return _context.abrupt("return", [activity, amount]);

          case 61:
            console.log("amount: ".concat(amount));
            return _context.abrupt("return", [activity, amount]);

          case 63:
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