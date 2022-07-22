"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consolidateRunebaseFunds = consolidateRunebaseFunds;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../../models"));

var _rclient = require("../../../services/rclient");

/* eslint-disable no-restricted-syntax */
(0, _dotenv.config)();

var BN = _bignumber["default"].clone({
  DECIMAL_PLACES: 8
});

function consolidateRunebaseFunds() {
  return _consolidateRunebaseFunds.apply(this, arguments);
}

function _consolidateRunebaseFunds() {
  _consolidateRunebaseFunds = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var listUnspent, sliceTo, unspentSlice, inputs, amount, outputs, create, signed, _final, hex, txid;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _rclient.getInstance)().listUnspent();

          case 2:
            listUnspent = _context.sent;

            if (!(listUnspent.length > 1)) {
              _context.next = 25;
              break;
            }

            sliceTo = listUnspent.length > 10 ? 10 : listUnspent.length;
            unspentSlice = listUnspent.slice(0, sliceTo);
            console.log(unspentSlice);
            inputs = unspentSlice.map(function (u) {
              return {
                txid: u.txid,
                vout: u.vout
              };
            });
            amount = unspentSlice.reduce(function (prev, _ref) {
              var amount = _ref.amount;
              return prev.plus(amount);
            }, new BN(0)).toNumber();
            outputs = [(0, _defineProperty2["default"])({}, process.env.RUNEBASE_CONSOLIDATION_ADDRESS, amount)];
            _context.next = 12;
            return (0, _rclient.getInstance)().walletCreateFundedPsbt(inputs, outputs, 0, {
              changeAddress: process.env.RUNEBASE_CONSOLIDATION_ADDRESS,
              subtractFeeFromOutputs: [0]
            });

          case 12:
            create = _context.sent;
            _context.next = 15;
            return (0, _rclient.getInstance)().walletProcessPsbt(create.psbt);

          case 15:
            signed = _context.sent;
            _context.next = 18;
            return (0, _rclient.getInstance)().finalizePsbt(signed.psbt);

          case 18:
            _final = _context.sent;
            hex = _final.hex;
            _context.next = 22;
            return (0, _rclient.getInstance)().sendRawTransaction(hex);

          case 22:
            txid = _context.sent;
            _context.next = 26;
            break;

          case 25:
            console.log('No need for consolidation');

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _consolidateRunebaseFunds.apply(this, arguments);
}