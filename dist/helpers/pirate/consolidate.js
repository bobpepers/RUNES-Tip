"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consolidatePirate = consolidatePirate;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _rclient = require("../../services/rclient");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(0, _dotenv.config)();

function consolidatePirate() {
  return _consolidatePirate.apply(this, arguments);
}

function _consolidatePirate() {
  _consolidatePirate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var balances, _iterator, _step, balance, sendAmount, result;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _rclient.getInstance)().zGetBalances();

          case 2:
            balances = _context.sent;
            // eslint-disable-next-line no-restricted-syntax
            _iterator = _createForOfIteratorHelper(balances);
            _context.prev = 4;

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context.next = 18;
              break;
            }

            balance = _step.value;

            if (!(balance.address !== process.env.PIRATE_MAIN_ADDRESS)) {
              _context.next = 16;
              break;
            }

            if (!(balance.unconfirmed === 0)) {
              _context.next = 16;
              break;
            }

            console.log(balance);
            sendAmount = balance.balance - 0.0001; // eslint-disable-next-line no-await-in-loop

            _context.next = 14;
            return (0, _rclient.getInstance)().zSendMany(balance.address, [{
              address: process.env.PIRATE_MAIN_ADDRESS,
              amount: sendAmount
            }], 1, 0.0001);

          case 14:
            result = _context.sent;
            console.log(result);

          case 16:
            _context.next = 6;
            break;

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](4);

            _iterator.e(_context.t0);

          case 23:
            _context.prev = 23;

            _iterator.f();

            return _context.finish(23);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 20, 23, 26]]);
  }));
  return _consolidatePirate.apply(this, arguments);
}