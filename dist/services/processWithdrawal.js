"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processWithdrawal = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _rclient = require("./rclient");

var _settings = _interopRequireDefault(require("../config/settings"));

var settings = (0, _settings["default"])();
(0, _dotenv.config)();

var processWithdrawal = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(transaction) {
    var response, amount, preResponse, opStatus;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            amount = (transaction.amount - Number(transaction.feeAmount)) / 1e8; // Add New Currency here (default fallback is Runebase)

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 4:
            response = _context.sent;
            _context.next = 30;
            break;

          case 7:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 27;
              break;
            }

            _context.next = 10;
            return (0, _rclient.getInstance)().zSendMany(process.env.PIRATE_MAIN_ADDRESS, [{
              address: transaction.to_from,
              amount: amount.toFixed(8)
            }], 1, 0.0001);

          case 10:
            preResponse = _context.sent;
            _context.next = 13;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 13:
            opStatus = _context.sent;

          case 14:
            if (!(!opStatus || opStatus[0].status === 'executing')) {
              _context.next = 22;
              break;
            }

            _context.next = 17;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 17:
            _context.next = 19;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 19:
            opStatus = _context.sent;
            _context.next = 14;
            break;

          case 22:
            console.log('opStatus');
            console.log(opStatus);
            response = opStatus[0].result.txid;
            _context.next = 30;
            break;

          case 27:
            _context.next = 29;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 29:
            response = _context.sent;

          case 30:
            return _context.abrupt("return", response);

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function processWithdrawal(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawal = processWithdrawal;