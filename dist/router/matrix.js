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

var _executeTips = require("../helpers/matrix/executeTips");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _help = require("../controllers/matrix/help");

var _balance = require("../controllers/matrix/balance");

var _deposit = require("../controllers/matrix/deposit");

var _withdraw = require("../controllers/matrix/withdraw");

var _flood = require("../controllers/matrix/flood");

var _sleet = require("../controllers/matrix/sleet");

var _ignore = require("../controllers/matrix/ignore");

var _directMessageRoom = require("../helpers/matrix/directMessageRoom");

var _user = require("../controllers/matrix/user");

var _group = require("../controllers/matrix/group");

var _settings = require("../controllers/matrix/settings");

var _matrix = require("../messages/matrix");

var _rain = require("../controllers/discord/rain");

var _tip = require("../controllers/discord/tip");

var _fees = require("../controllers/discord/fees");

var _info = require("../controllers/discord/info");

var _soak = require("../controllers/discord/soak");

var _thunder = require("../controllers/discord/thunder");

var _thunderstorm = require("../controllers/discord/thunderstorm");

var _hurricane = require("../controllers/discord/hurricane");

var _faucet = require("../controllers/discord/faucet");

var _price = require("../controllers/discord/price");

var _rateLimit = require("../helpers/rateLimit");

var _trivia = require("../controllers/discord/trivia");

var _reactdrop = require("../controllers/discord/reactdrop");

var _models = _interopRequireDefault(require("../models"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(0, _dotenv.config)();

var matrixRouter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(matrixClient, queue, io, settings) {
    var prepared, devices, _iterator, _step, device;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return matrixClient.clearStores();

          case 2:
            _context10.next = 4;
            return matrixClient.sessionStore.removeAllEndToEndSessions();

          case 4:
            _context10.next = 6;
            return matrixClient.sessionStore.removeEndToEndAccount();

          case 6:
            _context10.next = 8;
            return matrixClient.sessionStore.removeEndToEndDeviceData();

          case 8:
            _context10.next = 10;
            return matrixClient.getDevices();

          case 10:
            devices = _context10.sent;
            _iterator = _createForOfIteratorHelper(devices.devices);
            _context10.prev = 12;

            _iterator.s();

          case 14:
            if ((_step = _iterator.n()).done) {
              _context10.next = 22;
              break;
            }

            device = _step.value;

            if (!(device.device_id !== matrixClient.deviceId)) {
              _context10.next = 20;
              break;
            }

            console.log(device.device_id);
            _context10.next = 20;
            return matrixClient.deleteDevice(device.device_id);

          case 20:
            _context10.next = 14;
            break;

          case 22:
            _context10.next = 27;
            break;

          case 24:
            _context10.prev = 24;
            _context10.t0 = _context10["catch"](12);

            _iterator.e(_context10.t0);

          case 27:
            _context10.prev = 27;

            _iterator.f();

            return _context10.finish(27);

          case 30:
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
            matrixClient.on('Room.timeline', /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(message, room) {
                var lastSeenMatrixTask, faucetSetting, groupTask, channelTask, groupTaskId, channelTaskId, myBody, formatted_body, maintenance, walletExists, _yield$findUserDirect3, _yield$findUserDirect4, directUserMessageRoom, isCurrentRoomDirectMessage, userState, event, regex, preFilteredMessageWithTags, filteredMessageWithTags, preFilteredMessage, filteredMessage, userDirectMessageRoomId, setting, _setting, _setting2;

                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        if (prepared) {
                          _context9.next = 2;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 2:
                        if (!(matrixClient.credentials.userId === message.event.sender)) {
                          _context9.next = 4;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 4:
                        _context9.next = 6;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'matrix', matrixClient);

                      case 6:
                        maintenance = _context9.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context9.next = 9;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 9:
                        _context9.next = 11;
                        return (0, _user.createUpdateMatrixUser)(message, matrixClient, queue);

                      case 11:
                        walletExists = _context9.sent;
                        _context9.next = 14;
                        return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, message.sender.userId, message.sender.roomId);

                      case 14:
                        _yield$findUserDirect3 = _context9.sent;
                        _yield$findUserDirect4 = (0, _slicedToArray2["default"])(_yield$findUserDirect3, 3);
                        directUserMessageRoom = _yield$findUserDirect4[0];
                        isCurrentRoomDirectMessage = _yield$findUserDirect4[1];
                        userState = _yield$findUserDirect4[2];

                        if (isCurrentRoomDirectMessage) {
                          _context9.next = 27;
                          break;
                        }

                        _context9.next = 22;
                        return (0, _group.updateMatrixGroup)(matrixClient, message);

                      case 22:
                        groupTask = _context9.sent;
                        groupTaskId = groupTask && groupTask.id;
                        _context9.next = 26;
                        return (0, _user.updateMatrixLastSeen)(matrixClient, message);

                      case 26:
                        lastSeenMatrixTask = _context9.sent;

                      case 27:
                        _context9.prev = 27;

                        if (!(message.event.type === 'm.room.encrypted')) {
                          _context9.next = 35;
                          break;
                        }

                        _context9.next = 31;
                        return matrixClient.crypto.decryptEvent(message);

                      case 31:
                        event = _context9.sent;

                        if (event.clearEvent.content.formatted_body) {
                          myBody = event.clearEvent.content.formatted_body;
                        } else {
                          myBody = event.clearEvent.content.body;
                        }

                        _context9.next = 37;
                        break;

                      case 35:
                        if (message.event.content.formatted_body) {
                          myBody = message.event.content.formatted_body;
                        } else {
                          myBody = message.event.content.body;
                        }

                        console.log(message.event.content);

                      case 37:
                        _context9.next = 42;
                        break;

                      case 39:
                        _context9.prev = 39;
                        _context9.t0 = _context9["catch"](27);
                        console.error('#### ', _context9.t0);

                      case 42:
                        if (!myBody) {
                          _context9.next = 127;
                          break;
                        }

                        if (myBody.startsWith(settings.bot.command.matrix)) {
                          _context9.next = 45;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 45:
                        if (!myBody.startsWith(settings.bot.command.matrix)) {
                          _context9.next = 127;
                          break;
                        }

                        _context9.next = 48;
                        return (0, _settings.matrixWaterFaucetSettings)(groupTaskId, channelTaskId);

                      case 48:
                        faucetSetting = _context9.sent;

                        if (faucetSetting) {
                          _context9.next = 51;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 51:
                        if (!(groupTask && groupTask.banned)) {
                          _context9.next = 61;
                          break;
                        }

                        _context9.prev = 52;
                        _context9.next = 55;
                        return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixRoomBannedMessage)(groupTask));

                      case 55:
                        _context9.next = 60;
                        break;

                      case 57:
                        _context9.prev = 57;
                        _context9.t1 = _context9["catch"](52);
                        console.log(_context9.t1);

                      case 60:
                        return _context9.abrupt("return");

                      case 61:
                        if (!(lastSeenMatrixTask && lastSeenMatrixTask.banned)) {
                          _context9.next = 71;
                          break;
                        }

                        _context9.prev = 62;
                        _context9.next = 65;
                        return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixUserBannedMessage)(lastSeenMatrixTask));

                      case 65:
                        _context9.next = 70;
                        break;

                      case 67:
                        _context9.prev = 67;
                        _context9.t2 = _context9["catch"](62);
                        console.log(_context9.t2);

                      case 70:
                        return _context9.abrupt("return");

                      case 71:
                        // let userDirectMessageRoomId;
                        regex = /\s*((?:[^\s<]*<\w[^>]*>[\s\S]*?<\/\w[^>]*>)+[^\s<]*)\s*/;
                        preFilteredMessageWithTags = myBody.split(regex).filter(Boolean);
                        filteredMessageWithTags = preFilteredMessageWithTags.filter(function (el) {
                          return el !== '';
                        });
                        preFilteredMessage = myBody.split(' ');
                        filteredMessage = preFilteredMessage.filter(function (el) {
                          return el !== '';
                        });
                        console.log(filteredMessageWithTags);
                        console.log(filteredMessage);
                        console.log("myBody");
                        _context9.next = 81;
                        return (0, _directMessageRoom.inviteUserToDirectMessageRoom)(matrixClient, directUserMessageRoom, userState, message.sender.userId, message.sender.name, message.sender.roomId);

                      case 81:
                        userDirectMessageRoomId = _context9.sent;

                        if (!(!directUserMessageRoom || !userDirectMessageRoomId)) {
                          _context9.next = 84;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 84:
                        console.log(userDirectMessageRoomId);

                        if (!(filteredMessage[1] === undefined)) {
                          _context9.next = 88;
                          break;
                        }

                        _context9.next = 88;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                          var task;
                          return _regenerator["default"].wrap(function _callee4$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  _context4.next = 2;
                                  return (0, _help.matrixHelp)(matrixClient, message, userDirectMessageRoomId, io);

                                case 2:
                                  task = _context4.sent;

                                case 3:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4);
                        })));

                      case 88:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'help')) {
                          _context9.next = 91;
                          break;
                        }

                        _context9.next = 91;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                          var task;
                          return _regenerator["default"].wrap(function _callee5$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  _context5.next = 2;
                                  return (0, _help.matrixHelp)(matrixClient, message, userDirectMessageRoomId, io);

                                case 2:
                                  task = _context5.sent;

                                case 3:
                                case "end":
                                  return _context5.stop();
                              }
                            }
                          }, _callee5);
                        })));

                      case 91:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'balance')) {
                          _context9.next = 94;
                          break;
                        }

                        _context9.next = 94;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                          var task;
                          return _regenerator["default"].wrap(function _callee6$(_context6) {
                            while (1) {
                              switch (_context6.prev = _context6.next) {
                                case 0:
                                  _context6.next = 2;
                                  return (0, _balance.matrixBalance)(matrixClient, message, userDirectMessageRoomId, io);

                                case 2:
                                  task = _context6.sent;

                                case 3:
                                case "end":
                                  return _context6.stop();
                              }
                            }
                          }, _callee6);
                        })));

                      case 94:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'ignoreme')) {
                          _context9.next = 97;
                          break;
                        }

                        _context9.next = 97;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                          var task;
                          return _regenerator["default"].wrap(function _callee7$(_context7) {
                            while (1) {
                              switch (_context7.prev = _context7.next) {
                                case 0:
                                  _context7.next = 2;
                                  return (0, _ignore.setIgnoreMe)(matrixClient, message, io);

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
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'deposit')) {
                          _context9.next = 100;
                          break;
                        }

                        _context9.next = 100;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                          var task;
                          return _regenerator["default"].wrap(function _callee8$(_context8) {
                            while (1) {
                              switch (_context8.prev = _context8.next) {
                                case 0:
                                  _context8.next = 2;
                                  return (0, _deposit.matrixWalletDepositAddress)(matrixClient, message, userDirectMessageRoomId, io);

                                case 2:
                                  task = _context8.sent;

                                case 3:
                                case "end":
                                  return _context8.stop();
                              }
                            }
                          }, _callee8);
                        })));

                      case 100:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'withdraw')) {
                          _context9.next = 109;
                          break;
                        }

                        _context9.next = 103;
                        return (0, _settings.matrixSettings)(matrixClient, message, 'withdraw', groupTaskId, channelTaskId);

                      case 103:
                        setting = _context9.sent;

                        if (setting) {
                          _context9.next = 106;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 106:
                        console.log(settings); // const limited = await limitWithdraw(message);
                        // if (limited) return;

                        _context9.next = 109;
                        return (0, _executeTips.executeTipFunction)(_withdraw.withdrawMatrixCreate, queue, filteredMessage[3], matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 109:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'flood')) {
                          _context9.next = 118;
                          break;
                        }

                        _context9.next = 112;
                        return (0, _settings.matrixSettings)(matrixClient, message, 'flood', groupTaskId, channelTaskId);

                      case 112:
                        _setting = _context9.sent;

                        if (_setting) {
                          _context9.next = 115;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 115:
                        console.log(settings); // const limited = await limitWithdraw(message);
                        // if (limited) return;

                        _context9.next = 118;
                        return (0, _executeTips.executeTipFunction)(_flood.matrixFlood, queue, filteredMessage[2], matrixClient, message, filteredMessage, io, groupTask, _setting, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 118:
                        if (!(filteredMessage[1] && filteredMessage[1].toLowerCase() === 'sleet')) {
                          _context9.next = 127;
                          break;
                        }

                        _context9.next = 121;
                        return (0, _settings.matrixSettings)(matrixClient, message, 'sleet', groupTaskId, channelTaskId);

                      case 121:
                        _setting2 = _context9.sent;

                        if (_setting2) {
                          _context9.next = 124;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 124:
                        console.log(settings); // const limited = await limitWithdraw(message);
                        // if (limited) return;

                        _context9.next = 127;
                        return (0, _executeTips.executeTipFunction)(_sleet.matrixSleet, queue, filteredMessage[2], matrixClient, message, filteredMessage, io, groupTask, _setting2, faucetSetting, userDirectMessageRoomId, isCurrentRoomDirectMessage);

                      case 127:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9, null, [[27, 39], [52, 57], [62, 67]]);
              }));

              return function (_x10, _x11) {
                return _ref5.apply(this, arguments);
              };
            }());
            _context10.prev = 33;
            _context10.next = 36;
            return matrixClient.initCrypto();

          case 36:
            _context10.next = 38;
            return matrixClient.startClient({
              initialSyncLimit: 1,
              includeArchivedRooms: true
            });

          case 38:
            _context10.next = 43;
            break;

          case 40:
            _context10.prev = 40;
            _context10.t1 = _context10["catch"](33);
            console.log(_context10.t1);

          case 43:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[12, 24, 27, 30], [33, 40]]);
  }));

  return function matrixRouter(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixRouter = matrixRouter;