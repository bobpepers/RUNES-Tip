"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchInfo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _telegram = require("../../messages/telegram");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var fetchInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx) {
    var blockHeight, priceInfo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].block.findOne({
              order: [['id', 'DESC']]
            });

          case 2:
            blockHeight = _context.sent;
            _context.next = 5;
            return _models["default"].priceInfo.findOne({
              order: [['id', 'ASC']]
            });

          case 5:
            priceInfo = _context.sent;
            ctx.replyWithHTML((0, _telegram.InfoMessage)(blockHeight.id, priceInfo));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchInfo(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchInfo = fetchInfo;