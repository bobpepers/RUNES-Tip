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
    var response, responseStatus, amount, preResponse, opStatus;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            amount = (transaction.amount - Number(transaction.feeAmount)) / 1e8; // Add New Currency here (default fallback is Runebase)

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 14;
              break;
            }

            _context.prev = 2;
            _context.next = 5;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 5:
            response = _context.sent;
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);
            responseStatus = _context.t0.reponse.status;

          case 12:
            _context.next = 48;
            break;

          case 14:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 39;
              break;
            }

            _context.prev = 15;
            _context.next = 18;
            return (0, _rclient.getInstance)().zSendMany(process.env.PIRATE_MAIN_ADDRESS, [{
              address: transaction.to_from,
              amount: amount.toFixed(8)
            }], 1, 0.0001);

          case 18:
            preResponse = _context.sent;
            _context.next = 21;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 21:
            opStatus = _context.sent;

          case 22:
            if (!(!opStatus || opStatus[0].status === 'executing')) {
              _context.next = 30;
              break;
            }

            _context.next = 25;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 25:
            _context.next = 27;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 27:
            opStatus = _context.sent;
            _context.next = 22;
            break;

          case 30:
            response = opStatus[0].result.txid;
            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t1 = _context["catch"](15);
            responseStatus = _context.t1.response.status;
            console.log(_context.t1);

          case 37:
            _context.next = 48;
            break;

          case 39:
            _context.prev = 39;
            _context.next = 42;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 42:
            response = _context.sent;
            _context.next = 48;
            break;

          case 45:
            _context.prev = 45;
            _context.t2 = _context["catch"](39);
            responseStatus = _context.t2.reponse.status;

          case 48:
            return _context.abrupt("return", [response, responseStatus]);

          case 49:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8], [15, 33], [39, 45]]);
  }));

  return function processWithdrawal(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawal = processWithdrawal;