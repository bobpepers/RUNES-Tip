"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processWithdrawal = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _rclient = require("./rclient");

var _settings = _interopRequireDefault(require("../config/settings"));

var _utils = require("../helpers/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var settings = (0, _settings["default"])();
(0, _dotenv.config)();

var processWithdrawal = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(transaction) {
    var response, responseStatus, amount, hexMemo, preResponse, opStatus;
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
            _context.next = 64;
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
            _context.next = 64;
            break;

          case 27:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 55;
              break;
            }

            _context.prev = 28;
            _context.next = 31;
            return (0, _utils.fromUtf8ToHex)(transaction.memo);

          case 31:
            hexMemo = _context.sent;
            _context.next = 34;
            return (0, _rclient.getInstance)().zSendMany(process.env.PIRATE_MAIN_ADDRESS, [_objectSpread({
              address: transaction.to_from,
              amount: amount.toFixed(8)
            }, hexMemo && {
              memo: hexMemo
            })], 1, 0.0001);

          case 34:
            preResponse = _context.sent;
            _context.next = 37;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 37:
            opStatus = _context.sent;

          case 38:
            if (!(!opStatus || opStatus[0].status === 'executing')) {
              _context.next = 46;
              break;
            }

            _context.next = 41;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 41:
            _context.next = 43;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 43:
            opStatus = _context.sent;
            _context.next = 38;
            break;

          case 46:
            response = opStatus[0].result.txid;
            _context.next = 53;
            break;

          case 49:
            _context.prev = 49;
            _context.t2 = _context["catch"](28);
            console.log(_context.t2);
            responseStatus = _context.t2.response.status;

          case 53:
            _context.next = 64;
            break;

          case 55:
            _context.prev = 55;
            _context.next = 58;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 58:
            response = _context.sent;
            _context.next = 64;
            break;

          case 61:
            _context.prev = 61;
            _context.t3 = _context["catch"](55);
            responseStatus = _context.t3.reponse.status;

          case 64:
            return _context.abrupt("return", [response, responseStatus]);

          case 65:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8], [15, 21], [28, 49], [55, 61]]);
  }));

  return function processWithdrawal(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawal = processWithdrawal;