"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchBlockNumber = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _require = require('../../services/rclient'),
    getInstance = _require.getInstance;

var settings = (0, _settings["default"])();

var fetchBlockNumber = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var response, dbBlockNumber;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 8;
              break;
            }

            _context.next = 4;
            return getInstance().getBlockCount();

          case 4:
            response = _context.sent;
            res.locals.blockNumberNode = response;
            _context.next = 26;
            break;

          case 8:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 15;
              break;
            }

            _context.next = 11;
            return getInstance().getBlockCount();

          case 11:
            response = _context.sent;
            res.locals.blockNumberNode = response;
            _context.next = 26;
            break;

          case 15:
            if (!(settings.coin.setting === 'Dust')) {
              _context.next = 22;
              break;
            }

            _context.next = 18;
            return getInstance().getBlockCount();

          case 18:
            response = _context.sent;
            res.locals.blockNumberNode = response;
            _context.next = 26;
            break;

          case 22:
            _context.next = 24;
            return getInstance().getBlockCount();

          case 24:
            response = _context.sent;
            res.locals.blockNumberNode = response;

          case 26:
            _context.next = 28;
            return _models["default"].block.findOne({
              order: [['id', 'DESC']]
            });

          case 28:
            dbBlockNumber = _context.sent;
            res.locals.blockNumberDb = dbBlockNumber.id;
            next();
            _context.next = 38;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.locals.error = _context.t0;
            next();

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 33]]);
  }));

  return function fetchBlockNumber(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchBlockNumber = fetchBlockNumber;