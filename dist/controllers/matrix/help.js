"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixHelp = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var matrixHelp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(matrixClient, message, userDirectMessageRoomId, io) {
    var withdraw, activity, user, preActivity, finalActivity;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'withdraw'
              }
            });

          case 2:
            withdraw = _context.sent;

            if (!(message.sender.roomId === userDirectMessageRoomId)) {
              _context.next = 14;
              break;
            }

            _context.prev = 4;
            _context.next = 7;
            return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.helpMessage)());

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](4);
            console.log(_context.t0);

          case 12:
            _context.next = 30;
            break;

          case 14:
            _context.prev = 14;
            _context.next = 17;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Help'));

          case 17:
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t1 = _context["catch"](14);
            console.log(_context.t1);

          case 22:
            _context.prev = 22;
            _context.next = 25;
            return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.helpMessage)());

          case 25:
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t2 = _context["catch"](22);
            console.log(_context.t2);

          case 30:
            activity = [];
            _context.next = 33;
            return _models["default"].user.findOne({
              where: {
                user_id: "matrix-".concat(message.sender.userId)
              }
            });

          case 33:
            user = _context.sent;

            if (user) {
              _context.next = 36;
              break;
            }

            return _context.abrupt("return");

          case 36:
            _context.next = 38;
            return _models["default"].activity.create({
              type: 'help',
              earnerId: user.id
            });

          case 38:
            preActivity = _context.sent;
            _context.next = 41;
            return _models["default"].activity.findOne({
              where: {
                id: preActivity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 41:
            finalActivity = _context.sent;
            activity.unshift(finalActivity);
            io.to('admin').emit('updateActivity', {
              activity: activity
            });
            return _context.abrupt("return", true);

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 9], [14, 19], [22, 27]]);
  }));

  return function matrixHelp(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixHelp = matrixHelp;