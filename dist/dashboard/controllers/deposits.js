"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchDeposits = exports.fetchDeposits = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _patcher = require("../../helpers/blockchain/pirate/patcher");

var _patcher2 = require("../../helpers/blockchain/runebase/patcher");

var _patcher3 = require("../../helpers/blockchain/komodo/patcher");

var _settings = _interopRequireDefault(require("../../config/settings"));

// import { parseDomain } from "parse-domain";
var settings = (0, _settings["default"])();

var patchDeposits = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 5;
              break;
            }

            _context.next = 3;
            return (0, _patcher2.patchRunebaseDeposits)();

          case 3:
            _context.next = 17;
            break;

          case 5:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return (0, _patcher.patchPirateDeposits)();

          case 8:
            _context.next = 17;
            break;

          case 10:
            if (!(settings.coin.setting === 'Komodo')) {
              _context.next = 15;
              break;
            }

            _context.next = 13;
            return (0, _patcher3.patchKomodoDeposits)();

          case 13:
            _context.next = 17;
            break;

          case 15:
            _context.next = 17;
            return (0, _patcher2.patchRunebaseDeposits)();

          case 17:
            res.locals.result = 'true';
            next();

          case 19:
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
            transactionOptions = {
              type: 'receive'
            };
            userOptions = {};

            if (req.body.id !== '') {
              transactionOptions.id = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.txId !== '') {
              transactionOptions.txid = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.txId, "%"));
            }

            if (req.body.from !== '') {
              transactionOptions.to_from = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.from, "%"));
            }

            if (req.body.userId !== '') {
              userOptions.user_id = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.userId, "%"));
            }

            if (req.body.username !== '') {
              userOptions.username = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.username, "%"));
            }

            options = {
              where: transactionOptions,
              limit: req.body.limit,
              offset: req.body.offset,
              order: [['id', 'DESC']],
              include: [{
                model: _models["default"].user,
                as: 'user',
                where: userOptions
              }, {
                model: _models["default"].address,
                as: 'address',
                include: [{
                  model: _models["default"].wallet,
                  as: 'wallet'
                }]
              }]
            };
            res.locals.name = 'deposit';
            _context2.next = 11;
            return _models["default"].transaction.count(options);

          case 11:
            res.locals.count = _context2.sent;
            _context2.next = 14;
            return _models["default"].transaction.findAll(options);

          case 14:
            res.locals.result = _context2.sent;
            next();

          case 16:
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