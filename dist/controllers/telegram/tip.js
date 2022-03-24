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

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _validateAmount = require("../../helpers/client/telegram/validateAmount");

var _waterFaucet = require("../../helpers/waterFaucet");

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _userToMention = require("../../helpers/client/telegram/userToMention");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tipToTelegramUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(telegramClient, telegramApiClient, ctx, filteredMessage, io, groupTask, setting, faucetSetting, queue) {
    var activity, user, AmountPosition, AmountPositionEnded, usersToTip, type, userActivity;
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
                var _yield$userWalletExis, _yield$userWalletExis2, _loop, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, userTipAmount, faucetWatered, tipRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, tipee, tipeeWallet, tiptipRecord, tipActivity, _yield$getUserToMenti, _yield$getUserToMenti2, userToMention, userId, cutStringListUsers, i, _i, _cutStringListUsers, element;

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
                          var userExist, userIdTest;
                          return _regenerator["default"].wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  userExist = false;

                                  if (!(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'text_mention' && !ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.is_bot)) {
                                    _context.next = 9;
                                    break;
                                  }

                                  console.log('is a text mention');
                                  console.log(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user);
                                  _context.next = 6;
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
                                        required: false
                                      }]
                                    }],
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 6:
                                  userExist = _context.sent;
                                  _context.next = 15;
                                  break;

                                case 9:
                                  if (!(ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'mention')) {
                                    _context.next = 15;
                                    break;
                                  }

                                  console.log('is a regular mention');
                                  console.log(filteredMessage[parseInt(AmountPosition, 10)]);
                                  _context.next = 14;
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
                                        required: false
                                      }]
                                    }],
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 14:
                                  userExist = _context.sent;

                                case 15:
                                  if (userExist) {
                                    userIdTest = userExist.user_id.replace('telegram-', '');
                                    console.log(ctx.update.message.from.id);
                                    console.log('ctx.update.message.from');
                                    console.log(userIdTest);

                                    if (Number(userIdTest) !== ctx.update.message.from.id) {
                                      if (!usersToTip.find(function (o) {
                                        return o.id === userExist.id;
                                      })) {
                                        usersToTip.push(userExist);
                                      }
                                    }
                                  }

                                  AmountPosition += 1;

                                  if (AmountPosition > ctx.update.message.entities.length) {
                                    AmountPositionEnded = true;
                                  }

                                case 18:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _loop);
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
                        return ctx.replyWithHTML((0, _telegram.notEnoughUsers)('Tip'));

                      case 17:
                        return _context2.abrupt("return");

                      case 18:
                        if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
                          console.log('filteredMessage[AmountPosition + 1]');
                          console.log(filteredMessage[AmountPosition + 1]);
                          type = 'each';
                        }

                        _context2.next = 21;
                        return (0, _validateAmount.validateAmount)(ctx, t, filteredMessage[parseInt(AmountPosition, 10)], user, setting, 'tip', type, usersToTip);

                      case 21:
                        _yield$validateAmount = _context2.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context2.next = 28;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context2.abrupt("return");

                      case 28:
                        _context2.next = 30;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        updatedBalance = _context2.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = (amount - Number(fee)) / usersToTip.length;
                        _context2.next = 35;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 35:
                        faucetWatered = _context2.sent;
                        _context2.next = 38;
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

                      case 38:
                        tipRecord = _context2.sent;
                        _context2.next = 41;
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

                      case 41:
                        preActivity = _context2.sent;
                        _context2.next = 44;
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

                      case 44:
                        finalActivity = _context2.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToTip);
                        _context2.prev = 48;

                        _iterator.s();

                      case 50:
                        if ((_step = _iterator.n()).done) {
                          _context2.next = 75;
                          break;
                        }

                        tipee = _step.value;
                        _context2.next = 54;
                        return tipee.wallet.update({
                          available: tipee.wallet.available + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 54:
                        tipeeWallet = _context2.sent;
                        _context2.next = 57;
                        return _models["default"].tiptip.create({
                          amount: Number(userTipAmount),
                          userId: tipee.id,
                          tipId: tipRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 57:
                        tiptipRecord = _context2.sent;
                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context2.next = 61;
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

                      case 61:
                        tipActivity = _context2.sent;
                        _context2.next = 64;
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

                      case 64:
                        tipActivity = _context2.sent;
                        activity.unshift(tipActivity);
                        _context2.next = 68;
                        return (0, _userToMention.getUserToMentionFromDatabaseRecord)(tipee);

                      case 68:
                        _yield$getUserToMenti = _context2.sent;
                        _yield$getUserToMenti2 = (0, _slicedToArray2["default"])(_yield$getUserToMenti, 2);
                        userToMention = _yield$getUserToMenti2[0];
                        userId = _yield$getUserToMenti2[1];

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(userToMention));
                        } else {
                          listOfUsersRained.push("<a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>"));
                        }

                      case 73:
                        _context2.next = 50;
                        break;

                      case 75:
                        _context2.next = 80;
                        break;

                      case 77:
                        _context2.prev = 77;
                        _context2.t1 = _context2["catch"](48);

                        _iterator.e(_context2.t1);

                      case 80:
                        _context2.prev = 80;

                        _iterator.f();

                        return _context2.finish(80);

                      case 83:
                        if (!(listOfUsersRained.length === 1)) {
                          _context2.next = 92;
                          break;
                        }

                        _context2.t2 = ctx;
                        _context2.next = 87;
                        return (0, _telegram.tipSingleSuccessMessage)(ctx, tipRecord.id, listOfUsersRained, userTipAmount);

                      case 87:
                        _context2.t3 = _context2.sent;
                        _context2.next = 90;
                        return _context2.t2.replyWithHTML.call(_context2.t2, _context2.t3);

                      case 90:
                        _context2.next = 114;
                        break;

                      case 92:
                        if (!(listOfUsersRained.length > 1)) {
                          _context2.next = 114;
                          break;
                        }

                        // const newStringListUsers = listOfUsersRained.join(", ");
                        // const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
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

                      case 97:
                        if (!(_i < _cutStringListUsers.length)) {
                          _context2.next = 108;
                          break;
                        }

                        element = _cutStringListUsers[_i];
                        _context2.t4 = ctx;
                        _context2.next = 102;
                        return (0, _telegram.userListMessage)(element);

                      case 102:
                        _context2.t5 = _context2.sent;
                        _context2.next = 105;
                        return _context2.t4.replyWithHTML.call(_context2.t4, _context2.t5);

                      case 105:
                        _i++;
                        _context2.next = 97;
                        break;

                      case 108:
                        _context2.t6 = ctx;
                        _context2.next = 111;
                        return (0, _telegram.tipMultipleSuccessMessage)(ctx, tipRecord.id, listOfUsersRained, userTipAmount, type);

                      case 111:
                        _context2.t7 = _context2.sent;
                        _context2.next = 114;
                        return _context2.t6.replyWithHTML.call(_context2.t6, _context2.t7);

                      case 114:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 115:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee, null, [[48, 77, 80, 83]]);
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
                        _context3.next = 13;
                        return ctx.replyWithHTML((0, _telegram.errorMessage)('Tip'));

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