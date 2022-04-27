"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUsers = exports.banUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var banUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].user.findOne({
              where: {
                id: req.body.id
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet'
              }]
            });

          case 2:
            user = _context.sent;
            res.locals.name = 'banUser';
            _context.next = 6;
            return user.update({
              banned: !user.banned,
              banMessage: req.body.banMessage
            });

          case 6:
            res.locals.result = _context.sent;
            next();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function banUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.banUser = banUser;

var fetchUsers = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var userOptions, options;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userOptions = {};

            if (req.body.id !== '') {
              userOptions.id = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.userId !== '') {
              userOptions.user_id = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.userId, "%"));
            }

            if (req.body.username !== '') {
              userOptions.username = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.username, "%"));
            }

            if (req.body.platform !== 'all') {
              if (req.body.platform === 'telegram') {
                userOptions.user_id = (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'telegram-');
              }

              if (req.body.platform === 'discord') {
                userOptions.user_id = (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'discord-');
              }
            }

            if (req.body.banned !== 'all') {
              if (req.body.banned === 'true') {
                userOptions.banned = true;
              }

              if (req.body.banned === 'false') {
                userOptions.banned = false;
              }
            }

            options = {
              order: [['id', 'DESC']],
              limit: req.body.limit,
              offset: req.body.offset,
              where: userOptions,
              include: [{
                model: _models["default"].wallet,
                as: 'wallet'
              }]
            };
            res.locals.name = 'user';
            _context2.next = 10;
            return _models["default"].user.count(options);

          case 10:
            res.locals.count = _context2.sent;
            _context2.next = 13;
            return _models["default"].user.findAll(options);

          case 13:
            res.locals.result = _context2.sent;
            next();

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchUsers(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchUsers = fetchUsers;