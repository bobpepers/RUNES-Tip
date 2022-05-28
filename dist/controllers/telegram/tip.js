"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipToTelegramUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _telegram = require("telegram");

var _models = _interopRequireDefault(require("../../models"));

var _telegram2 = require("../../messages/telegram");

var _validateAmount = require("../../helpers/client/telegram/validateAmount");

var _waterFaucet = require("../../helpers/waterFaucet");

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _userToMention = require("../../helpers/client/telegram/userToMention");

var _user = require("./user");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tipToTelegramUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(telegramClient, telegramApiClient, ctx, filteredMessage, io, groupTask, setting, faucetSetting, queue) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _loop, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, updatedBalance, fee, userTipAmount, faucetWatered, tipRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, tipee, tipeeWallet, tiptipRecord, tipActivity, _yield$getUserToMenti, _yield$getUserToMenti2, userToMention, userId, cutStringListUsers, i, _i, _cutStringListUsers, element;

                return _regenerator["default"].wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'tip');

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
                        _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                          var userExist, userIdTest, newUserExist, newUserInfo, myNewUserInfo, _yield$generateUserWa, _yield$generateUserWa2, newUser, newAccount, _newUserInfo, _myNewUserInfo, _yield$generateUserWa3, _yield$generateUserWa4, _newUser, _newAccount, _userIdTest;

                          return _regenerator["default"].wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  userExist = false;

                                  if (!(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'text_mention' && !ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.is_bot)) {
                                    _context.next = 7;
                                    break;
                                  }

                                  _context.next = 4;
                                  return _models["default"].user.findOne({
                                    where: {
                                      user_id: "telegram-".concat(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.id)
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

                                case 4:
                                  userExist = _context.sent;
                                  _context.next = 11;
                                  break;

                                case 7:
                                  if (!(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'mention')) {
                                    _context.next = 11;
                                    break;
                                  }

                                  _context.next = 10;
                                  return _models["default"].user.findOne({
                                    where: {
                                      username: "".concat(filteredMessage[parseInt(AmountPosition, 10)].substring(1)),
                                      user_id: (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'telegram-')
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

                                case 10:
                                  userExist = _context.sent;

                                case 11:
                                  if (!userExist) {
                                    _context.next = 16;
                                    break;
                                  }

                                  userIdTest = userExist.user_id.replace('telegram-', '');

                                  if (Number(userIdTest) !== ctx.update.message.from.id) {
                                    if (!usersToTip.find(function (o) {
                                      return o.id === userExist.id;
                                    })) {
                                      usersToTip.push(userExist);
                                    }
                                  }

                                  _context.next = 62;
                                  break;

                                case 16:
                                  if (userExist) {
                                    _context.next = 62;
                                    break;
                                  }

                                  if (!(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'text_mention' && !ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.is_bot)) {
                                    _context.next = 40;
                                    break;
                                  }

                                  _context.prev = 18;
                                  _context.next = 21;
                                  return telegramApiClient.invoke(new _telegram.Api.users.GetFullUser({
                                    id: "".concat(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.id)
                                  }));

                                case 21:
                                  newUserInfo = _context.sent;
                                  _context.next = 27;
                                  break;

                                case 24:
                                  _context.prev = 24;
                                  _context.t0 = _context["catch"](18);
                                  console.log(_context.t0);

                                case 27:
                                  if (!(newUserInfo && newUserInfo.users.length > 0 && !newUserInfo.users[0].bot)) {
                                    _context.next = 38;
                                    break;
                                  }

                                  myNewUserInfo = {
                                    userId: Number(newUserInfo.users[0].id.value),
                                    username: newUserInfo.users[0].username,
                                    firstname: newUserInfo.users[0].firstName,
                                    lastname: newUserInfo.users[0].lastName
                                  };
                                  _context.next = 31;
                                  return (0, _user.generateUserWalletAndAddress)(myNewUserInfo, t);

                                case 31:
                                  _yield$generateUserWa = _context.sent;
                                  _yield$generateUserWa2 = (0, _slicedToArray2["default"])(_yield$generateUserWa, 2);
                                  newUser = _yield$generateUserWa2[0];
                                  newAccount = _yield$generateUserWa2[1];
                                  _context.next = 37;
                                  return _models["default"].user.findOne({
                                    where: {
                                      user_id: "telegram-".concat(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.id)
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

                                case 37:
                                  newUserExist = _context.sent;

                                case 38:
                                  _context.next = 61;
                                  break;

                                case 40:
                                  if (!(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'mention')) {
                                    _context.next = 61;
                                    break;
                                  }

                                  _context.prev = 41;
                                  _context.next = 44;
                                  return telegramApiClient.invoke(new _telegram.Api.contacts.ResolveUsername({
                                    username: "".concat(filteredMessage[parseInt(AmountPosition, 10)].substring(1))
                                  }));

                                case 44:
                                  _newUserInfo = _context.sent;
                                  _context.next = 50;
                                  break;

                                case 47:
                                  _context.prev = 47;
                                  _context.t1 = _context["catch"](41);
                                  console.log(_context.t1);

                                case 50:
                                  if (!(_newUserInfo && _newUserInfo.users.length > 0 && !_newUserInfo.users[0].bot)) {
                                    _context.next = 61;
                                    break;
                                  }

                                  _myNewUserInfo = {
                                    userId: Number(_newUserInfo.users[0].id.value),
                                    username: _newUserInfo.users[0].username,
                                    firstname: _newUserInfo.users[0].firstName,
                                    lastname: _newUserInfo.users[0].lastName
                                  };
                                  _context.next = 54;
                                  return (0, _user.generateUserWalletAndAddress)(_myNewUserInfo, t);

                                case 54:
                                  _yield$generateUserWa3 = _context.sent;
                                  _yield$generateUserWa4 = (0, _slicedToArray2["default"])(_yield$generateUserWa3, 2);
                                  _newUser = _yield$generateUserWa4[0];
                                  _newAccount = _yield$generateUserWa4[1];
                                  _context.next = 60;
                                  return _models["default"].user.findOne({
                                    where: {
                                      username: "".concat(filteredMessage[parseInt(AmountPosition, 10)].substring(1)),
                                      user_id: (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'telegram-')
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

                                case 60:
                                  newUserExist = _context.sent;

                                case 61:
                                  if (newUserExist) {
                                    _userIdTest = newUserExist.user_id.replace('telegram-', '');

                                    if (Number(_userIdTest) !== ctx.update.message.from.id) {
                                      if (!usersToTip.find(function (o) {
                                        return o.id === newUserExist.id;
                                      })) {
                                        usersToTip.push(newUserExist);
                                      }
                                    }
                                  }

                                case 62:
                                  AmountPosition += 1;

                                  if (AmountPosition > ctx.update.message.entities.length) {
                                    AmountPositionEnded = true;
                                  }

                                case 64:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _loop, null, [[18, 24], [41, 47]]);
                        });

                      case 10:
                        if (AmountPositionEnded) {
                          _context2.next = 14;
                          break;
                        }

                        return _context2.delegateYield(_loop(), "t0", 12);

                      case 12:
                        _context2.next = 10;
                        break;

                      case 14:
                        if (!(usersToTip.length < 1)) {
                          _context2.next = 18;
                          break;
                        }

                        _context2.next = 17;
                        return ctx.replyWithHTML((0, _telegram2.notEnoughUsers)('Tip'));

                      case 17:
                        return _context2.abrupt("return");

                      case 18:
                        if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
                          type = 'each';
                        }

                        _context2.next = 21;
                        return (0, _validateAmount.validateAmount)(ctx, t, filteredMessage[parseInt(AmountPosition, 10)], user, setting, 'tip', type, usersToTip);

                      case 21:
                        _yield$validateAmount = _context2.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 3);
                        validAmount = _yield$validateAmount2[0];
                        activityValiateAmount = _yield$validateAmount2[1];
                        amount = _yield$validateAmount2[2];

                        if (validAmount) {
                          _context2.next = 29;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context2.abrupt("return");

                      case 29:
                        _context2.next = 31;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 31:
                        updatedBalance = _context2.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = (amount - Number(fee)) / usersToTip.length;
                        _context2.next = 36;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 36:
                        faucetWatered = _context2.sent;
                        _context2.next = 39;
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

                      case 39:
                        tipRecord = _context2.sent;
                        _context2.next = 42;
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

                      case 42:
                        preActivity = _context2.sent;
                        _context2.next = 45;
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

                      case 45:
                        finalActivity = _context2.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        _iterator = _createForOfIteratorHelper(usersToTip);
                        _context2.prev = 49;

                        _iterator.s();

                      case 51:
                        if ((_step = _iterator.n()).done) {
                          _context2.next = 76;
                          break;
                        }

                        tipee = _step.value;
                        _context2.next = 55;
                        return tipee.wallet.update({
                          available: tipee.wallet.available + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 55:
                        tipeeWallet = _context2.sent;
                        _context2.next = 58;
                        return _models["default"].tiptip.create({
                          amount: Number(userTipAmount),
                          userId: tipee.id,
                          tipId: tipRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 58:
                        tiptipRecord = _context2.sent;
                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context2.next = 62;
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

                      case 62:
                        tipActivity = _context2.sent;
                        _context2.next = 65;
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

                      case 65:
                        tipActivity = _context2.sent;
                        activity.unshift(tipActivity);
                        _context2.next = 69;
                        return (0, _userToMention.getUserToMentionFromDatabaseRecord)(tipee);

                      case 69:
                        _yield$getUserToMenti = _context2.sent;
                        _yield$getUserToMenti2 = (0, _slicedToArray2["default"])(_yield$getUserToMenti, 2);
                        userToMention = _yield$getUserToMenti2[0];
                        userId = _yield$getUserToMenti2[1];

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(userToMention));
                        } else {
                          listOfUsersRained.push("<a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>"));
                        }

                      case 74:
                        _context2.next = 51;
                        break;

                      case 76:
                        _context2.next = 81;
                        break;

                      case 78:
                        _context2.prev = 78;
                        _context2.t1 = _context2["catch"](49);

                        _iterator.e(_context2.t1);

                      case 81:
                        _context2.prev = 81;

                        _iterator.f();

                        return _context2.finish(81);

                      case 84:
                        if (!(listOfUsersRained.length === 1)) {
                          _context2.next = 93;
                          break;
                        }

                        _context2.t2 = ctx;
                        _context2.next = 88;
                        return (0, _telegram2.tipSingleSuccessMessage)(ctx, tipRecord.id, listOfUsersRained, userTipAmount);

                      case 88:
                        _context2.t3 = _context2.sent;
                        _context2.next = 91;
                        return _context2.t2.replyWithHTML.call(_context2.t2, _context2.t3);

                      case 91:
                        _context2.next = 115;
                        break;

                      case 93:
                        if (!(listOfUsersRained.length > 1)) {
                          _context2.next = 115;
                          break;
                        }

                        cutStringListUsers = [];
                        i = 0;
                        listOfUsersRained.forEach(function (word) {
                          if (!cutStringListUsers[parseInt(i, 10)]) {
                            cutStringListUsers[parseInt(i, 10)] = word;
                          } else if (cutStringListUsers[parseInt(i, 10)].length + word.length + 1 <= 3500) {
                            cutStringListUsers[parseInt(i, 10)] += ",".concat(word);
                          } else {
                            i += 1;
                            cutStringListUsers[parseInt(i, 10)] = word;
                          }
                        }); // eslint-disable-next-line no-restricted-syntax

                        _i = 0, _cutStringListUsers = cutStringListUsers;

                      case 98:
                        if (!(_i < _cutStringListUsers.length)) {
                          _context2.next = 109;
                          break;
                        }

                        element = _cutStringListUsers[_i];
                        _context2.t4 = ctx;
                        _context2.next = 103;
                        return (0, _telegram2.userListMessage)(element);

                      case 103:
                        _context2.t5 = _context2.sent;
                        _context2.next = 106;
                        return _context2.t4.replyWithHTML.call(_context2.t4, _context2.t5);

                      case 106:
                        _i++;
                        _context2.next = 98;
                        break;

                      case 109:
                        _context2.t6 = ctx;
                        _context2.next = 112;
                        return (0, _telegram2.tipMultipleSuccessMessage)(ctx, tipRecord.id, listOfUsersRained, userTipAmount, type);

                      case 112:
                        _context2.t7 = _context2.sent;
                        _context2.next = 115;
                        return _context2.t6.replyWithHTML.call(_context2.t6, _context2.t7);

                      case 115:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 116:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee, null, [[49, 78, 81, 84]]);
              }));

              return function (_x10) {
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
                          type: 'Tip',
                          error: "".concat(err)
                        });

                      case 3:
                        _context3.next = 8;
                        break;

                      case 5:
                        _context3.prev = 5;
                        _context3.t0 = _context3["catch"](0);

                        _logger["default"].error("Error Telegram: ".concat(_context3.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("tip error: ".concat(err));

                        _context3.prev = 10;
                        _context3.t1 = ctx;
                        _context3.next = 14;
                        return (0, _telegram2.errorMessage)('Tip');

                      case 14:
                        _context3.t2 = _context3.sent;
                        _context3.next = 17;
                        return _context3.t1.replyWithHTML.call(_context3.t1, _context3.t2);

                      case 17:
                        _context3.next = 22;
                        break;

                      case 19:
                        _context3.prev = 19;
                        _context3.t3 = _context3["catch"](10);
                        console.log(_context3.t3);

                      case 22:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 19]]);
              }));

              return function (_x11) {
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

  return function tipToTelegramUser(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipToTelegramUser = tipToTelegramUser;