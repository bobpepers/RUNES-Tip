"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchDeposits = exports.fetchDeposits = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _patcher = require("../../helpers/pirate/patcher");

// import { parseDomain } from "parse-domain";
var _require = require('sequelize'),
    Op = _require.Op;

var patchDeposits = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _patcher.patchPirateDeposits)();

          case 2:
            console.log('done patchDeposits');
            next();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function patchDeposits(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.patchDeposits = patchDeposits;

var fetchDeposits = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var transactionOptions, userOptions, options;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(req.body);
            transactionOptions = {
              type: 'receive'
            };
            userOptions = {};

            if (req.body.id !== '') {
              transactionOptions.id = (0, _defineProperty2["default"])({}, Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.txId !== '') {
              transactionOptions.txid = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.txId, "%"));
            }

            if (req.body.from !== '') {
              transactionOptions.to_from = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.from, "%"));
            }

            if (req.body.userId !== '') {
              userOptions.userId = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.userId, "%"));
            }

            if (req.body.username !== '') {
              userOptions.username = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.username, "%"));
            }

            options = {
              where: transactionOptions,
              order: [['id', 'DESC']],
              include: [{
                model: _models["default"].address,
                as: 'address',
                include: [{
                  model: _models["default"].wallet,
                  as: 'wallet',
                  include: [{
                    model: _models["default"].user,
                    as: 'user',
                    where: userOptions
                  }]
                }]
              }]
            };
            _context2.next = 11;
            return _models["default"].transaction.findAll(options);

          case 11:
            res.locals.deposits = _context2.sent;
            console.log(res.locals.deposits);
            next();

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchDeposits(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchDeposits = fetchDeposits;