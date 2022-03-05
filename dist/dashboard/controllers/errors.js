"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchErrors = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _require = require('sequelize'),
    Op = _require.Op;

var fetchErrors = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var userOptions, options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userOptions = {};
            options = {
              order: [['id', 'DESC']],
              where: userOptions
            };
            _context.next = 4;
            return _models["default"].error.findAll(options);

          case 4:
            res.locals.errors = _context.sent;
            next();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchErrors(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchErrors = fetchErrors;