"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consolidateKomodoFunds = consolidateKomodoFunds;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../../../models"));

var _rclient = require("../../../services/rclient");

/* eslint-disable no-restricted-syntax */
(0, _dotenv.config)();

function consolidateKomodoFunds() {
  return _consolidateKomodoFunds.apply(this, arguments);
}

function _consolidateKomodoFunds() {
  _consolidateKomodoFunds = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var listUnspent, consolidate;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // const transactions = await getInstance().listTransactions(1000);
            console.log('consolidating');
            _context.next = 3;
            return (0, _rclient.getInstance)().listUnspent();

          case 3:
            listUnspent = _context.sent;
            console.log(listUnspent.length);
            console.log("length");

            if (!(listUnspent.length > 1)) {
              _context.next = 11;
              break;
            }

            _context.next = 9;
            return (0, _rclient.getInstance)().zMergeToAddress(["ANY_TADDR"], process.env.KOMODO_CONSOLIDATION_ADDRESS);

          case 9:
            consolidate = _context.sent;
            console.log(consolidate);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _consolidateKomodoFunds.apply(this, arguments);
}