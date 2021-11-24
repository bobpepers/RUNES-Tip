"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWithdrawals = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

// import { parseDomain } from "parse-domain";
var _require = require('sequelize'),
    Op = _require.Op;

var fetchWithdrawals = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var transactionOptions, userOptions, options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.body);
            transactionOptions = {
              type: 'send'
            };
            userOptions = {};

            if (req.body.id !== '') {
              transactionOptions.id = (0, _defineProperty2["default"])({}, Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.txId !== '') {
              transactionOptions.txid = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.txId, "%"));
            }

            if (req.body.to !== '') {
              transactionOptions.to_from = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.to, "%"));
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
            _context.next = 11;
            return _models["default"].transaction.findAll(options);

          case 11:
            res.locals.withdrawals = _context.sent;
            console.log(res.locals.withdrawals);
            next();

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchWithdrawals(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchWithdrawals = fetchWithdrawals;