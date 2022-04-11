"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromUtf8ToHex = exports.capitalize = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var utf8 = require('utf8');

var fromUtf8ToHex = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(str) {
    var string, hex, i, code, n;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!str) {
              _context.next = 14;
              break;
            }

            string = utf8.encode(str);
            hex = '';
            i = 0;

          case 4:
            if (!(i < string.length)) {
              _context.next = 13;
              break;
            }

            code = string.charCodeAt(i);

            if (!(code === 0)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("break", 13);

          case 8:
            n = code.toString(16);
            hex += n.length < 2 ? "0".concat(n) : n;

          case 10:
            i += 1;
            _context.next = 4;
            break;

          case 13:
            return _context.abrupt("return", "".concat(hex));

          case 14:
            return _context.abrupt("return", false);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fromUtf8ToHex(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.fromUtf8ToHex = fromUtf8ToHex;

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}; // Unused Array Shufflers, we're using Lodash array shuffler


exports.capitalize = capitalize;

function shuffle(array) {
  var currentIndex = array.length;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // eslint-disable-next-line no-param-reassign

    var _ref2 = [array[parseInt(randomIndex, 10)], array[parseInt(currentIndex, 10)]];
    array[parseInt(currentIndex, 10)] = _ref2[0];
    array[parseInt(randomIndex, 10)] = _ref2[1];
  }

  return array;
}