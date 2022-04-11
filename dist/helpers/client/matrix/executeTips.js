"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTipFunction = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _matrix = require("../../../messages/matrix");

var executeTipFunction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(tipFunction, queue, amount, matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage, myBody) {
    var operationName, userBeingTipped, isRunning, listenerFunction, myTimeout;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (filteredMessage[1].startsWith('<a') && !filteredMessage[2].startsWith('<a')) {
              operationName = 'tip';
              userBeingTipped = filteredMessage[1];
            } else if (filteredMessage[1].startsWith('<a') && filteredMessage[2].startsWith('<a')) {
              operationName = 'tip';
              userBeingTipped = 'multiple users';
            } else {
              operationName = filteredMessage[1];
            }

            if (!(amount && amount.toLowerCase() === 'all')) {
              _context5.next = 16;
              break;
            }

            _context5.prev = 2;
            _context5.next = 5;
            return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.confirmAllAmoutMessage)(message, operationName, userBeingTipped));

          case 5:
            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](2);
            console.log(_context5.t0);

          case 10:
            isRunning = true;

            listenerFunction = /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(confirmMessage, room) {
                var tempBody, event;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        tempBody = '';

                        if (!(message.sender.userId === confirmMessage.sender.userId && message.sender.roomId === confirmMessage.sender.roomId)) {
                          _context2.next = 34;
                          break;
                        }

                        _context2.prev = 2;

                        if (!(confirmMessage.event.type === 'm.room.encrypted')) {
                          _context2.next = 10;
                          break;
                        }

                        _context2.next = 6;
                        return matrixClient.crypto.decryptEvent(confirmMessage);

                      case 6:
                        event = _context2.sent;
                        tempBody = event.clearEvent.content.body;
                        _context2.next = 11;
                        break;

                      case 10:
                        tempBody = confirmMessage.event.content.body;

                      case 11:
                        _context2.next = 16;
                        break;

                      case 13:
                        _context2.prev = 13;
                        _context2.t0 = _context2["catch"](2);
                        console.error('#### ', _context2.t0);

                      case 16:
                        if (!(tempBody.toUpperCase() === 'YES' || tempBody.toUpperCase() === 'Y')) {
                          _context2.next = 23;
                          break;
                        }

                        isRunning = false;
                        matrixClient.off('Room.timeline', listenerFunction);
                        _context2.next = 21;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          var task;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return tipFunction(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage, myBody);

                                case 2:
                                  task = _context.sent;

                                case 3:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 21:
                        _context2.next = 34;
                        break;

                      case 23:
                        if (!(tempBody.toUpperCase() === 'NO' || tempBody.toUpperCase() === 'N')) {
                          _context2.next = 34;
                          break;
                        }

                        isRunning = false;
                        matrixClient.off('Room.timeline', listenerFunction);
                        _context2.prev = 26;
                        _context2.next = 29;
                        return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.canceledAllAmoutMessage)(message, operationName, userBeingTipped));

                      case 29:
                        _context2.next = 34;
                        break;

                      case 31:
                        _context2.prev = 31;
                        _context2.t1 = _context2["catch"](26);
                        console.log(_context2.t1);

                      case 34:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[2, 13], [26, 31]]);
              }));

              return function listenerFunction(_x14, _x15) {
                return _ref2.apply(this, arguments);
              };
            }();

            matrixClient.on('Room.timeline', listenerFunction);
            myTimeout = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (!isRunning) {
                        _context3.next = 10;
                        break;
                      }

                      matrixClient.off('Room.timeline', listenerFunction);
                      _context3.prev = 2;
                      _context3.next = 5;
                      return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.timeOutAllAmoutMessage)(message, operationName, userBeingTipped));

                    case 5:
                      _context3.next = 10;
                      break;

                    case 7:
                      _context3.prev = 7;
                      _context3.t0 = _context3["catch"](2);
                      console.log(_context3.t0);

                    case 10:
                      clearTimeout(myTimeout);

                    case 11:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, null, [[2, 7]]);
            })), 30000);
            _context5.next = 18;
            break;

          case 16:
            _context5.next = 18;
            return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
              var task;
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return tipFunction(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage, myBody);

                    case 2:
                      task = _context4.sent;

                    case 3:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            })));

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 7]]);
  }));

  return function executeTipFunction(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11, _x12, _x13) {
    return _ref.apply(this, arguments);
  };
}();

exports.executeTipFunction = executeTipFunction;