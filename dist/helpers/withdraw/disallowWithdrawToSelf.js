"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disallowWithdrawToSelf = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var disallowWithdrawToSelf = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(address, user, t) {
    var failWithdrawalActivity, isMyAddress;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].address.findOne({
              where: {
                walletId: user.wallet.id,
                address: address
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 2:
            isMyAddress = _context.sent;

            if (!isMyAddress) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return _models["default"].activity.create({
              type: "withdraw_f",
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 6:
            failWithdrawalActivity = _context.sent;

          case 7:
            return _context.abrupt("return", failWithdrawalActivity);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function disallowWithdrawToSelf(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.disallowWithdrawToSelf = disallowWithdrawToSelf;