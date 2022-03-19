"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchNodeStatus = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var crypto = require('crypto');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../../services/rclient'),
    getInstance = _require2.getInstance;
/**
 * insert Ip
 */


var fetchNodeStatus = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var connected, peers;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getInstance().isConnected();

          case 2:
            connected = _context.sent;
            _context.next = 5;
            return getInstance().getPeerInfo();

          case 5:
            peers = _context.sent;

            if (connected) {
              res.locals.status = connected;
            }

            if (peers) {
              res.locals.peers = peers;
            }

            next();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchNodeStatus(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchNodeStatus = fetchNodeStatus;