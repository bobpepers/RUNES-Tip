"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipRunesToDiscordUser = exports.tipCoinsToDiscordFaucet = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _validateAmount = require("../../helpers/discord/validateAmount");

var _waterFaucet = require("../../helpers/waterFaucet");

var _userWalletExist = require("../../helpers/discord/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tipRunesToDiscordUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, _loop, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, userTipAmount, faucetWatered, tipRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, tipee, tipeeWallet, tiptipRecord, tipActivity, userIdReceivedRain, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                return _regenerator["default"].wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(!groupTask || !channelTask)) {
                          _context2.next = 4;
                          break;
                        }

                        _context2.next = 3;
                        return message.channel.send({
                          embeds: [(0, _discord.NotInDirectMessage)(message, 'Tip')]
                        });

                      case 3:
                        return _context2.abrupt("return");

                      case 4:
                        _context2.next = 6;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

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
                        console.log(usersToTip);
                        console.log(AmountPosition);
                        console.log(type); // make users to tip array

                        _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                          var discordId, userExist, userIdTest;
                          return _regenerator["default"].wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  discordId = void 0;

                                  if (filteredMessage[AmountPosition].startsWith('<@!')) {
                                    discordId = filteredMessage[AmountPosition].slice(3).slice(0, -1);
                                  } else if (filteredMessage[AmountPosition].startsWith('<@') && !filteredMessage[AmountPosition].startsWith('<@!')) {
                                    discordId = filteredMessage[AmountPosition].slice(2).slice(0, -1);
                                  }

                                  console.log(discordId); // eslint-disable-next-line no-await-in-loop

                                  _context.next = 5;
                                  return _models["default"].user.findOne({
                                    where: {
                                      user_id: "discord-".concat(discordId)
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
                                    userIdTest = userExist.user_id.replace('discord-', '');

                                    if (userIdTest !== message.author.id) {
                                      if (!usersToTip.find(function (o) {
                                        return o.id === userExist.id;
                                      })) {
                                        usersToTip.push(userExist);
                                      }
                                    }
                                  } // usersToTip.push(filteredMessage[AmountPosition]);


                                  // usersToTip.push(filteredMessage[AmountPosition]);
                                  AmountPosition += 1;

                                  if (!filteredMessage[AmountPosition].startsWith('<@')) {
                                    AmountPositionEnded = true;
                                  }

                                case 9:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _loop);
                        });

                      case 17:
                        if (AmountPositionEnded) {
                          _context2.next = 21;
                          break;
                        }

                        return _context2.delegateYield(_loop(), "t0", 19);

                      case 19:
                        _context2.next = 17;
                        break;

                      case 21:
                        if (!(usersToTip.length < 1)) {
                          _context2.next = 25;
                          break;
                        }

                        _context2.next = 24;
                        return message.channel.send({
                          embeds: [(0, _discord.notEnoughUsersToTip)(message)]
                        });

                      case 24:
                        return _context2.abrupt("return");

                      case 25:
                        if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
                          type = 'each';
                        } // verify amount


                        _context2.next = 28;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[AmountPosition], user, setting, 'tip', type, usersToTip);

                      case 28:
                        _yield$validateAmount = _context2.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context2.next = 35;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context2.abrupt("return");

                      case 35:
                        _context2.next = 37;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 37:
                        updatedBalance = _context2.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = (amount - Number(fee)) / usersToTip.length;
                        _context2.next = 42;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 42:
                        faucetWatered = _context2.sent;
                        _context2.next = 45;
                        return _models["default"].tip.create({
                          feeAmount: fee,
                          amount: amount,
                          type: type,
                          userCount: usersToTip.length,
                          userId: user.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 45:
                        tipRecord = _context2.sent;
                        _context2.next = 48;
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

                      case 48:
                        preActivity = _context2.sent;
                        _context2.next = 51;
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

                      case 51:
                        finalActivity = _context2.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToTip);
                        _context2.prev = 55;

                        _iterator.s();

                      case 57:
                        if ((_step = _iterator.n()).done) {
                          _context2.next = 76;
                          break;
                        }

                        tipee = _step.value;
                        _context2.next = 61;
                        return tipee.wallet.update({
                          available: tipee.wallet.available + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 61:
                        tipeeWallet = _context2.sent;
                        _context2.next = 64;
                        return _models["default"].tiptip.create({
                          amount: Number(userTipAmount),
                          userId: tipee.id,
                          tipId: tipRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 64:
                        tiptipRecord = _context2.sent;
                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context2.next = 68;
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

                      case 68:
                        tipActivity = _context2.sent;
                        _context2.next = 71;
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

                      case 71:
                        tipActivity = _context2.sent;
                        activity.unshift(tipActivity);

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(tipee.username));
                        } else {
                          userIdReceivedRain = tipee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                      case 74:
                        _context2.next = 57;
                        break;

                      case 76:
                        _context2.next = 81;
                        break;

                      case 78:
                        _context2.prev = 78;
                        _context2.t1 = _context2["catch"](55);

                        _iterator.e(_context2.t1);

                      case 81:
                        _context2.prev = 81;

                        _iterator.f();

                        return _context2.finish(81);

                      case 84:
                        if (!(listOfUsersRained.length === 1)) {
                          _context2.next = 89;
                          break;
                        }

                        _context2.next = 87;
                        return message.channel.send({
                          embeds: [(0, _discord.tipSingleSuccessMessage)(message, tipRecord.id, listOfUsersRained, userTipAmount)]
                        });

                      case 87:
                        _context2.next = 111;
                        break;

                      case 89:
                        if (!(listOfUsersRained.length > 1)) {
                          _context2.next = 111;
                          break;
                        }

                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context2.prev = 93;

                        _iterator2.s();

                      case 95:
                        if ((_step2 = _iterator2.n()).done) {
                          _context2.next = 101;
                          break;
                        }

                        element = _step2.value;
                        _context2.next = 99;
                        return message.channel.send(element);

                      case 99:
                        _context2.next = 95;
                        break;

                      case 101:
                        _context2.next = 106;
                        break;

                      case 103:
                        _context2.prev = 103;
                        _context2.t2 = _context2["catch"](93);

                        _iterator2.e(_context2.t2);

                      case 106:
                        _context2.prev = 106;

                        _iterator2.f();

                        return _context2.finish(106);

                      case 109:
                        _context2.next = 111;
                        return message.channel.send({
                          embeds: [(0, _discord.tipMultipleSuccessMessage)(message, tipRecord.id, listOfUsersRained, userTipAmount, type)]
                        });

                      case 111:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 112:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee, null, [[55, 78, 81, 84], [93, 103, 106, 109]]);
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

                        _context3.next = 12;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Tip")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 12:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
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

  return function tipRunesToDiscordUser(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToDiscordUser = tipRunesToDiscordUser;

var tipCoinsToDiscordFaucet = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var activity, user, usersToTip, userActivity;
    return _regenerator["default"].wrap(function _callee6$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            activity = [];
            usersToTip = [];
            _context7.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                var _yield$userWalletExis3, _yield$userWalletExis4, userExist, _yield$validateAmount3, _yield$validateAmount4, activityValiateAmount, amount, updatedBalance, userTipAmount, tipRecord, preActivity, finalActivity, faucet, updatedFaucet, listOfUsersRained, _iterator3, _step3, tipee, tiptipRecord, tipActivity, userIdReceivedRain;

                return _regenerator["default"].wrap(function _callee4$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!(!groupTask || !channelTask)) {
                          _context5.next = 4;
                          break;
                        }

                        _context5.next = 3;
                        return message.channel.send({
                          embeds: [(0, _discord.NotInDirectMessage)(message, 'Tip')]
                        });

                      case 3:
                        return _context5.abrupt("return");

                      case 4:
                        _context5.next = 6;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

                      case 6:
                        _yield$userWalletExis3 = _context5.sent;
                        _yield$userWalletExis4 = (0, _slicedToArray2["default"])(_yield$userWalletExis3, 2);
                        user = _yield$userWalletExis4[0];
                        userActivity = _yield$userWalletExis4[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context5.next = 13;
                          break;
                        }

                        return _context5.abrupt("return");

                      case 13:
                        _context5.next = 15;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(discordClient.user.id)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        userExist = _context5.sent;

                        if (userExist) {
                          usersToTip.push(userExist);
                        }

                        if (!(usersToTip.length < 1)) {
                          _context5.next = 21;
                          break;
                        }

                        _context5.next = 20;
                        return message.channel.send({
                          embeds: [(0, _discord.notEnoughUsersToTip)(message)]
                        });

                      case 20:
                        return _context5.abrupt("return");

                      case 21:
                        _context5.next = 23;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, 'tip', 'each', usersToTip);

                      case 23:
                        _yield$validateAmount3 = _context5.sent;
                        _yield$validateAmount4 = (0, _slicedToArray2["default"])(_yield$validateAmount3, 2);
                        activityValiateAmount = _yield$validateAmount4[0];
                        amount = _yield$validateAmount4[1];

                        if (!activityValiateAmount) {
                          _context5.next = 30;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context5.abrupt("return");

                      case 30:
                        _context5.next = 32;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 32:
                        updatedBalance = _context5.sent;
                        userTipAmount = Number(amount);
                        _context5.next = 36;
                        return _models["default"].tip.create({
                          feeAmount: 0,
                          amount: amount,
                          type: 'each',
                          userCount: usersToTip.length,
                          userId: user.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 36:
                        tipRecord = _context5.sent;
                        _context5.next = 39;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'tip_faucet_s',
                          spenderId: user.id,
                          tipId: tipRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 39:
                        preActivity = _context5.sent;
                        _context5.next = 42;
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

                      case 42:
                        finalActivity = _context5.sent;
                        activity.unshift(finalActivity);
                        _context5.next = 46;
                        return _models["default"].faucet.findOne({
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 46:
                        faucet = _context5.sent;
                        _context5.next = 49;
                        return faucet.update({
                          amount: faucet.amount + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        updatedFaucet = _context5.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator3 = _createForOfIteratorHelper(usersToTip);
                        _context5.prev = 52;

                        _iterator3.s();

                      case 54:
                        if ((_step3 = _iterator3.n()).done) {
                          _context5.next = 70;
                          break;
                        }

                        tipee = _step3.value;
                        _context5.next = 58;
                        return _models["default"].tiptip.create({
                          amount: Number(userTipAmount),
                          userId: tipee.id,
                          tipId: tipRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 58:
                        tiptipRecord = _context5.sent;
                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context5.next = 62;
                        return _models["default"].activity.create({
                          amount: Number(userTipAmount),
                          type: 'tiptip_faucet_s',
                          spenderId: user.id,
                          earnerId: tipee.id,
                          tipId: tipRecord.id,
                          tiptipId: tiptipRecord.id,
                          earner_balance: updatedFaucet.amount,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 62:
                        tipActivity = _context5.sent;
                        _context5.next = 65;
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
                        tipActivity = _context5.sent;
                        activity.unshift(tipActivity);

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(tipee.username));
                        } else {
                          userIdReceivedRain = tipee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                      case 68:
                        _context5.next = 54;
                        break;

                      case 70:
                        _context5.next = 75;
                        break;

                      case 72:
                        _context5.prev = 72;
                        _context5.t0 = _context5["catch"](52);

                        _iterator3.e(_context5.t0);

                      case 75:
                        _context5.prev = 75;

                        _iterator3.f();

                        return _context5.finish(75);

                      case 78:
                        _context5.next = 80;
                        return message.channel.send({
                          embeds: [(0, _discord.tipFaucetSuccessMessage)(message, userTipAmount)]
                        });

                      case 80:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 81:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee4, null, [[52, 72, 75, 78]]);
              }));

              return function (_x21) {
                return _ref5.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err) {
                return _regenerator["default"].wrap(function _callee5$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return _models["default"].error.create({
                          type: 'tipFaucet',
                          error: "".concat(err)
                        });

                      case 3:
                        _context6.next = 8;
                        break;

                      case 5:
                        _context6.prev = 5;
                        _context6.t0 = _context6["catch"](0);

                        _logger["default"].error("tipFaucet Discord: ".concat(_context6.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("tipFaucet error: ".concat(err));

                        _context6.next = 12;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Tip")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 12:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee5, null, [[0, 5]]);
              }));

              return function (_x22) {
                return _ref6.apply(this, arguments);
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
            return _context7.stop();
        }
      }
    }, _callee6);
  }));

  return function tipCoinsToDiscordFaucet(_x12, _x13, _x14, _x15, _x16, _x17, _x18, _x19, _x20) {
    return _ref4.apply(this, arguments);
  };
}();

exports.tipCoinsToDiscordFaucet = tipCoinsToDiscordFaucet;