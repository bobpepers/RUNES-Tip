"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waterFaucetSettings = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../models"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var waterFaucetSettings = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var groupId,
        channelId,
        t,
        setting,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            groupId = _args.length > 0 && _args[0] !== undefined ? _args[0] : null;
            channelId = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
            t = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            _context.next = 5;
            return _models["default"].features.findOne(_objectSpread({
              where: {
                type: 'local',
                name: 'faucet',
                groupId: groupId,
                channelId: channelId
              }
            }, t && {
              lock: t.LOCK.UPDATE,
              transaction: t
            }));

          case 5:
            setting = _context.sent;

            if (setting) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return _models["default"].features.findOne(_objectSpread({
              where: {
                type: 'local',
                name: 'faucet',
                groupId: groupId,
                channelId: null
              }
            }, t && {
              lock: t.LOCK.UPDATE,
              transaction: t
            }));

          case 9:
            setting = _context.sent;

          case 10:
            if (setting) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return _models["default"].features.findOne(_objectSpread({
              where: {
                type: 'global',
                name: 'faucet'
              }
            }, t && {
              lock: t.LOCK.UPDATE,
              transaction: t
            }));

          case 13:
            setting = _context.sent;

          case 14:
            console.log(setting);
            return _context.abrupt("return", setting);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function waterFaucetSettings() {
    return _ref.apply(this, arguments);
  };
}();

exports.waterFaucetSettings = waterFaucetSettings;