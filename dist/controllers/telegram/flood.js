"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramFlood = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/client/telegram/validateAmount");

var _mapMembers = require("../../helpers/client/telegram/mapMembers");

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _waterFaucet = require("../../helpers/waterFaucet");

var _userToMention = require("../../helpers/client/telegram/userToMention");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// const { Api } = require('telegram');
(0, _dotenv.config)();

var telegramFlood = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(telegramClient, telegramApiClient, ctx, filteredMessage, io, groupTask, setting, faucetSetting, queue) {
    var activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, chatId, members, onlineMembers, withoutBots, factivity, updatedBalance, fee, amountPerUser, faucetWatered, floodRecord, cactivity, activityCreate, listOfUsersRained, _iterator, _step, floodee, floodeeWallet, floodtipRecord, _yield$getUserToMenti, _yield$getUserToMenti2, userToMention, userId, tipActivity, cutStringListUsers, i, _i, _cutStringListUsers, element;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, filteredMessage[1].toLowerCase());

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        _context.next = 11;
                        return (0, _validateAmount.validateAmount)(ctx, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

                      case 11:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 3);
                        validAmount = _yield$validateAmount2[0];
                        activityValiateAmount = _yield$validateAmount2[1];
                        amount = _yield$validateAmount2[2];

                        if (validAmount) {
                          _context.next = 19;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 19:
                        // const membersCount = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChatMembersCount?chat_id=${ctx.message.chat.id}`);
                        // let i = 0;
                        // let members = [];
                        // while (i < membersCount.data.result) {
                        //  const membersTemp = await telegramApiClient.getParticipants(chatId, {
                        //    limit: 2,
                        //    offset: i,
                        //  });
                        //  members = members.concat(membersTemp);
                        //  i += 2;
                        // }
                        chatId = Math.abs(ctx.message.chat.id).toString();
                        _context.next = 22;
                        return telegramApiClient.getParticipants(chatId, {
                          limit: 200000
                        });

                      case 22:
                        members = _context.sent;
                        onlineMembers = members.filter(function (member) {
                          console.log(member);
                          console.log('-');
                          return !member.bot;
                        }); // console.log(onlineMembers);

                        _context.next = 26;
                        return (0, _mapMembers.mapMembers)(ctx, t, onlineMembers, setting);

                      case 26:
                        withoutBots = _context.sent;

                        if (!(withoutBots.length < 2)) {
                          _context.next = 35;
                          break;
                        }

                        _context.next = 30;
                        return _models["default"].activity.create({
                          type: 'flood_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        factivity = _context.sent;
                        activity.unshift(factivity);
                        _context.next = 34;
                        return ctx.replyWithHTML((0, _telegram.notEnoughUsers)('Flood'));

                      case 34:
                        return _context.abrupt("return");

                      case 35:
                        _context.next = 37;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 37:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 42;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 42:
                        faucetWatered = _context.sent;
                        _context.next = 45;
                        return _models["default"].flood.create({
                          feeAmount: fee,
                          amount: amount,
                          userCount: withoutBots.length,
                          userId: user.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 45:
                        floodRecord = _context.sent;
                        _context.next = 48;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'flood_s',
                          spenderId: user.id,
                          floodId: floodRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 48:
                        cactivity = _context.sent;
                        _context.next = 51;
                        return _models["default"].activity.findOne({
                          where: {
                            id: cactivity.id
                          },
                          include: [{
                            model: _models["default"].flood,
                            as: 'flood'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 51:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 55;

                        _iterator.s();

                      case 57:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 82;
                          break;
                        }

                        floodee = _step.value;
                        _context.next = 61;
                        return floodee.wallet.update({
                          available: floodee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 61:
                        floodeeWallet = _context.sent;
                        _context.next = 64;
                        return _models["default"].floodtip.create({
                          amount: amountPerUser,
                          userId: floodee.id,
                          floodId: floodRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 64:
                        floodtipRecord = _context.sent;
                        _context.next = 67;
                        return (0, _userToMention.getUserToMentionFromDatabaseRecord)(floodee);

                      case 67:
                        _yield$getUserToMenti = _context.sent;
                        _yield$getUserToMenti2 = (0, _slicedToArray2["default"])(_yield$getUserToMenti, 2);
                        userToMention = _yield$getUserToMenti2[0];
                        userId = _yield$getUserToMenti2[1];

                        if (floodee.ignoreMe) {
                          listOfUsersRained.push("".concat(userToMention));
                        } else {
                          listOfUsersRained.push("<a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 75;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'floodtip_s',
                          spenderId: user.id,
                          earnerId: floodee.id,
                          floodId: floodRecord.id,
                          floodtipId: floodtipRecord.id,
                          earner_balance: floodeeWallet.available + floodeeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 75:
                        tipActivity = _context.sent;
                        _context.next = 78;
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
                            model: _models["default"].flood,
                            as: 'flood'
                          }, {
                            model: _models["default"].floodtip,
                            as: 'floodtip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 78:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 80:
                        _context.next = 57;
                        break;

                      case 82:
                        _context.next = 87;
                        break;

                      case 84:
                        _context.prev = 84;
                        _context.t0 = _context["catch"](55);

                        _iterator.e(_context.t0);

                      case 87:
                        _context.prev = 87;

                        _iterator.f();

                        return _context.finish(87);

                      case 90:
                        // Soltion 1: doesn't work for telegram
                        // const newStringListUsers = listOfUsersRained.join(", ");
                        // const cutStringListUsers = newStringListUsers.match(/.{1,3500}(\s|$)/g);
                        // Solution 2: using reducer, shows linting error
                        // const reducer = (ac, val) => {
                        //   if (ac.length > 0 && ac[ac.length - 1].length + val.length <= 30) {
                        //     ac[ac.length - 1] += `, ${val}`;
                        //   } else {
                        //     ac.push(val);
                        //   }
                        //   return ac;
                        // };
                        // const cutStringListUsers = listOfUsersRained.reduce(reducer, []);
                        // Solution 3
                        cutStringListUsers = [];
                        i = 0;
                        listOfUsersRained.forEach(function (word) {
                          if (!cutStringListUsers[parseInt(i, 10)]) {
                            cutStringListUsers[parseInt(i, 10)] = word;
                          } else if (cutStringListUsers[parseInt(i, 10)].length + word.length + 1 <= 3500) {
                            cutStringListUsers[parseInt(i, 10)] += ", ".concat(word);
                          } else {
                            i += 1;
                            cutStringListUsers[parseInt(i, 10)] = word;
                          }
                        }); // eslint-disable-next-line no-restricted-syntax

                        _i = 0, _cutStringListUsers = cutStringListUsers;

                      case 94:
                        if (!(_i < _cutStringListUsers.length)) {
                          _context.next = 105;
                          break;
                        }

                        element = _cutStringListUsers[_i];
                        _context.t1 = ctx;
                        _context.next = 99;
                        return (0, _telegram.userListMessage)(element);

                      case 99:
                        _context.t2 = _context.sent;
                        _context.next = 102;
                        return _context.t1.replyWithHTML.call(_context.t1, _context.t2);

                      case 102:
                        _i++;
                        _context.next = 94;
                        break;

                      case 105:
                        _context.t3 = ctx;
                        _context.next = 108;
                        return (0, _telegram.afterSuccessMessage)(ctx, floodRecord.id, amount, withoutBots.length, amountPerUser, 'Flood', 'flooded');

                      case 108:
                        _context.t4 = _context.sent;
                        _context.next = 111;
                        return _context.t3.replyWithHTML.call(_context.t3, _context.t4);

                      case 111:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 112:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[55, 84, 87, 90]]);
              }));

              return function (_x10) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _models["default"].error.create({
                          type: 'flood',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Telegram: ".concat(_context2.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("flood error: ".concat(err));

                        _context2.prev = 10;
                        _context2.t1 = ctx;
                        _context2.next = 14;
                        return (0, _telegram.errorMessage)('Flood');

                      case 14:
                        _context2.t2 = _context2.sent;
                        _context2.next = 17;
                        return _context2.t1.replyWithHTML.call(_context2.t1, _context2.t2);

                      case 17:
                        _context2.next = 22;
                        break;

                      case 19:
                        _context2.prev = 19;
                        _context2.t3 = _context2["catch"](10);
                        console.log(_context2.t3);

                      case 22:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 19]]);
              }));

              return function (_x11) {
                return _ref3.apply(this, arguments);
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
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function telegramFlood(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramFlood = telegramFlood;