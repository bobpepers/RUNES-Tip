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

var _validateAmount = require("../../helpers/matrix/validateAmount");

var _waterFaucet = require("../../helpers/waterFaucet");

var _userWalletExist = require("../../helpers/matrix/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tipRunesToMatrixUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage) {
    var activity, user, AmountPosition, AmountPositionEnded, usersToTip, type, userActivity;
    return _regenerator["default"].wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!isCurrentRoomDirectMessage) {
              _context4.next = 10;
              break;
            }

            _context4.prev = 1;
            _context4.next = 4;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notInDirectMessage)(message, 'Tip'));

          case 4:
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](1);
            console.log(_context4.t0);

          case 9:
            return _context4.abrupt("return");

          case 10:
            activity = [];
            AmountPosition = 1;
            AmountPositionEnded = false;
            usersToTip = [];
            type = 'split';
            _context4.next = 17;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, _loop, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, userTipAmount, faucetWatered, tipRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, tipee, tipeeWallet, tiptipRecord, tipActivity, userIdReceivedRain, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                return _regenerator["default"].wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, filteredMessage[1].toLowerCase());

                      case 2:
                        _yield$userWalletExis = _context2.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context2.next = 9;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 9:
                        console.log(usersToTip);
                        console.log(AmountPosition);
                        console.log(type); // make users to tip array

                        _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                          var matrixId, linkRx, link, userExist, userIdTest;
                          return _regenerator["default"].wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  matrixId = void 0;

                                  if (filteredMessage[parseInt(AmountPosition, 10)].startsWith('<a')) {
                                    linkRx = /<a[^>]*href=["']([^"']*)["']/g; // const link = filteredMessage[AmountPosition].match(linkRx);

                                    // const link = filteredMessage[AmountPosition].match(linkRx);
                                    link = linkRx.exec(filteredMessage[parseInt(AmountPosition, 10)]);
                                    matrixId = link[1].split("/").pop();
                                  }

                                  console.log(matrixId); // eslint-disable-next-line no-await-in-loop

                                  _context.next = 5;
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
                                        required: true
                                      }]
                                    }],
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 5:
                                  userExist = _context.sent;

                                  if (userExist) {
                                    userIdTest = userExist.user_id.replace('matrix-', '');

                                    if (userIdTest !== message.sender.userId) {
                                      if (!usersToTip.find(function (o) {
                                        return o.id === userExist.id;
                                      })) {
                                        usersToTip.push(userExist);
                                      }
                                    }
                                  } // usersToTip.push(filteredMessage[AmountPosition]);


                                  // usersToTip.push(filteredMessage[AmountPosition]);
                                  AmountPosition += 1;

                                  if (!filteredMessage[parseInt(AmountPosition, 10)].startsWith('<a')) {
                                    AmountPositionEnded = true;
                                  }

                                case 9:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _loop);
                        });

                      case 13:
                        if (AmountPositionEnded) {
                          _context2.next = 17;
                          break;
                        }

                        return _context2.delegateYield(_loop(), "t0", 15);

                      case 15:
                        _context2.next = 13;
                        break;

                      case 17:
                        if (!(usersToTip.length < 1)) {
                          _context2.next = 27;
                          break;
                        }

                        _context2.prev = 18;
                        _context2.next = 21;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notEnoughUsers)(message, 'Tip'));

                      case 21:
                        _context2.next = 26;
                        break;

                      case 23:
                        _context2.prev = 23;
                        _context2.t1 = _context2["catch"](18);
                        console.log(_context2.t1);

                      case 26:
                        return _context2.abrupt("return");

                      case 27:
                        if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
                          type = 'each';
                        } // verify amount


                        // verify amount
                        console.log(filteredMessage[parseInt(AmountPosition, 10)]);
                        _context2.next = 31;
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[parseInt(AmountPosition, 10)], user, setting, 'tip', type, usersToTip);

                      case 31:
                        _yield$validateAmount = _context2.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context2.next = 38;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context2.abrupt("return");

                      case 38:
                        _context2.next = 40;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 40:
                        updatedBalance = _context2.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = (amount - Number(fee)) / usersToTip.length;
                        _context2.next = 45;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 45:
                        faucetWatered = _context2.sent;
                        _context2.next = 48;
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

                      case 48:
                        tipRecord = _context2.sent;
                        _context2.next = 51;
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

                      case 51:
                        preActivity = _context2.sent;
                        _context2.next = 54;
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

                      case 54:
                        finalActivity = _context2.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToTip);
                        _context2.prev = 58;

                        _iterator.s();

                      case 60:
                        if ((_step = _iterator.n()).done) {
                          _context2.next = 79;
                          break;
                        }

                        tipee = _step.value;
                        _context2.next = 64;
                        return tipee.wallet.update({
                          available: tipee.wallet.available + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 64:
                        tipeeWallet = _context2.sent;
                        _context2.next = 67;
                        return _models["default"].tiptip.create({
                          amount: Number(userTipAmount),
                          userId: tipee.id,
                          tipId: tipRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 67:
                        tiptipRecord = _context2.sent;
                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context2.next = 71;
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

                      case 71:
                        tipActivity = _context2.sent;
                        _context2.next = 74;
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

                      case 74:
                        tipActivity = _context2.sent;
                        activity.unshift(tipActivity);

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(tipee.username));
                        } else {
                          userIdReceivedRain = tipee.user_id.replace('matrix-', '');
                          listOfUsersRained.push("<a href=\"https://matrix.to/#/".concat(userIdReceivedRain, "\">").concat(tipee.username, "</a>"));
                        }

                      case 77:
                        _context2.next = 60;
                        break;

                      case 79:
                        _context2.next = 84;
                        break;

                      case 81:
                        _context2.prev = 81;
                        _context2.t2 = _context2["catch"](58);

                        _iterator.e(_context2.t2);

                      case 84:
                        _context2.prev = 84;

                        _iterator.f();

                        return _context2.finish(84);

                      case 87:
                        if (!(listOfUsersRained.length === 1)) {
                          _context2.next = 98;
                          break;
                        }

                        _context2.prev = 88;
                        _context2.next = 91;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.tipSingleSuccessMessage)(message, tipRecord.id, listOfUsersRained, userTipAmount));

                      case 91:
                        _context2.next = 96;
                        break;

                      case 93:
                        _context2.prev = 93;
                        _context2.t3 = _context2["catch"](88);
                        console.log(_context2.t3);

                      case 96:
                        _context2.next = 132;
                        break;

                      case 98:
                        if (!(listOfUsersRained.length > 1)) {
                          _context2.next = 132;
                          break;
                        }

                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context2.prev = 102;

                        _iterator2.s();

                      case 104:
                        if ((_step2 = _iterator2.n()).done) {
                          _context2.next = 116;
                          break;
                        }

                        element = _step2.value;
                        _context2.prev = 106;
                        _context2.next = 109;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.userListMessage)(element));

                      case 109:
                        _context2.next = 114;
                        break;

                      case 111:
                        _context2.prev = 111;
                        _context2.t4 = _context2["catch"](106);
                        console.log(_context2.t4);

                      case 114:
                        _context2.next = 104;
                        break;

                      case 116:
                        _context2.next = 121;
                        break;

                      case 118:
                        _context2.prev = 118;
                        _context2.t5 = _context2["catch"](102);

                        _iterator2.e(_context2.t5);

                      case 121:
                        _context2.prev = 121;

                        _iterator2.f();

                        return _context2.finish(121);

                      case 124:
                        _context2.prev = 124;
                        _context2.next = 127;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.tipMultipleSuccessMessage)(message, tipRecord.id, listOfUsersRained, userTipAmount, type));

                      case 127:
                        _context2.next = 132;
                        break;

                      case 129:
                        _context2.prev = 129;
                        _context2.t6 = _context2["catch"](124);
                        console.log(_context2.t6);

                      case 132:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 133:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee, null, [[18, 23], [58, 81, 84, 87], [88, 93], [102, 118, 121, 124], [106, 111], [124, 129]]);
              }));

              return function (_x11) {
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
                        console.log(err);

                        _logger["default"].error("tip error: ".concat(err));

                        _context3.prev = 10;
                        _context3.next = 13;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Tip'));

                      case 13:
                        _context3.next = 18;
                        break;

                      case 15:
                        _context3.prev = 15;
                        _context3.t1 = _context3["catch"](10);
                        console.log(_context3.t1);

                      case 18:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 15]]);
              }));

              return function (_x12) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 17:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3, null, [[1, 6]]);
  }));

  return function tipRunesToMatrixUser(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToMatrixUser = tipRunesToMatrixUser;