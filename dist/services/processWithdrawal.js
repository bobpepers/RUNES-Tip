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
    var response, responseStatus, amount, listUnspent, foundConsolidationRunebaseAddress, inputs, outputs, rawTransaction, signedTransaction, hexMemo, preResponse, opStatus;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            amount = (transaction.amount - Number(transaction.feeAmount)) / 1e8; // Add New Currency here (default fallback is Runebase)

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 27;
              break;
            }

            _context.prev = 2;
            _context.next = 5;
            return (0, _rclient.getInstance)().listUnspent();

          case 5:
            listUnspent = _context.sent;
            foundConsolidationRunebaseAddress = listUnspent.find(function (obj) {
              return obj.address === process.env.RUNEBASE_CONSOLIDATION_ADDRESS;
            });

            if (!(foundConsolidationRunebaseAddress && amount + 0.005 < foundConsolidationRunebaseAddress.amount)) {
              _context.next = 19;
              break;
            }

            inputs = [{
              txid: foundConsolidationRunebaseAddress.txid,
              vout: foundConsolidationRunebaseAddress.vout
            }];
            outputs = [(0, _defineProperty2["default"])({}, transaction.to_from, amount.toFixed(8).toString()), (0, _defineProperty2["default"])({}, process.env.RUNEBASE_CONSOLIDATION_ADDRESS, (foundConsolidationRunebaseAddress.amount - amount - 0.005).toFixed(8).toString())];
            _context.next = 12;
            return (0, _rclient.getInstance)().createRawTransaction(inputs, outputs);

          case 12:
            rawTransaction = _context.sent;
            _context.next = 15;
            return (0, _rclient.getInstance)().signRawTransactionWithWallet(rawTransaction);

          case 15:
            signedTransaction = _context.sent;
            _context.next = 18;
            return (0, _rclient.getInstance)().sendRawTransaction(signedTransaction.hex);

          case 18:
            response = _context.sent;

          case 19:
            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);
            responseStatus = _context.t0.reponse.status;

          case 25:
            _context.next = 77;
            break;

          case 27:
            if (!(settings.coin.setting === 'Komodo')) {
              _context.next = 40;
              break;
            }

            _context.prev = 28;
            _context.next = 31;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 31:
            response = _context.sent;
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t1 = _context["catch"](28);
            console.log(_context.t1);
            responseStatus = _context.t1.reponse.status;

          case 38:
            _context.next = 77;
            break;

          case 40:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 68;
              break;
            }

            _context.prev = 41;
            _context.next = 44;
            return (0, _utils.fromUtf8ToHex)(transaction.memo);

          case 44:
            hexMemo = _context.sent;
            _context.next = 47;
            return (0, _rclient.getInstance)().zSendMany(process.env.PIRATE_MAIN_ADDRESS, [_objectSpread({
              address: transaction.to_from,
              amount: amount.toFixed(8)
            }, hexMemo && {
              memo: hexMemo
            })], 1, 0.0001);

          case 47:
            preResponse = _context.sent;
            _context.next = 50;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 50:
            opStatus = _context.sent;

          case 51:
            if (!(!opStatus || opStatus[0].status === 'executing')) {
              _context.next = 59;
              break;
            }

            _context.next = 54;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 54:
            _context.next = 56;
            return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

          case 56:
            opStatus = _context.sent;
            _context.next = 51;
            break;

          case 59:
            response = opStatus[0].result.txid;
            _context.next = 66;
            break;

          case 62:
            _context.prev = 62;
            _context.t2 = _context["catch"](41);
            console.log(_context.t2);
            responseStatus = _context.t2.response.status;

          case 66:
            _context.next = 77;
            break;

          case 68:
            _context.prev = 68;
            _context.next = 71;
            return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

          case 71:
            response = _context.sent;
            _context.next = 77;
            break;

          case 74:
            _context.prev = 74;
            _context.t3 = _context["catch"](68);
            responseStatus = _context.t3.reponse.status;

          case 77:
            return _context.abrupt("return", [response, responseStatus]);

          case 78:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 21], [28, 34], [41, 62], [68, 74]]);
  }));

  return function processWithdrawal(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawal = processWithdrawal;