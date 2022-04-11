"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchServers = exports.banServer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var banServer = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var group;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('ban server');
            _context.prev = 1;
            _context.next = 4;
            return _models["default"].group.findOne({
              where: {
                id: req.body.id
              }
            });

          case 4:
            group = _context.sent;
            _context.next = 7;
            return group.update({
              banned: !group.banned,
              banMessage: req.body.banMessage
            });

          case 7:
            res.locals.server = _context.sent;
            _context.next = 14;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            res.locals.error = _context.t0;
            console.log(_context.t0);

          case 14:
            next();

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 10]]);
  }));

  return function banServer(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.banServer = banServer;

var fetchServers = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var userOptions, options;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userOptions = {};

            if (req.body.platform !== 'all') {
              if (req.body.platform === 'telegram') {
                userOptions.groupId = (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'telegram-');
              }

              if (req.body.platform === 'discord') {
                userOptions.groupId = (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'discord-');
              }
            }

            if (req.body.id !== '') {
              userOptions.id = Number(req.body.id);
            }

            if (req.body.groupId !== '') {
              userOptions.groupId = req.body.groupId;
            }

            options = {
              order: [['id', 'DESC']],
              limit: req.body.limit,
              offset: req.body.offset,
              where: userOptions
            };
            _context2.next = 7;
            return _models["default"].group.count(options);

          case 7:
            res.locals.count = _context2.sent;
            _context2.next = 10;
            return _models["default"].group.findAll(options);

          case 10:
            res.locals.servers = _context2.sent;
            next();

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchServers(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchServers = fetchServers;