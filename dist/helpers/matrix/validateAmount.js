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

var _matrix = require("../../messages/matrix");

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

var validateAmount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(matrixClient, message, t, preAmount, user, setting, type) {
    var tipType,
        usersToTip,
        activity,
        capType,
        amount,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tipType = _args.length > 7 && _args[7] !== undefined ? _args[7] : null;
            usersToTip = _args.length > 8 && _args[8] !== undefined ? _args[8] : null;
            capType = capitalize(type);
            amount = 0;

            if (preAmount) {
              _context.next = 11;
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
            _context.next = 10;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, capType));

          case 10:
            return _context.abrupt("return", [activity, amount]);

          case 11:
            if (preAmount.toLowerCase() === 'all') {
              amount = user.wallet.available;
            } else {
              amount = new _bignumber["default"](preAmount).times(1e8).toNumber();
            }

            if (!(amount < setting.min)) {
              _context.next = 19;
              break;
            }

            _context.next = 15;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 15:
            activity = _context.sent;
            _context.next = 18;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.minimumMessage)(message, setting, capType));

          case 18:
            return _context.abrupt("return", [activity, amount]);

          case 19:
            if (tipType === 'each' && preAmount.toLowerCase() !== 'all') {
              amount *= usersToTip.length;
            }

            if (!(amount % 1 !== 0)) {
              _context.next = 27;
              break;
            }

            _context.next = 23;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 23:
            activity = _context.sent;
            _context.next = 26;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, capType));

          case 26:
            return _context.abrupt("return", [activity, amount]);

          case 27:
            if (!(amount <= 0)) {
              _context.next = 34;
              break;
            }

            _context.next = 30;
            return _models["default"].activity.create({
              type: "".concat(type, "_f"),
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 30:
            activity = _context.sent;
            _context.next = 33;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAmountMessage)(message, capType));

          case 33:
            return _context.abrupt("return", [activity, amount]);

          case 34:
            if (!(user.wallet.available < amount)) {
              _context.next = 41;
              break;
            }

            _context.next = 37;
            return _models["default"].activity.create({
              type: "".concat(type, "_i"),
              spenderId: user.id,
              amount: amount
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 37:
            activity = _context.sent;
            _context.next = 40;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.insufficientBalanceMessage)(message, capType));

          case 40:
            return _context.abrupt("return", [activity, amount]);

          case 41:
            console.log("amount: ".concat(amount));
            return _context.abrupt("return", [activity, amount]);

          case 43:
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