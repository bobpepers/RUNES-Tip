"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waterFaucet = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var waterFaucet = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t, fee, faucetSetting) {
    var addAmount, faucet;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            addAmount = Number((fee / 100 * (faucetSetting.fee / 1e2)).toFixed(0));
            _context.next = 3;
            return _models["default"].faucet.findOne({
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 3:
            faucet = _context.sent;
            _context.next = 6;
            return faucet.update({
              amount: faucet.amount + addAmount
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 6:
            _context.next = 8;
            return _models["default"].activity.create({
              type: 'waterFaucet',
              amount: addAmount,
              earner_balance: faucet.amount + addAmount
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function waterFaucet(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.waterFaucet = waterFaucet;