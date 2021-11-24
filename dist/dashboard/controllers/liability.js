"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchLiability = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

// import nodemailer from 'nodemailer';
// import axios from 'axios';
var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Op = _require.Op;

var _require2 = require('../../services/rclient'),
    getInstance = _require2.getInstance;

var fetchLiability = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var available, locked, unconfirmedDeposits, unconfirmledWithdrawals, sumAvailable, sumLocked, sumUnconfirmedDeposits, sumUnconfirmedWithdrawals;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            available = 0;
            locked = 0;
            unconfirmedDeposits = 0;
            unconfirmledWithdrawals = 0;
            _context.prev = 4;
            _context.next = 7;
            return _models["default"].wallet.findAll({
              attributes: [[Sequelize.fn('sum', Sequelize.col('available')), 'total_available']]
            });

          case 7:
            sumAvailable = _context.sent;
            _context.next = 10;
            return _models["default"].wallet.findAll({
              attributes: [[Sequelize.fn('sum', Sequelize.col('locked')), 'total_locked']]
            });

          case 10:
            sumLocked = _context.sent;
            _context.next = 13;
            return _models["default"].transaction.findAll({
              attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                type: 'receive'
              }, {
                phase: 'confirming'
              }])
            });

          case 13:
            sumUnconfirmedDeposits = _context.sent;
            _context.next = 16;
            return _models["default"].transaction.findAll({
              attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                type: 'send'
              }, {
                phase: 'confirming'
              }])
            });

          case 16:
            sumUnconfirmedWithdrawals = _context.sent;
            console.log(sumAvailable);
            console.log(sumLocked);
            console.log(sumUnconfirmedDeposits);
            console.log(sumUnconfirmedWithdrawals);
            available = sumAvailable[0].dataValues.total_available ? sumAvailable[0].dataValues.total_available : 0;
            locked = sumLocked[0].dataValues.total_locked ? sumLocked[0].dataValues.total_locked : 0;
            unconfirmedDeposits = sumUnconfirmedDeposits[0].dataValues.total_amount ? sumUnconfirmedDeposits[0].dataValues.total_amount : 0;
            unconfirmledWithdrawals = sumUnconfirmedWithdrawals[0].dataValues.total_amount ? sumUnconfirmedWithdrawals[0].dataValues.total_amount : 0;
            res.locals.liability = Number(available) + Number(locked) + Number(unconfirmedDeposits) - Number(unconfirmledWithdrawals);
            console.log('sumAvailable');
            console.log(available);
            console.log(locked);
            console.log(unconfirmedDeposits);
            console.log(unconfirmledWithdrawals);
            console.log(res.locals.liability); // const response = await getInstance().getWalletInfo();
            // console.log(response);
            // res.locals.balance = response.balance;
            // console.log(req.body);

            next();
            _context.next = 40;
            break;

          case 35:
            _context.prev = 35;
            _context.t0 = _context["catch"](4);
            console.log(_context.t0);
            res.locals.error = _context.t0;
            next();

          case 40:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 35]]);
  }));

  return function fetchLiability(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchLiability = fetchLiability;