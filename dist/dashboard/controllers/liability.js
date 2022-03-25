"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchLiability = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var fetchLiability = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var available, locked, runningReactdrops, runningTrivia, unconfirmedDeposits, unconfirmledWithdrawals, faucetAmount, sumAvailable, sumLocked, sumUnconfirmedDeposits, sumUnconfirmedWithdrawals, sumRunningReactdrops, sumRunningTrivia, faucet;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            available = 0;
            locked = 0;
            runningReactdrops = 0;
            runningTrivia = 0;
            unconfirmedDeposits = 0;
            unconfirmledWithdrawals = 0;
            faucetAmount = 0;
            _context.prev = 7;
            _context.next = 10;
            return _models["default"].wallet.findAll({
              attributes: [[_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.col('available')), 'total_available']]
            });

          case 10:
            sumAvailable = _context.sent;
            _context.next = 13;
            return _models["default"].wallet.findAll({
              attributes: [[_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.col('locked')), 'total_locked']]
            });

          case 13:
            sumLocked = _context.sent;
            _context.next = 16;
            return _models["default"].transaction.findAll({
              attributes: [[_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.col('amount')), 'total_amount']],
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                type: 'receive'
              }, {
                phase: 'confirming'
              }])
            });

          case 16:
            sumUnconfirmedDeposits = _context.sent;
            _context.next = 19;
            return _models["default"].transaction.findAll({
              attributes: [[_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.col('amount')), 'total_amount']],
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                type: 'send'
              }, {
                phase: 'confirming'
              }])
            });

          case 19:
            sumUnconfirmedWithdrawals = _context.sent;
            _context.next = 22;
            return _models["default"].reactdrop.findAll({
              attributes: [[_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.col('amount')), 'total_amount']],
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                ended: false
              }])
            });

          case 22:
            sumRunningReactdrops = _context.sent;
            _context.next = 25;
            return _models["default"].trivia.findAll({
              attributes: [[_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.col('amount')), 'total_amount']],
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                ended: false
              }])
            });

          case 25:
            sumRunningTrivia = _context.sent;
            _context.next = 28;
            return _models["default"].faucet.findOne();

          case 28:
            faucet = _context.sent;
            console.log(faucet);
            console.log('faucet');
            faucetAmount = faucet.amount ? faucet.amount : 0;
            available = sumAvailable[0].dataValues.total_available ? sumAvailable[0].dataValues.total_available : 0;
            locked = sumLocked[0].dataValues.total_locked ? sumLocked[0].dataValues.total_locked : 0;
            unconfirmedDeposits = sumUnconfirmedDeposits[0].dataValues.total_amount ? sumUnconfirmedDeposits[0].dataValues.total_amount : 0;
            unconfirmledWithdrawals = sumUnconfirmedWithdrawals[0].dataValues.total_amount ? sumUnconfirmedWithdrawals[0].dataValues.total_amount : 0;
            runningReactdrops = sumRunningReactdrops[0].dataValues.total_amount ? sumRunningReactdrops[0].dataValues.total_amount : 0;
            runningTrivia = sumRunningTrivia[0].dataValues.total_amount ? sumRunningTrivia[0].dataValues.total_amount : 0;
            res.locals.liability = Number(available) + Number(locked) + Number(unconfirmedDeposits) - Number(unconfirmledWithdrawals) + Number(runningTrivia) + Number(runningReactdrops) + Number(faucetAmount);
            next();
            _context.next = 47;
            break;

          case 42:
            _context.prev = 42;
            _context.t0 = _context["catch"](7);
            console.log(_context.t0);
            res.locals.error = _context.t0;
            next();

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 42]]);
  }));

  return function fetchLiability(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchLiability = fetchLiability;