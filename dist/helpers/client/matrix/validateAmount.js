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
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tipType = _args.length > 7 && _args[7] !== undefined ? _args[7] : null;
            usersToTip = _args.length > 8 && _args[8] !== undefined ? _args[8] : null;
            amount = 0;

            if (preAmount) {
              _context.next = 10;
              break;
            }

            _context.next = 6;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 6:
            activity = _context.sent;
            _context.next = 9;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, type));

          case 9:
            return _context.abrupt("return", [activity, amount]);

          case 10:
            if (preAmount.toLowerCase() === 'all') {
              amount = user.wallet.available;
            } else {
              amount = new _bignumber["default"](preAmount).times(1e8).toNumber();
            }

            if (!(amount < setting.min)) {
              _context.next = 18;
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
            _context.next = 17;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.minimumMessage)(message, setting, type));

          case 17:
            return _context.abrupt("return", [activity, amount]);

          case 18:
            if (tipType === 'each' && preAmount.toLowerCase() !== 'all') {
              amount *= usersToTip.length;
            }

            if (!(amount % 1 !== 0)) {
              _context.next = 26;
              break;
            }

            _context.next = 22;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 22:
            activity = _context.sent;
            _context.next = 25;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, type));

          case 25:
            return _context.abrupt("return", [activity, amount]);

          case 26:
            if (!(amount <= 0)) {
              _context.next = 33;
              break;
            }

            _context.next = 29;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 29:
            activity = _context.sent;
            _context.next = 32;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, type));

          case 32:
            return _context.abrupt("return", [activity, amount]);

          case 33:
            if (!(user.wallet.available < amount)) {
              _context.next = 40;
              break;
            }

            _context.next = 36;
            return _models["default"].activity.create({
              type: "".concat(type, "_i"),
              spenderId: user.id,
              amount: amount
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 36:
            activity = _context.sent;
            _context.next = 39;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.insufficientBalanceMessage)(message, type));

          case 39:
            return _context.abrupt("return", [activity, amount]);

          case 40:
            return _context.abrupt("return", [activity, amount]);

          case 41:
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