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
            _context.next = 61;
            break;

          case 14:
            if (!(settings.coin.setting === 'Komodo')) {
              _context.next = 27;
              break;
            }

            _context.prev = 15;
            _context.next = 18;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 18:
            response = _context.sent;
            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t1 = _context["catch"](15);
            console.log(_context.t1);
            responseStatus = _context.t1.reponse.status;

          case 25:
            _context.next = 61;
            break;

          case 27:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 52;
              break;
            }

            _context.prev = 28;
            _context.next = 31;
            return (0, _rclient.getInstance)().zSendMany(process.env.PIRATE_MAIN_ADDRESS, [{
              address: transaction.to_from,
              amount: amount.toFixed(8)
            }], 1, 0.0001);

          case 31:
            preResponse = _context.sent;
            _context.next = 34;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 34:
            opStatus = _context.sent;

          case 35:
            if (!(!opStatus || opStatus[0].status === 'executing')) {
              _context.next = 43;
              break;
            }

            _context.next = 38;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 38:
            _context.next = 40;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 40:
            opStatus = _context.sent;
            _context.next = 35;
            break;

          case 43:
            response = opStatus[0].result.txid;
            _context.next = 50;
            break;

          case 46:
            _context.prev = 46;
            _context.t2 = _context["catch"](28);
            responseStatus = _context.t2.response.status;
            console.log(_context.t2);

          case 50:
            _context.next = 61;
            break;

          case 52:
            _context.prev = 52;
            _context.next = 55;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 55:
            response = _context.sent;
            _context.next = 61;
            break;

          case 58:
            _context.prev = 58;
            _context.t3 = _context["catch"](52);
            responseStatus = _context.t3.reponse.status;

          case 61:
            return _context.abrupt("return", [response, responseStatus]);

          case 62:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8], [15, 21], [28, 46], [52, 58]]);
  }));

  return function processWithdrawal(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawal = processWithdrawal;