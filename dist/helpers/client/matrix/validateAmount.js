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

var _matrix = require("../../../messages/matrix");

var validateAmount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(matrixClient, message, t, preAmount, user, setting, type) {
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
            tipType = _args.length > 7 && _args[7] !== undefined ? _args[7] : null;
            usersToTip = _args.length > 8 && _args[8] !== undefined ? _args[8] : null;
            amount = 0;

            if (preAmount) {
              _context.next = 13;
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
            _context.next = 12;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, type));

          case 12:
            return _context.abrupt("return", [false, activity, amount]);

          case 13:
            if (preAmount.toLowerCase() === 'all') {
              amount = user.wallet.available;
            } else {
              amount = new _bignumber["default"](preAmount).times(1e8).toNumber();
            }

            if (!(amount < setting.min)) {
              _context.next = 24;
              break;
            }

            _context.next = 17;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range',
              spenderId: user.id,
              spender_balance: user.wallet.available
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 17:
            minAmountActivity = _context.sent;
            _context.next = 20;
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

          case 20:
            activity = _context.sent;
            _context.next = 23;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.minimumMessage)(message, setting, type));

          case 23:
            return _context.abrupt("return", [false, activity, amount]);

          case 24:
            if (tipType === 'each' && preAmount.toLowerCase() !== 'all') {
              amount *= usersToTip.length;
            }

            if (!(amount % 1 !== 0)) {
              _context.next = 35;
              break;
            }

            _context.next = 28;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range',
              spenderId: user.id,
              spender_balance: user.wallet.available
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 28:
            invalidAmountActivity = _context.sent;
            _context.next = 31;
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

          case 31:
            activity = _context.sent;
            _context.next = 34;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, type));

          case 34:
            return _context.abrupt("return", [false, activity, amount]);

          case 35:
            if (!(amount <= 0)) {
              _context.next = 42;
              break;
            }

            _context.next = 38;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 38:
            activity = _context.sent;
            _context.next = 41;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, type));

          case 41:
            return _context.abrupt("return", [false, activity, amount]);

          case 42:
            if (!(user.wallet.available < amount)) {
              _context.next = 52;
              break;
            }

            _context.next = 45;
            return _models["default"].activity.create({
              type: "".concat(type, "_i"),
              spenderId: user.id,
              spender_balance: user.wallet.available,
              failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range'
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 45:
            insufActivity = _context.sent;
            _context.next = 48;
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

          case 48:
            activity = _context.sent;
            _context.next = 51;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.insufficientBalanceMessage)(message, type));

          case 51:
            return _context.abrupt("return", [false, activity, amount]);

          case 52:
            return _context.abrupt("return", [true, activity, amount]);

          case 53:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function validateAmount(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.validateAmount = validateAmount;