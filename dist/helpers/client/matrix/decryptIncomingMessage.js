"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decryptIncomingMessage = void 0;
exports.verifyDevice = verifyDevice;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function verifyDevice(_x, _x2, _x3) {
  return _verifyDevice.apply(this, arguments);
}

function _verifyDevice() {
  _verifyDevice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(client, userId, deviceId) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!userId || typeof userId !== 'string')) {
              _context2.next = 2;
              break;
            }

            throw new Error('"userId" is required and must be a string.');

          case 2:
            if (!(!deviceId || typeof deviceId !== 'string')) {
              _context2.next = 4;
              break;
            }

            throw new Error('"deviceId" is required and must be a string.');

          case 4:
            _context2.next = 6;
            return client.setDeviceKnown(userId, deviceId, true);

          case 6:
            _context2.next = 8;
            return client.setDeviceVerified(userId, deviceId, true);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _verifyDevice.apply(this, arguments);
}

var decryptIncomingMessage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(matrixClient, message) {
    var myBody, event;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(message);
            _context.prev = 1;

            if (!(message.event.type === 'm.room.encrypted')) {
              _context.next = 17;
              break;
            }

            if (!message.clearEvent.content.formatted_body) {
              _context.next = 7;
              break;
            }

            myBody = message.clearEvent.content.formatted_body;
            _context.next = 15;
            break;

          case 7:
            if (!message.clearEvent.content.body) {
              _context.next = 11;
              break;
            }

            myBody = message.clearEvent.content.body;
            _context.next = 15;
            break;

          case 11:
            _context.next = 13;
            return matrixClient._crypto.decryptEvent(message);

          case 13:
            event = _context.sent;

            if (event.clearEvent.content.formatted_body) {
              myBody = event.clearEvent.content.formatted_body;
            } else {
              myBody = event.clearEvent.content.body;
            }

          case 15:
            _context.next = 18;
            break;

          case 17:
            if (message.event.content.formatted_body) {
              myBody = message.event.content.formatted_body;
            } else {
              myBody = message.event.content.body;
            }

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](1);
            console.error('#### ', _context.t0);

          case 23:
            return _context.abrupt("return", myBody);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 20]]);
  }));

  return function decryptIncomingMessage(_x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.decryptIncomingMessage = decryptIncomingMessage;