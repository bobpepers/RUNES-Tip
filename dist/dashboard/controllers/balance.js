"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchBalance = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _rclient = require("../../services/rclient");

var settings = (0, _settings["default"])();

var fetchBalance = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.locals.name = 'balance';

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 8;
              break;
            }

            _context.next = 4;
            return (0, _rclient.getInstance)().getWalletInfo();

          case 4:
            response = _context.sent;
            res.locals.result = {
              amount: response.balance
            };
            _context.next = 19;
            break;

          case 8:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 15;
              break;
            }

            _context.next = 11;
            return (0, _rclient.getInstance)().zGetBalances();

          case 11:
            response = _context.sent;
            res.locals.result = {
              amount: response.reduce(function (n, _ref2) {
                var balance = _ref2.balance;
                return n + balance;
              }, 0)
            };
            _context.next = 19;
            break;

          case 15:
            _context.next = 17;
            return (0, _rclient.getInstance)().getWalletInfo();

          case 17:
            response = _context.sent;
            res.locals.result = {
              amount: response.balance
            };

          case 19:
            next();

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchBalance(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchBalance = fetchBalance;