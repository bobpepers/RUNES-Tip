"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inviteUserToDirectMessageRoom = exports.findUserDirectMessageRoom = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _matrix = require("../../../messages/matrix");

var asyncFilter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(arr, predicate) {
    var results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.all(arr.map(predicate));

          case 2:
            results = _context.sent;
            return _context.abrupt("return", arr.filter(function (_v, index) {
              return results[index];
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function asyncFilter(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var findUserDirectMessageRoom = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, userId) {
    var roomId,
        determinRoom,
        determinUserDirectMessageState,
        rooms,
        invitedDMRooms,
        i,
        _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            roomId = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : null;
            _context3.prev = 1;
            _context3.next = 4;
            return matrixClient.getRooms();

          case 4:
            rooms = _context3.sent;
            _context3.next = 7;
            return asyncFilter(rooms, /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(room) {
                var members;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return room.currentState.getMembers();

                      case 2:
                        members = _context2.sent;

                        if (!(members.length !== 2)) {
                          _context2.next = 5;
                          break;
                        }

                        return _context2.abrupt("return", false);

                      case 5:
                        return _context2.abrupt("return", members[1] && members[0] && members[1].membership && members[0].membership && (members[1].membership === 'join' || members[1].membership === 'invite') && (members[1].userId === matrixClient.credentials.userId || members[1].userId === userId) && (members[0].membership === 'join' || members[0].membership === 'invite') && (members[0].userId === userId || members[0].userId === matrixClient.credentials.userId));

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 7:
            invitedDMRooms = _context3.sent;

            // console.log(invitedDMRooms);
            // console.log('invitedDMRooms');
            if (roomId) {
              determinRoom = invitedDMRooms.filter(function (i) {
                return i.roomId === roomId;
              });
            }

            if (!(invitedDMRooms.length > 1)) {
              _context3.next = 19;
              break;
            }

            i = 1;

          case 11:
            if (!(i < invitedDMRooms.length)) {
              _context3.next = 19;
              break;
            }

            _context3.next = 14;
            return matrixClient.leave(invitedDMRooms[parseInt(i, 10)].roomId);

          case 14:
            _context3.next = 16;
            return matrixClient.forget(invitedDMRooms[parseInt(i, 10)].roomId, true);

          case 16:
            i += 1;
            _context3.next = 11;
            break;

          case 19:
            if (invitedDMRooms.length > 0) {
              // console.log(invitedDMRooms[0]);
              determinUserDirectMessageState = invitedDMRooms[0].currentState.getStateEvents("m.room.member", userId).event.content.membership;
            }

            if (determinRoom && determinRoom.length > 0) {
              console.log('current room is DM');
            } else {
              console.log('current room is not a DM room');
            }

            return _context3.abrupt("return", [invitedDMRooms && invitedDMRooms.length > 0 ? invitedDMRooms[0] : false, determinRoom && determinRoom.length > 0, determinUserDirectMessageState]);

          case 24:
            _context3.prev = 24;
            _context3.t0 = _context3["catch"](1);
            console.log(_context3.t0);

          case 27:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 24]]);
  }));

  return function findUserDirectMessageRoom(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.findUserDirectMessageRoom = findUserDirectMessageRoom;

var inviteUserToDirectMessageRoom = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(matrixClient, directUserMessageRoom, userState, userId, username) {
    var roomId,
        userRoomId,
        _args4 = arguments;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            roomId = _args4.length > 5 && _args4[5] !== undefined ? _args4[5] : null;
            _context4.prev = 1;
            console.log(userState);

            if (!(userState === 'leave' || userState === 'invite')) {
              _context4.next = 13;
              break;
            }

            console.log('reinvited user to old room');
            console.log(directUserMessageRoom);
            _context4.next = 8;
            return matrixClient.invite(directUserMessageRoom.roomId, userId);

          case 8:
            userRoomId = _context4.sent;
            _context4.next = 11;
            return matrixClient.sendEvent(roomId, "m.room.message", (0, _matrix.inviteMatrixDirectMessageRoom)(username));

          case 11:
            _context4.next = 20;
            break;

          case 13:
            if (directUserMessageRoom) {
              _context4.next = 20;
              break;
            }

            console.log('creating new dm room');
            _context4.next = 17;
            return matrixClient.createRoom({
              preset: 'trusted_private_chat',
              invite: [userId],
              is_direct: true
            });

          case 17:
            userRoomId = _context4.sent;
            _context4.next = 20;
            return matrixClient.sendEvent(roomId, "m.room.message", (0, _matrix.inviteMatrixDirectMessageRoom)(username));

          case 20:
            return _context4.abrupt("return", directUserMessageRoom.roomId || userRoomId);

          case 23:
            _context4.prev = 23;
            _context4.t0 = _context4["catch"](1);
            console.log(_context4.t0);

          case 26:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 23]]);
  }));

  return function inviteUserToDirectMessageRoom(_x6, _x7, _x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

exports.inviteUserToDirectMessageRoom = inviteUserToDirectMessageRoom;