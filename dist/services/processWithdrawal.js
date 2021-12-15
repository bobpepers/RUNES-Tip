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
    var response, reponseStatus, amount, preResponse, opStatus;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            amount = (transaction.amount - Number(transaction.feeAmount)) / 1e8; // Add New Currency here (default fallback is Runebase)

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 13;
              break;
            }

            _context.prev = 2;
            _context.next = 5;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 5:
            response = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            reponseStatus = _context.t0.reponse.status;

          case 11:
            _context.next = 47;
            break;

          case 13:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 38;
              break;
            }

            _context.prev = 14;
            _context.next = 17;
            return (0, _rclient.getInstance)().zSendMany(process.env.PIRATE_MAIN_ADDRESS, [{
              address: transaction.to_from,
              amount: amount.toFixed(8)
            }], 1, 0.0001);

          case 17:
            preResponse = _context.sent;
            _context.next = 20;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 20:
            opStatus = _context.sent;

          case 21:
            if (!(!opStatus || opStatus[0].status === 'executing')) {
              _context.next = 29;
              break;
            }

            _context.next = 24;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 24:
            _context.next = 26;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 26:
            opStatus = _context.sent;
            _context.next = 21;
            break;

          case 29:
            response = opStatus[0].result.txid;
            _context.next = 36;
            break;

          case 32:
            _context.prev = 32;
            _context.t1 = _context["catch"](14);
            reponseStatus = _context.t1.response.status;
            console.log(_context.t1);

          case 36:
            _context.next = 47;
            break;

          case 38:
            _context.prev = 38;
            _context.next = 41;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 41:
            response = _context.sent;
            _context.next = 47;
            break;

          case 44:
            _context.prev = 44;
            _context.t2 = _context["catch"](38);
            reponseStatus = _context.t2.reponse.status;

          case 47:
            return _context.abrupt("return", [response, reponseStatus]);

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8], [14, 32], [38, 44]]);
  }));

  return function processWithdrawal(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawal = processWithdrawal;