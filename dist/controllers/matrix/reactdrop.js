"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixReactDrop = exports.listenMatrixReactDrop = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

var _emoji = _interopRequireDefault(require("../../config/emoji"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _generateCaptcha = require("../../helpers/generateCaptcha");

var _waterFaucet = require("../../helpers/waterFaucet");

var _validateAmount = require("../../helpers/client/matrix/validateAmount");

var _userWalletExist = require("../../helpers/client/matrix/userWalletExist");

var _settings = require("../settings");

var _directMessageRoom = require("../../helpers/client/matrix/directMessageRoom");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var listenMatrixReactDrop = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(matrixClient, reactMessage, distance, reactDrop, io, queue) {
    var reactDropRoomId, backToReactDropLink, listenerFunction, myTimeout;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            reactDropRoomId = reactDrop.group.groupId.replace('matrix-', ''); // const reactDropUserId = reactDrop.user.user_id.replace('matrix-', '');

            backToReactDropLink = "https://matrix.to/#/".concat(reactDropRoomId, "/").concat(reactDrop.messageId);

            listenerFunction = /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(confirmMessage, room) {
                var findReactUser, reactDropTipUserId, findReactTip, _yield$findUserDirect, _yield$findUserDirect2, directUserMessageRoom, isCurrentRoomDirectMessage, userState, userDirectMessageRoomId, _yield$generateCaptch, _yield$generateCaptch2, captchaImage, captchaText, captchaType, uploadResponse, listenerFunctionForUser, myTimeoutUserListener;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (!(room.roomId === reactDropRoomId && confirmMessage.event.type === 'm.reaction' && confirmMessage.event.content && confirmMessage.event.content['m.relates_to'] && confirmMessage.event.content['m.relates_to'].event_id && confirmMessage.event.content['m.relates_to'].key && confirmMessage.event.content['m.relates_to'].event_id === reactMessage)) {
                          _context7.next = 59;
                          break;
                        }

                        _context7.next = 3;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "matrix-".concat(confirmMessage.sender.userId)
                          }
                        });

                      case 3:
                        findReactUser = _context7.sent;

                        if (!findReactUser) {
                          _context7.next = 59;
                          break;
                        }

                        reactDropTipUserId = findReactUser.user_id.replace('matrix-', '');
                        _context7.next = 8;
                        return _models["default"].reactdroptip.findOne({
                          where: {
                            userId: findReactUser.id,
                            reactdropId: reactDrop.id
                          }
                        });

                      case 8:
                        findReactTip = _context7.sent;

                        if (findReactTip) {
                          _context7.next = 59;
                          break;
                        }

                        _context7.next = 12;
                        return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, confirmMessage.sender.userId, confirmMessage.sender.roomId);

                      case 12:
                        _yield$findUserDirect = _context7.sent;
                        _yield$findUserDirect2 = (0, _slicedToArray2["default"])(_yield$findUserDirect, 3);
                        directUserMessageRoom = _yield$findUserDirect2[0];
                        isCurrentRoomDirectMessage = _yield$findUserDirect2[1];
                        userState = _yield$findUserDirect2[2];
                        _context7.next = 19;
                        return (0, _directMessageRoom.inviteUserToDirectMessageRoom)(matrixClient, directUserMessageRoom, userState, confirmMessage.sender.userId, confirmMessage.sender.name, confirmMessage.sender.roomId);

                      case 19:
                        userDirectMessageRoomId = _context7.sent;
                        _context7.next = 22;
                        return (0, _generateCaptcha.generateCaptcha)();

                      case 22:
                        _yield$generateCaptch = _context7.sent;
                        _yield$generateCaptch2 = (0, _slicedToArray2["default"])(_yield$generateCaptch, 3);
                        captchaImage = _yield$generateCaptch2[0];
                        captchaText = _yield$generateCaptch2[1];
                        captchaType = _yield$generateCaptch2[2];
                        _context7.next = 29;
                        return _models["default"].reactdroptip.create({
                          status: 'waiting',
                          captchaType: captchaType,
                          solution: captchaText,
                          userId: findReactUser.id,
                          reactdropId: reactDrop.id
                        });

                      case 29:
                        findReactTip = _context7.sent;

                        if (!(reactDrop.emoji !== confirmMessage.event.content['m.relates_to'].key)) {
                          _context7.next = 43;
                          break;
                        }

                        _context7.prev = 31;
                        _context7.next = 34;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reactdropPressWrongEmojiMessage)());

                      case 34:
                        _context7.next = 39;
                        break;

                      case 36:
                        _context7.prev = 36;
                        _context7.t0 = _context7["catch"](31);
                        console.log(_context7.t0);

                      case 39:
                        _context7.next = 41;
                        return findReactTip.update({
                          status: 'failed'
                        });

                      case 41:
                        _context7.next = 59;
                        break;

                      case 43:
                        _context7.prev = 43;
                        _context7.next = 46;
                        return matrixClient.uploadContent(captchaImage, {
                          rawResponse: false,
                          type: 'image/png'
                        });

                      case 46:
                        uploadResponse = _context7.sent;
                        _context7.next = 49;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", {
                          msgtype: "m.image",
                          url: uploadResponse.content_uri,
                          // info: `321`,
                          body: "captchaImage"
                        });

                      case 49:
                        _context7.next = 51;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reactdropCaptchaMessage)(confirmMessage));

                      case 51:
                        _context7.next = 56;
                        break;

                      case 53:
                        _context7.prev = 53;
                        _context7.t1 = _context7["catch"](43);
                        console.log(_context7.t1);

                      case 56:
                        listenerFunctionForUser = /*#__PURE__*/function () {
                          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(confirmUserMessage, room) {
                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    if (!(confirmUserMessage.sender.userId === reactDropTipUserId && room.roomId === userDirectMessageRoomId)) {
                                      _context3.next = 4;
                                      break;
                                    }

                                    matrixClient.off('Room.timeline', listenerFunctionForUser);
                                    _context3.next = 4;
                                    return _models["default"].sequelize.transaction({
                                      isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                    }, /*#__PURE__*/function () {
                                      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                                        var tempBody, event, _reactDropRecord, reactDropRecord;

                                        return _regenerator["default"].wrap(function _callee$(_context) {
                                          while (1) {
                                            switch (_context.prev = _context.next) {
                                              case 0:
                                                tempBody = '';

                                                if (!(confirmUserMessage.event.type === 'm.room.encrypted')) {
                                                  _context.next = 8;
                                                  break;
                                                }

                                                _context.next = 4;
                                                return matrixClient.crypto.decryptEvent(confirmUserMessage);

                                              case 4:
                                                event = _context.sent;
                                                tempBody = event.clearEvent.content.body;
                                                _context.next = 9;
                                                break;

                                              case 8:
                                                tempBody = confirmUserMessage.event.content.body;

                                              case 9:
                                                if (!(tempBody === findReactTip.solution)) {
                                                  _context.next = 20;
                                                  break;
                                                }

                                                _context.next = 12;
                                                return findReactTip.update({
                                                  status: 'success'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 12:
                                                _context.next = 14;
                                                return _models["default"].reactdrop.findOne({
                                                  where: {
                                                    id: findReactTip.reactdropId
                                                  },
                                                  include: [{
                                                    model: _models["default"].group,
                                                    as: 'group'
                                                  }, {
                                                    model: _models["default"].channel,
                                                    as: 'channel'
                                                  }],
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 14:
                                                _reactDropRecord = _context.sent;
                                                _context.next = 17;
                                                return matrixClient.sendEvent(userDirectMessageRoomId, 'm.reaction', {
                                                  "m.relates_to": {
                                                    event_id: confirmUserMessage.event.event_id,
                                                    key: '✅',
                                                    rel_type: "m.annotation"
                                                  }
                                                });

                                              case 17:
                                                _context.next = 19;
                                                return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.backToReactDropMessage)(backToReactDropLink));

                                              case 19:
                                                return _context.abrupt("return");

                                              case 20:
                                                _context.next = 22;
                                                return findReactTip.update({
                                                  status: 'failed'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 22:
                                                _context.next = 24;
                                                return _models["default"].reactdrop.findOne({
                                                  where: {
                                                    id: findReactTip.reactdropId
                                                  },
                                                  include: [{
                                                    model: _models["default"].group,
                                                    as: 'group'
                                                  }, {
                                                    model: _models["default"].channel,
                                                    as: 'channel'
                                                  }],
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 24:
                                                reactDropRecord = _context.sent;
                                                _context.next = 27;
                                                return matrixClient.sendEvent(userDirectMessageRoomId, 'm.reaction', {
                                                  "m.relates_to": {
                                                    event_id: confirmUserMessage.event.event_id,
                                                    key: '❌',
                                                    rel_type: "m.annotation"
                                                  }
                                                });

                                              case 27:
                                                _context.next = 29;
                                                return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.backToReactDropMessage)(backToReactDropLink));

                                              case 29:
                                                t.afterCommit(function () {
                                                  console.log('done');
                                                });

                                              case 30:
                                              case "end":
                                                return _context.stop();
                                            }
                                          }
                                        }, _callee);
                                      }));

                                      return function (_x11) {
                                        return _ref4.apply(this, arguments);
                                      };
                                    }())["catch"]( /*#__PURE__*/function () {
                                      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                                        return _regenerator["default"].wrap(function _callee2$(_context2) {
                                          while (1) {
                                            switch (_context2.prev = _context2.next) {
                                              case 0:
                                                _context2.prev = 0;
                                                _context2.next = 3;
                                                return _models["default"].error.create({
                                                  type: 'collectAnswerReactDrop',
                                                  error: "".concat(err)
                                                });

                                              case 3:
                                                _context2.next = 8;
                                                break;

                                              case 5:
                                                _context2.prev = 5;
                                                _context2.t0 = _context2["catch"](0);

                                                _logger["default"].error("Error Discord: ".concat(_context2.t0));

                                              case 8:
                                                console.log('failed');

                                              case 9:
                                              case "end":
                                                return _context2.stop();
                                            }
                                          }
                                        }, _callee2, null, [[0, 5]]);
                                      }));

                                      return function (_x12) {
                                        return _ref5.apply(this, arguments);
                                      };
                                    }());

                                  case 4:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function listenerFunctionForUser(_x9, _x10) {
                            return _ref3.apply(this, arguments);
                          };
                        }();

                        matrixClient.on('Room.timeline', listenerFunctionForUser);
                        myTimeoutUserListener = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                          return _regenerator["default"].wrap(function _callee6$(_context6) {
                            while (1) {
                              switch (_context6.prev = _context6.next) {
                                case 0:
                                  _context6.next = 2;
                                  return new Promise(function (r) {
                                    return setTimeout(r, 200);
                                  });

                                case 2:
                                  matrixClient.off('Room.timeline', listenerFunctionForUser);
                                  _context6.next = 5;
                                  return _models["default"].sequelize.transaction({
                                    isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                  }, /*#__PURE__*/function () {
                                    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                                      var findReactUserTwo, findReactTipTwo;
                                      return _regenerator["default"].wrap(function _callee4$(_context4) {
                                        while (1) {
                                          switch (_context4.prev = _context4.next) {
                                            case 0:
                                              _context4.next = 2;
                                              return _models["default"].user.findOne({
                                                where: {
                                                  user_id: "matrix-".concat(confirmMessage.sender.userId)
                                                },
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 2:
                                              findReactUserTwo = _context4.sent;
                                              _context4.next = 5;
                                              return _models["default"].reactdroptip.findOne({
                                                where: {
                                                  userId: findReactUserTwo.id,
                                                  reactdropId: reactDrop.id
                                                },
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 5:
                                              findReactTipTwo = _context4.sent;

                                              if (!(findReactTipTwo.status === 'waiting')) {
                                                _context4.next = 11;
                                                break;
                                              }

                                              _context4.next = 9;
                                              return findReactTipTwo.update({
                                                status: 'failed'
                                              }, {
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 9:
                                              _context4.next = 11;
                                              return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.outOfTimeReactdropMessage)());

                                            case 11:
                                              t.afterCommit(function () {
                                                console.log('done');
                                              });

                                            case 12:
                                            case "end":
                                              return _context4.stop();
                                          }
                                        }
                                      }, _callee4);
                                    }));

                                    return function (_x13) {
                                      return _ref7.apply(this, arguments);
                                    };
                                  }())["catch"]( /*#__PURE__*/function () {
                                    var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err) {
                                      return _regenerator["default"].wrap(function _callee5$(_context5) {
                                        while (1) {
                                          switch (_context5.prev = _context5.next) {
                                            case 0:
                                              _context5.prev = 0;
                                              _context5.next = 3;
                                              return _models["default"].error.create({
                                                type: 'endAnswerReactDrop',
                                                error: "".concat(err)
                                              });

                                            case 3:
                                              _context5.next = 5;
                                              return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.errorMessage)());

                                            case 5:
                                              _context5.next = 10;
                                              break;

                                            case 7:
                                              _context5.prev = 7;
                                              _context5.t0 = _context5["catch"](0);

                                              _logger["default"].error("Error Discord: ".concat(_context5.t0));

                                            case 10:
                                              console.log(err);

                                            case 11:
                                            case "end":
                                              return _context5.stop();
                                          }
                                        }
                                      }, _callee5, null, [[0, 7]]);
                                    }));

                                    return function (_x14) {
                                      return _ref8.apply(this, arguments);
                                    };
                                  }());

                                case 5:
                                  clearTimeout(myTimeoutUserListener);

                                case 6:
                                case "end":
                                  return _context6.stop();
                              }
                            }
                          }, _callee6);
                        })), 60000);

                      case 59:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, null, [[31, 36], [43, 53]]);
              }));

              return function listenerFunction(_x7, _x8) {
                return _ref2.apply(this, arguments);
              };
            }();

            matrixClient.on('Room.timeline', listenerFunction);
            myTimeout = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
              return _regenerator["default"].wrap(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      matrixClient.off('Room.timeline', listenerFunction); // turn off reactdrop listener

                      _context11.next = 3;
                      return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                        var activity;
                        return _regenerator["default"].wrap(function _callee10$(_context10) {
                          while (1) {
                            switch (_context10.prev = _context10.next) {
                              case 0:
                                activity = [];
                                _context10.next = 3;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(t) {
                                    var endReactDrop, returnWallet, updatedWallet, faucetSetting, faucetWatered, amountEach, listOfUsersRained, withoutBotsSorted, _iterator, _step, receiver, earnerWallet, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                                    return _regenerator["default"].wrap(function _callee8$(_context8) {
                                      while (1) {
                                        switch (_context8.prev = _context8.next) {
                                          case 0:
                                            _context8.next = 2;
                                            return _models["default"].reactdrop.findOne({
                                              where: {
                                                id: reactDrop.id,
                                                ended: false
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t,
                                              include: [{
                                                model: _models["default"].group,
                                                as: 'group'
                                              }, {
                                                model: _models["default"].reactdroptip,
                                                as: 'reactdroptips',
                                                required: false,
                                                where: {
                                                  status: 'success'
                                                },
                                                include: [{
                                                  model: _models["default"].user,
                                                  as: 'user',
                                                  include: [{
                                                    model: _models["default"].wallet,
                                                    as: 'wallet'
                                                  }]
                                                }]
                                              }, {
                                                model: _models["default"].user,
                                                as: 'user'
                                              }]
                                            });

                                          case 2:
                                            endReactDrop = _context8.sent;

                                            if (!endReactDrop) {
                                              _context8.next = 78;
                                              break;
                                            }

                                            if (!(endReactDrop.reactdroptips.length <= 0)) {
                                              _context8.next = 17;
                                              break;
                                            }

                                            _context8.next = 7;
                                            return _models["default"].wallet.findOne({
                                              where: {
                                                userId: endReactDrop.userId
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 7:
                                            returnWallet = _context8.sent;
                                            _context8.next = 10;
                                            return returnWallet.update({
                                              available: returnWallet.available + endReactDrop.amount
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 10:
                                            updatedWallet = _context8.sent;
                                            _context8.next = 13;
                                            return endReactDrop.update({
                                              ended: true
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 13:
                                            _context8.next = 15;
                                            return matrixClient.sendEvent(reactDropRoomId, "m.room.message", (0, _matrix.reactDropReturnInitiatorMessage)());

                                          case 15:
                                            _context8.next = 78;
                                            break;

                                          case 17:
                                            _context8.next = 19;
                                            return (0, _settings.waterFaucetSettings)(endReactDrop.group.id, null, t);

                                          case 19:
                                            faucetSetting = _context8.sent;
                                            _context8.next = 22;
                                            return (0, _waterFaucet.waterFaucet)(t, Number(endReactDrop.feeAmount), faucetSetting);

                                          case 22:
                                            faucetWatered = _context8.sent;
                                            amountEach = ((Number(endReactDrop.amount) - Number(endReactDrop.feeAmount)) / Number(endReactDrop.reactdroptips.length)).toFixed(0);
                                            _context8.next = 26;
                                            return endReactDrop.update({
                                              ended: true,
                                              userCount: Number(endReactDrop.reactdroptips.length)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 26:
                                            listOfUsersRained = [];
                                            _context8.next = 29;
                                            return _lodash["default"].sortBy(endReactDrop.reactdroptips, 'createdAt');

                                          case 29:
                                            withoutBotsSorted = _context8.sent;
                                            // eslint-disable-next-line no-restricted-syntax
                                            _iterator = _createForOfIteratorHelper(withoutBotsSorted);
                                            _context8.prev = 31;

                                            _iterator.s();

                                          case 33:
                                            if ((_step = _iterator.n()).done) {
                                              _context8.next = 49;
                                              break;
                                            }

                                            receiver = _step.value;
                                            _context8.next = 37;
                                            return receiver.user.wallet.update({
                                              available: receiver.user.wallet.available + Number(amountEach)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 37:
                                            earnerWallet = _context8.sent;

                                            if (receiver.user.ignoreMe) {
                                              listOfUsersRained.push("".concat(receiver.user.username));
                                            } else {
                                              userIdReceivedRain = receiver.user.user_id.replace('matrix-', '');
                                              listOfUsersRained.push("<a href=\"https://matrix.to/#/".concat(userIdReceivedRain, "\">").concat(receiver.user.username, "</a>"));
                                            }

                                            tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                                            _context8.next = 42;
                                            return _models["default"].activity.create({
                                              amount: Number(amountEach),
                                              type: 'reactdroptip_s',
                                              spenderId: endReactDrop.user.id,
                                              earnerId: receiver.user.id,
                                              reactdropId: endReactDrop.id,
                                              reactdroptipId: receiver.id,
                                              earner_balance: earnerWallet.available + earnerWallet.locked
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 42:
                                            tipActivity = _context8.sent;
                                            _context8.next = 45;
                                            return _models["default"].activity.findOne({
                                              where: {
                                                id: tipActivity.id
                                              },
                                              include: [{
                                                model: _models["default"].user,
                                                as: 'earner'
                                              }, {
                                                model: _models["default"].user,
                                                as: 'spender'
                                              }, {
                                                model: _models["default"].reactdrop,
                                                as: 'reactdrop'
                                              }, {
                                                model: _models["default"].reactdroptip,
                                                as: 'reactdroptip'
                                              }],
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 45:
                                            tipActivity = _context8.sent;
                                            activity.unshift(tipActivity);

                                          case 47:
                                            _context8.next = 33;
                                            break;

                                          case 49:
                                            _context8.next = 54;
                                            break;

                                          case 51:
                                            _context8.prev = 51;
                                            _context8.t0 = _context8["catch"](31);

                                            _iterator.e(_context8.t0);

                                          case 54:
                                            _context8.prev = 54;

                                            _iterator.f();

                                            return _context8.finish(54);

                                          case 57:
                                            newStringListUsers = listOfUsersRained.join(", ");
                                            cutStringListUsers = newStringListUsers.match(/.{1,6999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                                            // eslint-disable-next-line no-restricted-syntax
                                            _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                                            _context8.prev = 60;

                                            _iterator2.s();

                                          case 62:
                                            if ((_step2 = _iterator2.n()).done) {
                                              _context8.next = 68;
                                              break;
                                            }

                                            element = _step2.value;
                                            _context8.next = 66;
                                            return matrixClient.sendEvent(reactDropRoomId, "m.room.message", (0, _matrix.userListMessage)(element));

                                          case 66:
                                            _context8.next = 62;
                                            break;

                                          case 68:
                                            _context8.next = 73;
                                            break;

                                          case 70:
                                            _context8.prev = 70;
                                            _context8.t1 = _context8["catch"](60);

                                            _iterator2.e(_context8.t1);

                                          case 73:
                                            _context8.prev = 73;

                                            _iterator2.f();

                                            return _context8.finish(73);

                                          case 76:
                                            _context8.next = 78;
                                            return matrixClient.sendEvent(reactDropRoomId, "m.room.message", (0, _matrix.afterReactDropSuccessMessage)(endReactDrop, amountEach, endReactDrop.user));

                                          case 78:
                                            t.afterCommit(function () {
                                              console.log('done');
                                            });

                                          case 79:
                                          case "end":
                                            return _context8.stop();
                                        }
                                      }
                                    }, _callee8, null, [[31, 51, 54, 57], [60, 70, 73, 76]]);
                                  }));

                                  return function (_x15) {
                                    return _ref11.apply(this, arguments);
                                  };
                                }())["catch"]( /*#__PURE__*/function () {
                                  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(err) {
                                    return _regenerator["default"].wrap(function _callee9$(_context9) {
                                      while (1) {
                                        switch (_context9.prev = _context9.next) {
                                          case 0:
                                            _context9.prev = 0;
                                            _context9.next = 3;
                                            return _models["default"].error.create({
                                              type: 'endReactDrop',
                                              error: "".concat(err)
                                            });

                                          case 3:
                                            _context9.next = 8;
                                            break;

                                          case 5:
                                            _context9.prev = 5;
                                            _context9.t0 = _context9["catch"](0);

                                            _logger["default"].error("Error Discord: ".concat(_context9.t0));

                                          case 8:
                                            console.log(err);
                                            console.log('error');

                                          case 10:
                                          case "end":
                                            return _context9.stop();
                                        }
                                      }
                                    }, _callee9, null, [[0, 5]]);
                                  }));

                                  return function (_x16) {
                                    return _ref12.apply(this, arguments);
                                  };
                                }());

                              case 3:
                                if (activity.length > 0) {
                                  io.to('admin').emit('updateActivity', {
                                    activity: activity
                                  });
                                }

                              case 4:
                              case "end":
                                return _context10.stop();
                            }
                          }
                        }, _callee10);
                      })));

                    case 3:
                      clearTimeout(myTimeout);

                    case 4:
                    case "end":
                      return _context11.stop();
                  }
                }
              }, _callee11);
            })), distance);

          case 5:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function listenMatrixReactDrop(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

exports.listenMatrixReactDrop = listenMatrixReactDrop;

var matrixReactDrop = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage) {
    var activity, useEmojis;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            activity = [];
            useEmojis = [];
            _context16.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, textTime, cutLastTimeLetter, cutNumberTime, isnum, timeFailActivity, _timeFailActivity, allEmojis, failEmojiActivity, timeDay, timeHour, timeMinute, timeSecond, dateObj, countDownDate, now, distance, randomAmount, i, randomX, shuffeledEmojisArray, group, wallet, fee, newReactDrop, findNotUpdatedReactDrop, sendReactDropMessage, newUpdatedReactDrop, preActivity, finalActivity, findUpdatedReactDrop, _iterator3, _step3, shufEmoji, updateMessage;

                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        if (!isCurrentRoomDirectMessage) {
                          _context14.next = 4;
                          break;
                        }

                        _context14.next = 3;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notInDirectMessage)(message, 'Flood'));

                      case 3:
                        return _context14.abrupt("return");

                      case 4:
                        _context14.next = 6;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, filteredMessage[1].toLowerCase());

                      case 6:
                        _yield$userWalletExis = _context14.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context14.next = 13;
                          break;
                        }

                        return _context14.abrupt("return");

                      case 13:
                        _context14.next = 15;
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

                      case 15:
                        _yield$validateAmount = _context14.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context14.next = 22;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context14.abrupt("return");

                      case 22:
                        textTime = '5m';

                        if (filteredMessage[3]) {
                          // eslint-disable-next-line prefer-destructuring
                          textTime = filteredMessage[3];
                        }

                        cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                        cutNumberTime = textTime.substring(0, textTime.length - 1);
                        isnum = /^\d+$/.test(cutNumberTime);

                        if (!(!isnum // && Number(cutNumberTime) < 0
                        || cutLastTimeLetter !== 'd' && cutLastTimeLetter !== 'h' && cutLastTimeLetter !== 'm' && cutLastTimeLetter !== 's')) {
                          _context14.next = 35;
                          break;
                        }

                        _context14.next = 30;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        timeFailActivity = _context14.sent;
                        activity.unshift(timeFailActivity);
                        _context14.next = 34;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidTimeMessage)(message, 'Reactdrop'));

                      case 34:
                        return _context14.abrupt("return");

                      case 35:
                        if (!(cutLastTimeLetter === 's' && Number(cutNumberTime) < 60)) {
                          _context14.next = 43;
                          break;
                        }

                        _context14.next = 38;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 38:
                        _timeFailActivity = _context14.sent;
                        activity.unshift(_timeFailActivity);
                        _context14.next = 42;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.minimumTimeReactDropMessage)(message, 'Reactdrop'));

                      case 42:
                        return _context14.abrupt("return");

                      case 43:
                        allEmojis = _emoji["default"];

                        if (!filteredMessage[4]) {
                          // eslint-disable-next-line no-param-reassign
                          filteredMessage[4] = _lodash["default"].sample(allEmojis);
                        }

                        if (allEmojis.includes(filteredMessage[4])) {
                          _context14.next = 53;
                          break;
                        }

                        _context14.next = 48;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 48:
                        failEmojiActivity = _context14.sent;
                        activity.unshift(failEmojiActivity);
                        _context14.next = 52;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidEmojiMessage)(message, 'Reactdrop'));

                      case 52:
                        return _context14.abrupt("return");

                      case 53:
                        timeDay = Number(cutNumberTime) * 24 * 60 * 60 * 1000;
                        timeHour = Number(cutNumberTime) * 60 * 60 * 1000;
                        timeMinute = Number(cutNumberTime) * 60 * 1000;
                        timeSecond = Number(cutNumberTime) * 1000;

                        if (!(cutLastTimeLetter === 'd' && timeDay > 172800000 || cutLastTimeLetter === 'h' && timeHour > 172800000 || cutLastTimeLetter === 'm' && timeMinute > 172800000 || cutLastTimeLetter === 's' && timeSecond > 172800000)) {
                          _context14.next = 61;
                          break;
                        }

                        _context14.next = 60;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.maxTimeReactdropMessage)());

                      case 60:
                        return _context14.abrupt("return");

                      case 61:
                        _context14.next = 63;
                        return new Date().getTime();

                      case 63:
                        dateObj = _context14.sent;

                        if (cutLastTimeLetter === 'd') {
                          dateObj += timeDay;
                        }

                        if (cutLastTimeLetter === 'h') {
                          dateObj += timeHour;
                        }

                        if (cutLastTimeLetter === 'm') {
                          dateObj += timeMinute;
                        }

                        if (cutLastTimeLetter === 's') {
                          dateObj += timeSecond;
                        }

                        _context14.next = 70;
                        return new Date(dateObj);

                      case 70:
                        dateObj = _context14.sent;
                        _context14.next = 73;
                        return dateObj.getTime();

                      case 73:
                        countDownDate = _context14.sent;
                        _context14.next = 76;
                        return new Date().getTime();

                      case 76:
                        now = _context14.sent;
                        distance = countDownDate - now;
                        randomAmount = Math.floor(Math.random() * 3) + 2;

                        for (i = 0; i < randomAmount; i += 1) {
                          randomX = Math.floor(Math.random() * allEmojis.length);
                          useEmojis.push(allEmojis[parseInt(randomX, 10)]);
                        }

                        _context14.next = 82;
                        return useEmojis.push(filteredMessage[4]);

                      case 82:
                        _context14.next = 84;
                        return _lodash["default"].shuffle(useEmojis);

                      case 84:
                        shuffeledEmojisArray = _context14.sent;
                        _context14.next = 87;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "matrix-".concat(message.sender.roomId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 87:
                        group = _context14.sent;

                        if (group) {
                          _context14.next = 91;
                          break;
                        }

                        console.log('group not found');
                        return _context14.abrupt("return");

                      case 91:
                        _context14.next = 93;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 93:
                        wallet = _context14.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context14.next = 97;
                        return _models["default"].reactdrop.create({
                          feeAmount: Number(fee),
                          amount: amount,
                          groupId: group.id,
                          ends: dateObj,
                          emoji: filteredMessage[4],
                          messageId: 'notYetSpecified',
                          userId: user.id,
                          side: 'matrix'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 97:
                        newReactDrop = _context14.sent;
                        _context14.next = 100;
                        return _models["default"].reactdrop.findOne({
                          where: {
                            id: newReactDrop.id
                          },
                          include: [{
                            model: _models["default"].group,
                            as: 'group'
                          }, {
                            model: _models["default"].user,
                            as: 'user'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 100:
                        findNotUpdatedReactDrop = _context14.sent;
                        _context14.next = 103;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.matrixReactDropMessage)(newReactDrop.id, distance, findNotUpdatedReactDrop.user, filteredMessage[4], amount));

                      case 103:
                        sendReactDropMessage = _context14.sent;
                        _context14.next = 106;
                        return newReactDrop.update({
                          messageId: sendReactDropMessage.event_id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 106:
                        newUpdatedReactDrop = _context14.sent;
                        _context14.next = 109;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'reactdrop_s',
                          spenderId: user.id,
                          reactdropId: newUpdatedReactDrop.id,
                          spender_balance: wallet.available + wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 109:
                        preActivity = _context14.sent;
                        _context14.next = 112;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].reactdrop,
                            as: 'reactdrop'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 112:
                        finalActivity = _context14.sent;
                        activity.unshift(finalActivity);
                        _context14.next = 116;
                        return _models["default"].reactdrop.findOne({
                          where: {
                            id: newUpdatedReactDrop.id
                          },
                          include: [{
                            model: _models["default"].group,
                            as: 'group'
                          }, {
                            model: _models["default"].user,
                            as: 'user'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 116:
                        findUpdatedReactDrop = _context14.sent;
                        listenMatrixReactDrop(matrixClient, sendReactDropMessage.event_id, distance, findUpdatedReactDrop, io, queue); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator3 = _createForOfIteratorHelper(shuffeledEmojisArray);
                        _context14.prev = 119;

                        _iterator3.s();

                      case 121:
                        if ((_step3 = _iterator3.n()).done) {
                          _context14.next = 127;
                          break;
                        }

                        shufEmoji = _step3.value;
                        _context14.next = 125;
                        return matrixClient.sendEvent(message.sender.roomId, 'm.reaction', {
                          "m.relates_to": {
                            event_id: sendReactDropMessage.event_id,
                            key: shufEmoji,
                            rel_type: "m.annotation"
                          }
                        });

                      case 125:
                        _context14.next = 121;
                        break;

                      case 127:
                        _context14.next = 132;
                        break;

                      case 129:
                        _context14.prev = 129;
                        _context14.t0 = _context14["catch"](119);

                        _iterator3.e(_context14.t0);

                      case 132:
                        _context14.prev = 132;

                        _iterator3.f();

                        return _context14.finish(132);

                      case 135:
                        updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                          var editedMessage;
                          return _regenerator["default"].wrap(function _callee13$(_context13) {
                            while (1) {
                              switch (_context13.prev = _context13.next) {
                                case 0:
                                  now = new Date().getTime();
                                  distance = countDownDate - now;
                                  editedMessage = (0, _matrix.matrixReactDropMessage)(newReactDrop.id, distance, findUpdatedReactDrop.user, filteredMessage[4], amount);
                                  _context13.next = 5;
                                  return matrixClient.sendEvent(message.sender.roomId, 'm.room.message', {
                                    "m.relates_to": {
                                      event_id: sendReactDropMessage.event_id,
                                      rel_type: "m.replace"
                                    },
                                    msgtype: "m.text",
                                    format: 'org.matrix.custom.html',
                                    formatted_body: editedMessage.formatted_body,
                                    body: editedMessage.body,
                                    "m.new_content": editedMessage
                                  });

                                case 5:
                                  if (distance < 0) {
                                    clearInterval(updateMessage);
                                  }

                                case 6:
                                case "end":
                                  return _context13.stop();
                              }
                            }
                          }, _callee13);
                        })), 10000);
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 137:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14, null, [[119, 129, 132, 135]]);
              }));

              return function (_x27) {
                return _ref14.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(err) {
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.prev = 0;
                        _context15.next = 3;
                        return _models["default"].error.create({
                          type: 'reactdrop',
                          error: "".concat(err)
                        });

                      case 3:
                        _context15.next = 8;
                        break;

                      case 5:
                        _context15.prev = 5;
                        _context15.t0 = _context15["catch"](0);

                        _logger["default"].error("Error Matrix: ".concat(_context15.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("reactdrop error: ".concat(err));

                        _context15.prev = 10;
                        _context15.next = 13;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Reactdrop'));

                      case 13:
                        _context15.next = 18;
                        break;

                      case 15:
                        _context15.prev = 15;
                        _context15.t1 = _context15["catch"](10);
                        console.log(_context15.t1);

                      case 18:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15, null, [[0, 5], [10, 15]]);
              }));

              return function (_x28) {
                return _ref16.apply(this, arguments);
              };
            }());

          case 4:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function matrixReactDrop(_x17, _x18, _x19, _x20, _x21, _x22, _x23, _x24, _x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

exports.matrixReactDrop = matrixReactDrop;