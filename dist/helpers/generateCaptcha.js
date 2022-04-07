"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCaptcha = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sharp = _interopRequireDefault(require("sharp"));

var _svgCaptcha = _interopRequireDefault(require("svg-captcha"));

var _algebraicCaptcha = require("algebraic-captcha");

var backgroundArray = ['#cc9966', '#ffffff', "#FF5733", "#33FFE6", "#272F92 ", "#882792", "#922759"];
var captchaTypeArray = ['svg', 'algebraic'];

var generateCaptcha = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var captcha, captchaImage, captchaText, captchaType, randomFunc, randomBackground, modes, preCaptcha;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            randomFunc = captchaTypeArray[Math.floor(Math.random() * captchaTypeArray.length)];
            randomBackground = backgroundArray[Math.floor(Math.random() * backgroundArray.length)];

            if (!(randomFunc === 'svg')) {
              _context.next = 9;
              break;
            }

            while (!captcha || Number(captcha.text) < 0) {
              captcha = _svgCaptcha["default"].createMathExpr({
                mathMin: 0,
                mathMax: 9,
                mathOperator: '+-',
                background: randomBackground,
                noise: 15,
                color: true
              });
            }

            captchaType = 'svg';
            captchaText = captcha.text;
            _context.next = 8;
            return (0, _sharp["default"])(Buffer.from("".concat(captcha.data).trim())).resize(450, 150).png().toBuffer();

          case 8:
            captchaImage = _context.sent;

          case 9:
            if (!(randomFunc === 'algebraic')) {
              _context.next = 23;
              break;
            }

            modes = ['formula', 'equation'];

          case 11:
            if (!(!captcha || Number(captcha.answer) < 0)) {
              _context.next = 18;
              break;
            }

            preCaptcha = new _algebraicCaptcha.AlgebraicCaptcha({
              width: 150,
              height: 50,
              background: randomBackground,
              noise: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
              minValue: 1,
              maxValue: 9,
              operandAmount: Math.floor(Math.random() * 2 + 1),
              operandTypes: ['+', '-'],
              mode: modes[Math.round(Math.random())],
              targetSymbol: '?'
            }); // eslint-disable-next-line no-await-in-loop

            _context.next = 15;
            return preCaptcha.generateCaptcha();

          case 15:
            captcha = _context.sent;
            _context.next = 11;
            break;

          case 18:
            captchaType = 'algebraic';
            captchaText = captcha.answer.toString();
            _context.next = 22;
            return (0, _sharp["default"])(Buffer.from("".concat(captcha.image).trim())).resize(450, 150).png().toBuffer();

          case 22:
            captchaImage = _context.sent;

          case 23:
            return _context.abrupt("return", [captchaImage, captchaText, captchaType]);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function generateCaptcha() {
    return _ref.apply(this, arguments);
  };
}();

exports.generateCaptcha = generateCaptcha;