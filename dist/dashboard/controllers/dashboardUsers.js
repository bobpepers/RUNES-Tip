"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDashboardUsers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

// import { parseDomain } from "parse-domain";
var _require = require('sequelize'),
    Op = _require.Op;

var fetchDashboardUsers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var userOptions, options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userOptions = {};

            if (req.body.id !== '') {
              userOptions.id = (0, _defineProperty2["default"])({}, Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.username !== '') {
              userOptions.username = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.username, "%"));
            }

            if (req.body.email !== '') {
              userOptions.email = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.email, "%"));
            }

            if (req.body.role !== 'all') {
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
            _context.next = 9;
            return _models["default"].dashboardUser.findAll(options);

          case 9:
            res.locals.dashboardusers = _context.sent;
            console.log(res.locals.dashboardusers);
            next();

          case 12:
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