"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixFeatureSettings = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

var _utils = require("../../helpers/utils");

/* eslint-disable import/prefer-default-export */
var matrixFeatureSettings = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(matrixClient, message, name) {
    var groupId,
        channelId,
        setting,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            groupId = _args.length > 3 && _args[3] !== undefined ? _args[3] : null;
            channelId = _args.length > 4 && _args[4] !== undefined ? _args[4] : null;
            console.log(message);
            console.log(name);
            console.log(groupId);
            console.log(channelId);
            _context.next = 8;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId,
                channelId: channelId
              }
            });

          case 8:
            setting = _context.sent;

            if (setting) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId,
                channelId: null
              }
            });

          case 12:
            setting = _context.sent;

          case 13:
            if (setting) {
              _context.next = 17;
              break;
            }

            _context.next = 16;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: name
              }
            });

          case 16:
            setting = _context.sent;

          case 17:
            if (setting) {
              _context.next = 21;
              break;
            }

            _context.next = 20;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.settingsNotFoundMessage)((0, _utils.capitalize)(name)));

          case 20:
            return _context.abrupt("return", false);

          case 21:
            if (!(!setting.enabled && setting.channelId)) {
              _context.next = 25;
              break;
            }

            _context.next = 24;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.featureDisabledChannelMessage)((0, _utils.capitalize)(name)));

          case 24:
            return _context.abrupt("return", false);

          case 25:
            if (!(!setting.enabled && setting.groupId)) {
              _context.next = 29;
              break;
            }

            _context.next = 28;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.featureDisabledServerMessage)((0, _utils.capitalize)(name)));

          case 28:
            return _context.abrupt("return", false);

          case 29:
            if (setting.enabled) {
              _context.next = 33;
              break;
            }

            _context.next = 32;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.featureDisabledGlobalMessage)((0, _utils.capitalize)(name)));

          case 32:
            return _context.abrupt("return", false);

          case 33:
            console.log(setting);
            return _context.abrupt("return", setting);

          case 35:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function matrixFeatureSettings(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixFeatureSettings = matrixFeatureSettings;