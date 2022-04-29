"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDashboardUsers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var fetchDashboardUsers = /*#__PURE__*/function () {
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

            if (req.body.username !== '') {
              userOptions.username = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.username, "%"));
            }

            if (req.body.email !== '') {
              userOptions.email = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.email, "%"));
            }

            if (req.body.role !== 'All') {
              userOptions.role = req.body.role;
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
              where: userOptions
            };
            console.log(options);
            res.locals.name = 'dashboardUsers';
            _context.next = 11;
            return _models["default"].dashboardUser.count(options);

          case 11:
            res.locals.count = _context.sent;
            _context.next = 14;
            return _models["default"].dashboardUser.findAll(options);

          case 14:
            res.locals.result = _context.sent;
            console.log(res.locals.result);
            next();

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchDashboardUsers(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchDashboardUsers = fetchDashboardUsers;