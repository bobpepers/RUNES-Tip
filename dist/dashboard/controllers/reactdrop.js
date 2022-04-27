"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchReactdrops = exports.fetchReactdrop = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var fetchReactdrops = /*#__PURE__*/function () {
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
            res.locals.name = 'reactdrop';
            _context.next = 4;
            return _models["default"].reactdrop.count(options);

          case 4:
            res.locals.count = _context.sent;
            _context.next = 7;
            return _models["default"].reactdrop.findAll(options);

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

  return function fetchReactdrops(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchReactdrops = fetchReactdrops;

var fetchReactdrop = /*#__PURE__*/function () {
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
                model: _models["default"].reactdroptip,
                as: 'reactdroptips',
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
            res.locals.name = 'reactdrop';
            _context2.next = 4;
            return _models["default"].reactdrop.findOne(options);

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

  return function fetchReactdrop(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchReactdrop = fetchReactdrop;