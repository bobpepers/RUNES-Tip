"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractWithdrawMemo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var extractWithdrawMemo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, filteredMessage) {
    var memo, regOne, regTwo, regThree, regFour;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            memo = message;
            regOne = new RegExp("".concat(filteredMessage[parseInt(0, 10)]), 's');
            regTwo = new RegExp("".concat(filteredMessage[parseInt(1, 10)]), 's');
            regThree = new RegExp("".concat(filteredMessage[parseInt(2, 10)]), 's');
            regFour = new RegExp("".concat(filteredMessage[parseInt(3, 10)]), 's');
            memo = memo.replace(regOne, "");
            memo = memo.replace(regTwo, "");
            memo = memo.replace(regThree, "");
            memo = memo.replace(regFour, "");
            memo = memo.trim();
            return _context.abrupt("return", memo);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function extractWithdrawMemo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.extractWithdrawMemo = extractWithdrawMemo;