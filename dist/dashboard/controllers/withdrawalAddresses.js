"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWithdrawalAddresses = exports.fetchWithdrawalAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var fetchWithdrawalAddresses = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var userOptions, options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userOptions = {};

            if (req.body.id !== '') {
              userOptions.id = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.address !== '') {
              userOptions.address = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.address, "%"));
            }

            options = {
              order: [['id', 'DESC']],
              limit: req.body.limit,
              offset: req.body.offset,
              where: userOptions,
              include: [{
                model: _models["default"].transaction,
                as: 'transactions',
                order: [['createdAt', 'DESC']],
                attributes: ['createdAt']
              }, {
                model: _models["default"].user,
                as: 'users',
                through: {
                  attributes: []
                }
              }]
            };
            res.locals.name = 'withdrawalAddresses';
            _context.next = 7;
            return _models["default"].addressExternal.count(options);

          case 7:
            res.locals.count = _context.sent;
            _context.next = 10;
            return _models["default"].addressExternal.findAll(options);

          case 10:
            res.locals.result = _context.sent;
            next();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchWithdrawalAddresses(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchWithdrawalAddresses = fetchWithdrawalAddresses;

var fetchWithdrawalAddress = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var options;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = {
              where: {
                id: req.body.id
              },
              include: [{
                model: _models["default"].transaction,
                as: 'transactions',
                order: [['createdAt', 'DESC']],
                include: [{
                  model: _models["default"].user,
                  as: 'user',
                  include: [{
                    model: _models["default"].wallet,
                    as: 'wallet'
                  }]
                }]
              }, {
                model: _models["default"].user,
                as: 'users',
                through: {
                  attributes: []
                }
              }]
            };
            res.locals.name = 'withdrawalAddress';
            _context2.next = 4;
            return _models["default"].addressExternal.count(options);

          case 4:
            res.locals.count = _context2.sent;
            _context2.next = 7;
            return _models["default"].addressExternal.findOne(options);

          case 7:
            res.locals.result = _context2.sent;
            next();

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchWithdrawalAddress(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchWithdrawalAddress = fetchWithdrawalAddress;