"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = exports.fetchAdminNodeBalance = exports.fetchAdminLiability = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _models = _interopRequireDefault(require("../../models"));

// import axios from 'axios';
var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../../services/rclient'),
    getInstance = _require2.getInstance;

require('dotenv').config();

var transporter = _nodemailer["default"].createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  // use SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    requireTLS: true
  }
});

var fetchAdminLiability = /*#__PURE__*/function () {
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

  return function fetchAdminLiability(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchAdminLiability = fetchAdminLiability;

var fetchAdminNodeBalance = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return getInstance().getWalletInfo();

          case 3:
            response = _context2.sent;
            console.log(response);
            res.locals.balance = response.balance; // console.log(req.body);

            next();
            _context2.next = 14;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.locals.error = _context2.t0;
            next();

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));

  return function fetchAdminNodeBalance(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * isAdmin
 */


exports.fetchAdminNodeBalance = fetchAdminNodeBalance;

var isAdmin = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('req.user.role');
            console.log(req.user.role);

            if (req.user.role !== 4 && req.user.role !== 8) {
              console.log('unauthorized');
              res.status(401).send({
                error: 'Unauthorized'
              });
            } else {
              next();
            }

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function isAdmin(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.isAdmin = isAdmin;