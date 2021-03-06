"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipRunesToMatrixUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _matrix = require("../../messages/matrix");

var _validateAmount = require("../../helpers/client/matrix/validateAmount");

var _waterFaucet = require("../../helpers/waterFaucet");

var _userWalletExist = require("../../helpers/client/matrix/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tipRunesToMatrixUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage, myBody) {
    var activity, AmountPosition, AmountPositionEnded, usersToTip, type;
    return _regenerator["default"].wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            activity = [];
            AmountPosition = 1;
            AmountPositionEnded = false;
            usersToTip = [];
            type = 'split';
            _context4.next = 7;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _loop, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, updatedBalance, fee, userTipAmount, faucetWatered, tipRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, tipee, tipeeWallet, tiptipRecord, tipActivity, userIdReceivedRain, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                return _regenerator["default"].wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!isCurrentRoomDirectMessage) {
                          _context2.next = 4;
                          break;
                        }

                        _context2.next = 3;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notInDirectMessage)(message, 'Tip'));

                      case 3:
                        return _context2.abrupt("return");

                      case 4:
                        _context2.next = 6;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, filteredMessage[1].toLowerCase());

                      case 6:
                        _yield$userWalletExis = _context2.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context2.next = 13;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 13:
                        _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                          var matrixId, linkRx, link, userExist, userIdTest;
                          return _regenerator["default"].wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  matrixId = void 0;

                                  if (filteredMessage[parseInt(AmountPosition, 10)].startsWith('<a')) {
                                    linkRx = /<a[^>]*href=["']([^"']*)["']/g; // const link = filteredMessage[AmountPosition].match(linkRx);

                                    link = linkRx.exec(filteredMessage[parseInt(AmountPosition, 10)]);
                                    matrixId = link[1].split("/").pop();
                                  }

                                  console.log('matrixId');
                                  console.log(matrixId); // eslint-disable-next-line no-await-in-loop

                                  _context.next = 6;
                                  return _models["default"].user.findOne({
                                    where: {
                                      user_id: "matrix-".concat(matrixId)
                                    },
                                    include: [{
                                      model: _models["default"].wallet,
                                      as: 'wallet',
                                      required: true,
                                      include: [{
                                        model: _models["default"].address,
                                        as: 'addresses',
                                        required: false
                                      }]
                                    }],
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 6:
                                  userExist = _context.sent;
                                  console.log(userExist);
                                  console.log('userExist');

                                  if (userExist) {
                                    userIdTest = userExist.user_id.replace('matrix-', '');

                                    if (userIdTest !== message.sender.userId) {
                                      if (!usersToTip.find(function (o) {
                                        return o.id === userExist.id;
                                      })) {
                                        usersToTip.push(userExist);
                                      }
                                    }
                                  }

                                  AmountPosition += 1;

                                  if (!filteredMessage[parseInt(AmountPosition, 10)].startsWith('<a')) {
                                    AmountPositionEnded = true;
                                  }

                                case 12:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _loop);
                        });

                      case 14:
                        if (AmountPositionEnded) {
                          _context2.next = 18;
                          break;
                        }

                        return _context2.delegateYield(_loop(), "t0", 16);

                      case 16:
                        _context2.next = 14;
                        break;

                      case 18:
                        console.log('userToTip');
                        console.log(usersToTip);

                        if (!(usersToTip.length < 1)) {
                          _context2.next = 24;
                          break;
                        }

                        _context2.next = 23;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notEnoughUsers)(message, 'Tip'));

                      case 23:
                        return _context2.abrupt("return");

                      case 24:
                        if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
                          type = 'each';
                        } // verify amount


                        console.log(filteredMessage[parseInt(AmountPosition, 10)]);
                        _context2.next = 28;
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[parseInt(AmountPosition, 10)], user, setting, 'tip', type, usersToTip);

                      case 28:
                        _yield$validateAmount = _context2.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 3);
                        validAmount = _yield$validateAmount2[0];
                        activityValiateAmount = _yield$validateAmount2[1];
                        amount = _yield$validateAmount2[2];

                        if (validAmount) {
                          _context2.next = 36;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context2.abrupt("return");

                      case 36:
                        _context2.next = 38;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 38:
                        updatedBalance = _context2.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = (amount - Number(fee)) / usersToTip.length;
                        _context2.next = 43;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 43:
                        faucetWatered = _context2.sent;
                        _context2.next = 46;
                        return _models["default"].tip.create({
                          feeAmount: fee,
                          amount: amount,
                          type: type,
                          userCount: usersToTip.length,
                          userId: user.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 46:
                        tipRecord = _context2.sent;
                        _context2.next = 49;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'tip_s',
                          spenderId: user.id,
                          tipId: tipRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        preActivity = _context2.sent;
                        _context2.next = 52;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].tip,
                            as: 'tip'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 52:
                        finalActivity = _context2.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        _iterator = _createForOfIteratorHelper(usersToTip);
                        _context2.prev = 56;

                        _iterator.s();

                      case 58:
                        if ((_step = _iterator.n()).done) {
                          _context2.next = 77;
                          break;
                        }

                        tipee = _step.value;
                        _context2.next = 62;
                        return tipee.wallet.update({
                          available: tipee.wallet.available + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 62:
                        tipeeWallet = _context2.sent;
                        _context2.next = 65;
                        return _models["default"].tiptip.create({
                          amount: Number(userTipAmount),
                          userId: tipee.id,
                          tipId: tipRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 65:
                        tiptipRecord = _context2.sent;
                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context2.next = 69;
                        return _models["default"].activity.create({
                          amount: Number(userTipAmount),
                          type: 'tiptip_s',
                          spenderId: user.id,
                          earnerId: tipee.id,
                          tipId: tipRecord.id,
                          tiptipId: tiptipRecord.id,
                          earner_balance: tipeeWallet.available + tipeeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 69:
                        tipActivity = _context2.sent;
                        _context2.next = 72;
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
                            model: _models["default"].tip,
                            as: 'tip'
                          }, {
                            model: _models["default"].tiptip,
                            as: 'tiptip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 72:
                        tipActivity = _context2.sent;
                        activity.unshift(tipActivity);

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(tipee.username));
                        } else {
                          userIdReceivedRain = tipee.user_id.replace('matrix-', '');
                          listOfUsersRained.push("<a href=\"https://matrix.to/#/".concat(userIdReceivedRain, "\">").concat(tipee.username, "</a>"));
                        }

                      case 75:
                        _context2.next = 58;
                        break;

                      case 77:
                        _context2.next = 82;
                        break;

                      case 79:
                        _context2.prev = 79;
                        _context2.t1 = _context2["catch"](56);

                        _iterator.e(_context2.t1);

                      case 82:
                        _context2.prev = 82;

                        _iterator.f();

                        return _context2.finish(82);

                      case 85:
                        if (!(listOfUsersRained.length === 1)) {
                          _context2.next = 90;
                          break;
                        }

                        _context2.next = 88;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.tipSingleSuccessMessage)(message, tipRecord.id, listOfUsersRained, userTipAmount));

                      case 88:
                        _context2.next = 112;
                        break;

                      case 90:
                        if (!(listOfUsersRained.length > 1)) {
                          _context2.next = 112;
                          break;
                        }

                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context2.prev = 94;

                        _iterator2.s();

                      case 96:
                        if ((_step2 = _iterator2.n()).done) {
                          _context2.next = 102;
                          break;
                        }

                        element = _step2.value;
                        _context2.next = 100;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.userListMessage)(element));

                      case 100:
                        _context2.next = 96;
                        break;

                      case 102:
                        _context2.next = 107;
                        break;

                      case 104:
                        _context2.prev = 104;
                        _context2.t2 = _context2["catch"](94);

                        _iterator2.e(_context2.t2);

                      case 107:
                        _context2.prev = 107;

                        _iterator2.f();

                        return _context2.finish(107);

                      case 110:
                        _context2.next = 112;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.tipMultipleSuccessMessage)(message, tipRecord.id, listOfUsersRained, userTipAmount, type));

                      case 112:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 113:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee, null, [[56, 79, 82, 85], [94, 104, 107, 110]]);
              }));

              return function (_x12) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return _models["default"].error.create({
                          type: 'tip',
                          error: "".concat(err)
                        });

                      case 3:
                        _context3.next = 8;
                        break;

                      case 5:
                        _context3.prev = 5;
                        _context3.t0 = _context3["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context3.t0));

                      case 8:
                        _logger["default"].error("tip error: ".concat(err));

                        _context3.prev = 9;
                        _context3.next = 12;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Tip'));

                      case 12:
                        _context3.next = 17;
                        break;

                      case 14:
                        _context3.prev = 14;
                        _context3.t1 = _context3["catch"](9);
                        console.log(_context3.t1);

                      case 17:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [9, 14]]);
              }));

              return function (_x13) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 7:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3);
  }));

  return function tipRunesToMatrixUser(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToMatrixUser = tipRunesToMatrixUser;