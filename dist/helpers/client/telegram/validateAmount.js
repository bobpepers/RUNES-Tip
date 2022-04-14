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

var validateAmount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, t, preAmount, user, setting, type) {
    var tipType,
        usersToTip,
        activity,
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
            amount = 0;

            if (preAmount) {
              _context.next = 17;
              break;
            }

            _context.next = 6;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id,
              spender_balance: user.wallet.available,
              failedAmount: 'No Amount Specified'
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 6:
            noPreAmountActivity = _context.sent;
            _context.next = 9;
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

          case 9:
            activity = _context.sent;
            _context.t0 = ctx;
            _context.next = 13;
            return (0, _telegram.invalidAmountMessage)(type);

          case 13:
            _context.t1 = _context.sent;
            _context.next = 16;
            return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

          case 16:
            return _context.abrupt("return", [false, activity, amount]);

          case 17:
            if (preAmount.toLowerCase() === 'all') {
              amount = user.wallet.available;
            } else {
              amount = new _bignumber["default"](preAmount).times(1e8).toNumber();
            }

            if (!(amount < Number(setting.min))) {
              _context.next = 32;
              break;
            }

            _context.next = 21;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range',
              spenderId: user.id,
              spender_balance: user.wallet.available
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 21:
            minAmountActivity = _context.sent;
            _context.next = 24;
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

          case 24:
            activity = _context.sent;
            _context.t2 = ctx;
            _context.next = 28;
            return (0, _telegram.minimumMessage)(setting, type);

          case 28:
            _context.t3 = _context.sent;
            _context.next = 31;
            return _context.t2.replyWithHTML.call(_context.t2, _context.t3);

          case 31:
            return _context.abrupt("return", [false, activity, amount]);

          case 32:
            if (tipType === 'each' && preAmount.toLowerCase() !== 'all' // Perhaps remove preAmount.toLowerCase() !== 'all and make tip amount invalidate when casting "all" and "each" instead of splitting up all available balance
            ) {
              amount *= usersToTip.length;
            }

            if (!(amount % 1 !== 0)) {
              _context.next = 47;
              break;
            }

            _context.next = 36;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range',
              spenderId: user.id,
              spender_balance: user.wallet.available
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 36:
            invalidAmountActivity = _context.sent;
            _context.next = 39;
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

          case 39:
            activity = _context.sent;
            _context.t4 = ctx;
            _context.next = 43;
            return (0, _telegram.invalidAmountMessage)(type);

          case 43:
            _context.t5 = _context.sent;
            _context.next = 46;
            return _context.t4.replyWithHTML.call(_context.t4, _context.t5);

          case 46:
            return _context.abrupt("return", [false, activity, amount]);

          case 47:
            if (!(amount <= 0)) {
              _context.next = 58;
              break;
            }

            _context.next = 50;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 50:
            activity = _context.sent;
            _context.t6 = ctx;
            _context.next = 54;
            return (0, _telegram.invalidAmountMessage)(type);

          case 54:
            _context.t7 = _context.sent;
            _context.next = 57;
            return _context.t6.replyWithHTML.call(_context.t6, _context.t7);

          case 57:
            return _context.abrupt("return", [false, activity, amount]);

          case 58:
            if (!(user.wallet.available < amount)) {
              _context.next = 72;
              break;
            }

            _context.next = 61;
            return _models["default"].activity.create({
              type: "".concat(type, "_i"),
              spenderId: user.id,
              spender_balance: user.wallet.available,
              failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range'
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 61:
            insufActivity = _context.sent;
            _context.next = 64;
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

          case 64:
            activity = _context.sent;
            _context.t8 = ctx;
            _context.next = 68;
            return (0, _telegram.insufficientBalanceMessage)(type);

          case 68:
            _context.t9 = _context.sent;
            _context.next = 71;
            return _context.t8.replyWithHTML.call(_context.t8, _context.t9);

          case 71:
            return _context.abrupt("return", [false, activity, amount]);

          case 72:
            return _context.abrupt("return", [true, activity, amount]);

          case 73:
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