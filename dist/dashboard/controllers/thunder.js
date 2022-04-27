"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchThunders = exports.fetchThunder = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var fetchThunders = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = {
              order: [['id', 'DESC']],
              limit: req.body.limit,
              offset: req.body.offset,
              include: [{
                model: _models["default"].user,
                as: 'user',
                attributes: ['id', 'username', 'user_id']
              }, {
                model: _models["default"].group,
                as: 'group',
                attributes: ['id', 'groupName', 'groupId']
              }]
            };
            res.locals.name = 'thunder';
            _context.next = 4;
            return _models["default"].thunder.count(options);

          case 4:
            res.locals.count = _context.sent;
            _context.next = 7;
            return _models["default"].thunder.findAll(options);

          case 7:
            res.locals.result = _context.sent;
            next();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchThunders(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchThunders = fetchThunders;

var fetchThunder = /*#__PURE__*/function () {
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
                model: _models["default"].group,
                as: 'group',
                required: false
              }, {
                model: _models["default"].channel,
                as: 'channel',
                required: false
              }, {
                model: _models["default"].user,
                as: 'user'
              }, {
                model: _models["default"].thundertip,
                as: 'thundertips',
                include: [{
                  model: _models["default"].user,
                  as: 'user',
                  include: [{
                    model: _models["default"].wallet,
                    as: 'wallet'
                  }]
                }]
              }]
            };
            res.locals.name = 'thunder';
            _context2.next = 4;
            return _models["default"].thunder.findOne(options);

          case 4:
            res.locals.result = _context2.sent;
            next();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchThunder(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchThunder = fetchThunder;