"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _executeTips = require("../helpers/client/matrix/executeTips");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _help = require("../controllers/matrix/help");

var _balance = require("../controllers/matrix/balance");

var _deposit = require("../controllers/matrix/deposit");

var _withdraw = require("../controllers/matrix/withdraw");

var _flood = require("../controllers/matrix/flood");

var _sleet = require("../controllers/matrix/sleet");

var _ignore = require("../controllers/matrix/ignore");

var _tip = require("../controllers/matrix/tip");

var _price = require("../controllers/matrix/price");

var _fees = require("../controllers/matrix/fees");

var _info = require("../controllers/matrix/info");

var _reactdrop = require("../controllers/matrix/reactdrop");

var _group = require("../controllers/matrix/group");

var _settings = require("../controllers/matrix/settings");

var _settings2 = require("../controllers/settings");

var _user = require("../controllers/matrix/user");

var _rateLimit = require("../helpers/rateLimit");

var _directMessageRoom = require("../helpers/client/matrix/directMessageRoom");

var _decryptIncomingMessage = require("../helpers/client/matrix/decryptIncomingMessage");

var _matrix = require("../messages/matrix");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(0, _dotenv.config)();

var matrixRouter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(matrixClient, queue, io, settings) {
    var prepared, devices, _iterator, _step, device;

    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return matrixClient.getDevices();

          case 2:
            devices = _context14.sent;
            _iterator = _createForOfIteratorHelper(devices.devices);
            _context14.prev = 4;

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context14.next = 14;
              break;
            }

            device = _step.value;

            if (!(device.device_id !== matrixClient.deviceId)) {
              _context14.next = 12;
              break;
            }

            console.log(device.device_id);
            _context14.next = 12;
            return matrixClient.deleteDevice(device.device_id);

          case 12:
            _context14.next = 6;
            break;

          case 14:
            _context14.next = 19;
            break;

          case 16:
            _context14.prev = 16;
            _context14.t0 = _context14["catch"](4);

            _iterator.e(_context14.t0);

          case 19:
            _context14.prev = 19;

            _iterator.f();

            return _context14.finish(19);

          case 22:
            matrixClient.once('sync', /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(state, prevState, res) {
                var allRooms, _iterator2, _step2, room;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(state !== 'PREPARED')) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return");

                      case 2:
                        matrixClient.setGlobalErrorOnUnknownDevices(false);

                        if (!(state === 'PREPARED')) {
                          _context.next = 34;
                          break;
                        }

                        _context.next = 6;
                        return matrixClient.getRooms();

                      case 6:
                        allRooms = _context.sent;
                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(allRooms);
                        _context.prev = 8;

                        _iterator2.s();

                      case 10:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 25;
                          break;
                        }

                        room = _step2.value;

                        if (!(room && room.currentState && room.currentState.joinedMemberCount === 1 && room.currentState.invitedMemberCount === 0)) {
                          _context.next = 23;
                          break;
                        }

                        _context.prev = 13;
                        _context.next = 16;
                        return matrixClient.leave(room.roomId);

                      case 16:
                        _context.next = 18;
                        return matrixClient.forget(room.roomId, true);

                      case 18:
                        _context.next = 23;
                        break;

                      case 20:
                        _context.prev = 20;
                        _context.t0 = _context["catch"](13);
                        console.log(_context.t0);

                      case 23:
                        _context.next = 10;
                        break;

                      case 25:
                        _context.next = 30;
                        break;

                      case 27:
                        _context.prev = 27;
                        _context.t1 = _context["catch"](8);

                        _iterator2.e(_context.t1);

                      case 30:
                        _context.prev = 30;

                        _iterator2.f();

                        return _context.finish(30);

                      case 33:
                        prepared = true;

                      case 34:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[8, 27, 30, 33], [13, 20]]);
              }));

              return function (_x5, _x6, _x7) {
                return _ref2.apply(this, arguments);
              };
            }());
            matrixClient.on("RoomMember.membership", /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(event, member) {
                var _yield$findUserDirect, _yield$findUserDirect2, directUserMessageRoom, isCurrentRoomDirectMessage, userState;

                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        if (prepared) {
                          _context3.next = 2;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 2:
                        _context3.next = 4;
                        return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, member.userId, member.roomId);

                      case 4:
                        _yield$findUserDirect = _context3.sent;
                        _yield$findUserDirect2 = (0, _slicedToArray2["default"])(_yield$findUserDirect, 3);
                        directUserMessageRoom = _yield$findUserDirect2[0];
                        isCurrentRoomDirectMessage = _yield$findUserDirect2[1];
                        userState = _yield$findUserDirect2[2];

                        if (!(!directUserMessageRoom && member.membership === "invite")) {
                          _context3.next = 27;
                          break;
                        }

                        console.log('joined');
                        _context3.prev = 11;
                        _context3.next = 14;
                        return matrixClient.joinRoom(member.roomId).then(function () {
                          console.log("Auto-joined %s", member.roomId);
                        });

                      case 14:
                        _context3.next = 27;
                        break;

                      case 16:
                        _context3.prev = 16;
                        _context3.t0 = _context3["catch"](11);
                        console.log(_context3.t0);
                        _context3.prev = 19;
                        _context3.next = 22;
                        return matrixClient.leave(member.roomId).then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.next = 2;
                                  return matrixClient.forget(member.roomId, true);

                                case 2:
                                  console.log("Auto-left %s", member.roomId);

                                case 3:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        })));

                      case 22:
                        _context3.next = 27;
                        break;

                      case 24:
                        _context3.prev = 24;
                        _context3.t1 = _context3["catch"](19);
                        console.log(_context3.t1);

                      case 27:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[11, 16], [19, 24]]);
              }));

              return function (_x8, _x9) {
                return _ref3.apply(this, arguments);
              };
            }());
            matrixClient.on("User.presence", /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(event, user) {
                var newPresence;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        newPresence = user.presence;
                        console.log(event);
                        console.log(user);
                        console.log(newPresence);
                        console.log('presence update matrix');

                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x10, _x11) {
                return _ref5.apply(this, arguments);
              };
            }());
            matrixClient.on('Room.timeline', /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(message, room) {
                var lastSeenMatrixTask, faucetSetting, groupTask, channelTask, groupTaskId, channelTaskId, walletExists, _yield$findUserDirect3, _yield$findUserDirect4, directUserMessageRoom, isCurrentRoomDirectMessage, userState, myBody, maintenance, regex, preFilteredMessageWithTags, filteredMessageWithTags, preFilteredMessage, filteredMessage, userDirectMessageRoomId, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, _limited8, setting, _limited9, _setting, _limited10, _setting2, _limited11, _setting3, _limited12, _setting4, AmountPosition, AmountPositionEnded, preSplitAfterTags, splitAfterTags, filteredMessageWithTagsClean, finalFilteredTipsWithTags;

                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        if (prepared) {
                          _context13.next = 2;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 2:
                        if (!(matrixClient.credentials.userId === message.event.sender)) {
                          _context13.next = 4;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 4:
                        _context13.next = 6;
                        return (0, _user.createUpdateMatrixUser)(message, matrixClient, queue);

                      case 6:
                        walletExists = _context13.sent;
                        _context13.next = 9;
                        return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, message.sender.userId, message.sender.roomId);

                      case 9:
                        _yield$findUserDirect3 = _context13.sent;
                        _yield$findUserDirect4 = (0, _slicedToArray2["default"])(_yield$findUserDirect3, 3);
                        directUserMessageRoom = _yield$findUserDirect4[0];
                        isCurrentRoomDirectMessage = _yield$findUserDirect4[1];
                        userState = _yield$findUserDirect4[2];

                        if (isCurrentRoomDirectMessage) {
                          _context13.next = 22;
                          break;
                        }

                        _context13.next = 17;
                        return (0, _group.updateMatrixGroup)(matrixClient, message);

                      case 17:
                        groupTask = _context13.sent;
                        groupTaskId = groupTask && groupTask.id;
                        _context13.next = 21;
                        return (0, _user.updateMatrixLastSeen)(matrixClient, message);

                      case 21:
                        lastSeenMatrixTask = _context13.sent;

                      case 22:
                        _context13.next = 24;
                        return (0, _decryptIncomingMessage.decryptIncomingMessage)(matrixClient, message);

                      case 24:
                        myBody = _context13.sent;

                        if (!myBody) {
                          _context13.next = 211;
                          break;
                        }

                        if (myBody.startsWith(settings.bot.command.matrix)) {
                          _context13.next = 28;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 28:
                        if (!myBody.startsWith(settings.bot.command.matrix)) {
                          _context13.next = 211;
                          break;
                        }

                        _context13.next = 31;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'matrix', matrixClient);

                      case 31:
                        maintenance = _context13.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context13.next = 34;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 34:
                        _context13.next = 36;
                        return (0, _settings2.waterFaucetSettings)(groupTaskId, channelTaskId);

                      case 36:
                        faucetSetting = _context13.sent;

                        if (faucetSetting) {
                          _context13.next = 39;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 39:
                        if (!(groupTask && groupTask.banned)) {
                          _context13.next = 49;
                          break;
                        }

                        _context13.prev = 40;
                        _context13.next = 43;
                        return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixRoomBannedMessage)(groupTask));

                      case 43:
                        _context13.next = 48;
                        break;

                      case 45:
                        _context13.prev = 45;
                        _context13.t0 = _context13["catch"](40);
                        console.log(_context13.t0);

                      case 48:
                        return _context13.abrupt("return");

                      case 49:
                        if (!(lastSeenMatrixTask && lastSeenMatrixTask.banned)) {
                          _context13.next = 59;
                          break;
                        }

                        _context13.prev = 50;
                        _context13.next = 53;
                        return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixUserBannedMessage)(lastSeenMatrixTask));

                      case 53:
                        _context13.next = 58;
                        break;

                      case 55:
                        _context13.prev = 55;
                        _context13.t1 = _context13["catch"](50);
                        console.log(_context13.t1);

                      case 58:
                        return _context13.abrupt("return");

                      case 59:
                        // let userDirectMessageRoomId;
                        regex = /\s*((?:[^\s<]*<\w[^>]*>[\s\S]*?<\/\w[^>]*>)+[^\s<]*)\s*/;
                        preFilteredMessageWithTags = myBody.split(regex).filter(Boolean);
                        filteredMessageWithTags = preFilteredMessageWithTags.filter(function (el) {
                          return el !== '';
                        }).filter(String);
                        preFilteredMessage = myBody.split(' ');
                        filteredMessage = preFilteredMessage.filter(function (el) {
                          return el !== '';
                        });
                        console.log(filteredMessageWithTags);
                        console.log(filteredMessage);
                        console.log("myBody");
                        _context13.next = 69;
                        return (0, _directMessageRoom.inviteUserToDirectMessageRoom)(matrixClient, directUserMessageRoom, userState, message.sender.userId, message.sender.name, message.sender.roomId);

                      case 69:
                        userDirectMessageRoomId = _context13.sent;

                        if (!(!directUserMessageRoom || !userDirectMessageRoomId)) {
                          _context13.next = 72;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 72:
                        console.log(userDirectMessageRoomId);

                        if (!(filteredMessage[1] === undefined)) {
                          _context13.next = 81;
                          break;
                        }

                        _context13.next = 76;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Help');

                      case 76:
                        limited = _context13.sent;

                        if (!limited) {
                          _context13.next = 79;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 79:
                        _context13.next = 81;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                          var task;
                          return _regenerator["default"].wrap(function _callee5$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  _context5.next = 2;
                                  return (0, _help.matrixHelp)(matrixClient, message, userDirectMessageRoomId, isCurrentRoomDirectMessage, io);

                                case 2:
                                  task = _context5.sent;

                                case 3:
                                case "end":
                                  return _context5.stop();
                              }
                            }
                          }, _callee5);
                        })));

                      case 81:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'help')) {
                          _context13.next = 89;
                          break;
                        }

                        _context13.next = 84;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Help');

                      case 84:
                        _limited = _context13.sent;

                        if (!_limited) {
                          _context13.next = 87;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 87:
                        _context13.next = 89;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                          var task;
                          return _regenerator["default"].wrap(function _callee6$(_context6) {
                            while (1) {
                              switch (_context6.prev = _context6.next) {
                                case 0:
                                  _context6.next = 2;
                                  return (0, _help.matrixHelp)(matrixClient, message, userDirectMessageRoomId, isCurrentRoomDirectMessage, io);

                                case 2:
                                  task = _context6.sent;

                                case 3:
                                case "end":
                                  return _context6.stop();
                              }
                            }
                          }, _callee6);
                        })));

                      case 89:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'info')) {
                          _context13.next = 97;
                          break;
                        }

                        _context13.next = 92;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Info');

                      case 92:
                        _limited2 = _context13.sent;

                        if (!_limited2) {
                          _context13.next = 95;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 95:
                        _context13.next = 97;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                          var task;
                          return _regenerator["default"].wrap(function _callee7$(_context7) {
                            while (1) {
                              switch (_context7.prev = _context7.next) {
                                case 0:
                                  _context7.next = 2;
                                  return (0, _info.matrixCoinInfo)(matrixClient, message, userDirectMessageRoomId, io);

                                case 2:
                                  task = _context7.sent;

                                case 3:
                                case "end":
                                  return _context7.stop();
                              }
                            }
                          }, _callee7);
                        })));

                      case 97:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'balance')) {
                          _context13.next = 105;
                          break;
                        }

                        _context13.next = 100;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Balance');

                      case 100:
                        _limited3 = _context13.sent;

                        if (!_limited3) {
                          _context13.next = 103;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 103:
                        _context13.next = 105;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                          var task;
                          return _regenerator["default"].wrap(function _callee8$(_context8) {
                            while (1) {
                              switch (_context8.prev = _context8.next) {
                                case 0:
                                  _context8.next = 2;
                                  return (0, _balance.matrixBalance)(matrixClient, message, userDirectMessageRoomId, isCurrentRoomDirectMessage, io);

                                case 2:
                                  task = _context8.sent;

                                case 3:
                                case "end":
                                  return _context8.stop();
                              }
                            }
                          }, _callee8);
                        })));

                      case 105:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'ignoreme')) {
                          _context13.next = 113;
                          break;
                        }

                        _context13.next = 108;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'IgnoreMe');

                      case 108:
                        _limited4 = _context13.sent;

                        if (!_limited4) {
                          _context13.next = 111;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 111:
                        _context13.next = 113;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                          var task;
                          return _regenerator["default"].wrap(function _callee9$(_context9) {
                            while (1) {
                              switch (_context9.prev = _context9.next) {
                                case 0:
                                  _context9.next = 2;
                                  return (0, _ignore.setIgnoreMe)(matrixClient, message, io);

                                case 2:
                                  task = _context9.sent;

                                case 3:
                                case "end":
                                  return _context9.stop();
                              }
                            }
                          }, _callee9);
                        })));

                      case 113:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'deposit')) {
                          _context13.next = 121;
                          break;
                        }

                        _context13.next = 116;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Deposit');

                      case 116:
                        _limited5 = _context13.sent;

                        if (!_limited5) {
                          _context13.next = 119;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 119:
                        _context13.next = 121;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                          var task;
                          return _regenerator["default"].wrap(function _callee10$(_context10) {
                            while (1) {
                              switch (_context10.prev = _context10.next) {
                                case 0:
                                  _context10.next = 2;
                                  return (0, _deposit.matrixWalletDepositAddress)(matrixClient, message, userDirectMessageRoomId, isCurrentRoomDirectMessage, io);

                                case 2:
                                  task = _context10.sent;

                                case 3:
                                case "end":
                                  return _context10.stop();
                              }
                            }
                          }, _callee10);
                        })));

                      case 121:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'price')) {
                          _context13.next = 129;
                          break;
                        }

                        _context13.next = 124;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Price');

                      case 124:
                        _limited6 = _context13.sent;

                        if (!_limited6) {
                          _context13.next = 127;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 127:
                        _context13.next = 129;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
                          var task;
                          return _regenerator["default"].wrap(function _callee11$(_context11) {
                            while (1) {
                              switch (_context11.prev = _context11.next) {
                                case 0:
                                  _context11.next = 2;
                                  return (0, _price.matrixPrice)(matrixClient, message, io);

                                case 2:
                                  task = _context11.sent;

                                case 3:
                                case "end":
                                  return _context11.stop();
                              }
                            }
                          }, _callee11);
                        })));

                      case 129:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'fees')) {
                          _context13.next = 137;
                          break;
                        }

                        _context13.next = 132;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Fees');

                      case 132:
                        _limited7 = _context13.sent;

                        if (!_limited7) {
                          _context13.next = 135;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 135:
                        _context13.next = 137;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                          var task;
                          return _regenerator["default"].wrap(function _callee12$(_context12) {
                            while (1) {
                              switch (_context12.prev = _context12.next) {
                                case 0:
                                  _context12.next = 2;
                                  return (0, _fees.matrixFeeSchedule)(matrixClient, message, filteredMessage, io, groupTaskId);

                                case 2:
                                  task = _context12.sent;

                                case 3:
                                case "end":
                                  return _context12.stop();
                              }
                            }
                          }, _callee12);
                        })));

                      case 137:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'withdraw')) {
                          _context13.next = 150;
                          break;
                        }

                        _context13.next = 140;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Withdraw');

                      case 140:
                        _limited8 = _context13.sent;

                        if (!_limited8) {
                          _context13.next = 143;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 143:
                        _context13.next = 145;
                        return (0, _settings.matrixFeatureSettings)(matrixClient, message, 'withdraw', groupTaskId, channelTaskId);

                      case 145:
                        setting = _context13.sent;

                        if (setting) {
                          _context13.next = 148;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 148:
                        _context13.next = 150;
                        return (0, _executeTips.executeTipFunction)(_withdraw.withdrawMatrixCreate, queue, filteredMessage[3], matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 150:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'flood')) {
                          _context13.next = 163;
                          break;
                        }

                        _context13.next = 153;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Flood');

                      case 153:
                        _limited9 = _context13.sent;

                        if (!_limited9) {
                          _context13.next = 156;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 156:
                        _context13.next = 158;
                        return (0, _settings.matrixFeatureSettings)(matrixClient, message, 'flood', groupTaskId, channelTaskId);

                      case 158:
                        _setting = _context13.sent;

                        if (_setting) {
                          _context13.next = 161;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 161:
                        _context13.next = 163;
                        return (0, _executeTips.executeTipFunction)(_flood.matrixFlood, queue, filteredMessage[2], matrixClient, message, filteredMessage, io, groupTask, _setting, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 163:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'sleet')) {
                          _context13.next = 176;
                          break;
                        }

                        _context13.next = 166;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Sleet');

                      case 166:
                        _limited10 = _context13.sent;

                        if (!_limited10) {
                          _context13.next = 169;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 169:
                        _context13.next = 171;
                        return (0, _settings.matrixFeatureSettings)(matrixClient, message, 'sleet', groupTaskId, channelTaskId);

                      case 171:
                        _setting2 = _context13.sent;

                        if (_setting2) {
                          _context13.next = 174;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 174:
                        _context13.next = 176;
                        return (0, _executeTips.executeTipFunction)(_sleet.matrixSleet, queue, filteredMessage[2], matrixClient, message, filteredMessage, io, groupTask, _setting2, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 176:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'reactdrop')) {
                          _context13.next = 189;
                          break;
                        }

                        _context13.next = 179;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Reactdrop');

                      case 179:
                        _limited11 = _context13.sent;

                        if (!_limited11) {
                          _context13.next = 182;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 182:
                        _context13.next = 184;
                        return (0, _settings.matrixFeatureSettings)(matrixClient, message, 'reactdrop', groupTaskId, channelTaskId);

                      case 184:
                        _setting3 = _context13.sent;

                        if (_setting3) {
                          _context13.next = 187;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 187:
                        _context13.next = 189;
                        return (0, _executeTips.executeTipFunction)(_reactdrop.matrixReactDrop, queue, filteredMessage[2], matrixClient, message, filteredMessage, io, groupTask, _setting3, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 189:
                        if (!(filteredMessageWithTags.length > 1 && filteredMessageWithTags[1] && filteredMessageWithTags[1].startsWith('<a'))) {
                          _context13.next = 211;
                          break;
                        }

                        _context13.next = 192;
                        return (0, _rateLimit.myRateLimiter)(matrixClient, message, 'matrix', 'Tip');

                      case 192:
                        _limited12 = _context13.sent;

                        if (!_limited12) {
                          _context13.next = 195;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 195:
                        _context13.next = 197;
                        return (0, _settings.matrixFeatureSettings)(matrixClient, message, 'tip', groupTaskId, channelTaskId);

                      case 197:
                        _setting4 = _context13.sent;

                        if (_setting4) {
                          _context13.next = 200;
                          break;
                        }

                        return _context13.abrupt("return");

                      case 200:
                        AmountPosition = 1;
                        AmountPositionEnded = false;

                        while (!AmountPositionEnded) {
                          AmountPosition += 1;

                          if (!filteredMessageWithTags[parseInt(AmountPosition, 10)].startsWith('<a')) {
                            AmountPositionEnded = true;
                          }
                        }

                        preSplitAfterTags = filteredMessageWithTags[parseInt(AmountPosition, 10)].split(' ');
                        splitAfterTags = preSplitAfterTags.filter(function (el) {
                          return el !== '';
                        });
                        filteredMessageWithTagsClean = filteredMessageWithTags.splice(0, AmountPosition);
                        finalFilteredTipsWithTags = filteredMessageWithTagsClean.concat(splitAfterTags);
                        console.log(finalFilteredTipsWithTags);
                        console.log("myBody");
                        _context13.next = 211;
                        return (0, _executeTips.executeTipFunction)(_tip.tipRunesToMatrixUser, queue, finalFilteredTipsWithTags[parseInt(AmountPosition, 10)], matrixClient, message, finalFilteredTipsWithTags, io, groupTask, _setting4, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 211:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13, null, [[40, 45], [50, 55]]);
              }));

              return function (_x12, _x13) {
                return _ref6.apply(this, arguments);
              };
            }());
            _context14.prev = 26;
            _context14.next = 29;
            return matrixClient.initCrypto();

          case 29:
            _context14.next = 31;
            return matrixClient.startClient({
              initialSyncLimit: 1,
              includeArchivedRooms: true
            });

          case 31:
            _context14.next = 36;
            break;

          case 33:
            _context14.prev = 33;
            _context14.t1 = _context14["catch"](26);
            console.log(_context14.t1);

          case 36:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[4, 16, 19, 22], [26, 33]]);
  }));

  return function matrixRouter(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixRouter = matrixRouter;