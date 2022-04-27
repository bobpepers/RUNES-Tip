"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBotSettings = exports.fetchBotSettings = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var updateBotSettings = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var settings;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].bots.findOne({
              where: {
                id: req.body.id
              }
            });

          case 2:
            settings = _context.sent;

            if (settings) {
              _context.next = 5;
              break;
            }

            throw new Error("Settings doesn't Exists");

          case 5:
            res.locals.name = "updateBotSettings";
            _context.next = 8;
            return settings.update({
              enabled: req.body.enabled,
              maintenance: req.body.maintenance
            });

          case 8:
            res.locals.result = _context.sent;
            next();

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function updateBotSettings(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateBotSettings = updateBotSettings;

var fetchBotSettings = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.locals.name = 'botSettings';
            _context2.next = 3;
            return _models["default"].bots.count();

          case 3:
            res.locals.count = _context2.sent;
            _context2.next = 6;
            return _models["default"].bots.findAll();

          case 6:
            res.locals.result = _context2.sent;
            next();

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchBotSettings(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchBotSettings = fetchBotSettings;