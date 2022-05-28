"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramSleet = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/client/telegram/validateAmount");

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _waterFaucet = require("../../helpers/waterFaucet");

var _userToMention = require("../../helpers/client/telegram/userToMention");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var telegramSleet = /*#__PURE__*/function () {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, group, groupFailActivity, textTime, cutLastTimeLetter, cutNumberTime, isnum, lastSeenOptions, activityA, dateObj, usersToRain, failActivity, updatedBalance, fee, amountPerUser, faucetWatered, sleetRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, sleetee, sleeteeWallet, sleettipRecord, _yield$getUserToMenti, _yield$getUserToMenti2, userToMention, userId, tipActivity, cutStringListUsers, i, _i, _cutStringListUsers, element;

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
                        _context.next = 21;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "telegram-".concat(ctx.update.message.chat.id)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 21:
                        group = _context.sent;

                        if (group) {
                          _context.next = 30;
                          break;
                        }

                        _context.next = 25;
                        return _models["default"].activity.create({
                          type: 'sleet_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 25:
                        groupFailActivity = _context.sent;
                        activity.unshift(groupFailActivity);
                        _context.next = 29;
                        return ctx.reply((0, _telegram.groupNotFoundMessage)());

                      case 29:
                        return _context.abrupt("return");

                      case 30:
                        lastSeenOptions = (0, _defineProperty2["default"])({}, _sequelize.Op.gte, new Date(Date.now() - 15 * 60 * 1000)); // Optional Timer

                        if (filteredMessage[3]) {
                          // eslint-disable-next-line prefer-destructuring
                          textTime = filteredMessage[3];
                          cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                          cutNumberTime = textTime.substring(0, textTime.length - 1);
                          isnum = /^\d+$/.test(cutNumberTime);
                        }

                        if (!(filteredMessage[3] && !isnum // && Number(cutNumberTime) < 0
                        && (cutLastTimeLetter !== 'd' || cutLastTimeLetter !== 'h' || cutLastTimeLetter !== 'm' || cutLastTimeLetter !== 's'))) {
                          _context.next = 44;
                          break;
                        }

                        _context.next = 35;
                        return _models["default"].activity.create({
                          type: 'sleet_i',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 35:
                        activityA = _context.sent;
                        activity.unshift(activityA);
                        _context.t0 = ctx;
                        _context.next = 40;
                        return (0, _telegram.invalidTimeMessage)(ctx, 'Sleet');

                      case 40:
                        _context.t1 = _context.sent;
                        _context.next = 43;
                        return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

                      case 43:
                        return _context.abrupt("return");

                      case 44:
                        if (!(filteredMessage[2] && isnum // && Number(cutNumberTime) < 0
                        && (cutLastTimeLetter === 'd' || cutLastTimeLetter === 'h' || cutLastTimeLetter === 'm' || cutLastTimeLetter === 's'))) {
                          _context.next = 56;
                          break;
                        }

                        _context.next = 47;
                        return new Date().getTime();

                      case 47:
                        dateObj = _context.sent;

                        if (cutLastTimeLetter === 'd') {
                          dateObj -= Number(cutNumberTime) * 24 * 60 * 60 * 1000;
                        }

                        if (cutLastTimeLetter === 'h') {
                          dateObj -= Number(cutNumberTime) * 60 * 60 * 1000;
                        }

                        if (cutLastTimeLetter === 'm') {
                          dateObj -= Number(cutNumberTime) * 60 * 1000;
                        }

                        if (cutLastTimeLetter === 's') {
                          dateObj -= Number(cutNumberTime) * 1000;
                        }

                        _context.next = 54;
                        return new Date(dateObj);

                      case 54:
                        dateObj = _context.sent;
                        lastSeenOptions = (0, _defineProperty2["default"])({}, _sequelize.Op.gte, dateObj);

                      case 56:
                        _context.next = 58;
                        return _models["default"].user.findAll({
                          limit: 400,
                          where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                            id: (0, _defineProperty2["default"])({}, _sequelize.Op.not, user.id)
                          }, {
                            banned: false
                          }]),
                          include: [{
                            model: _models["default"].active,
                            as: 'active',
                            where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                              lastSeen: lastSeenOptions
                            }, {
                              groupId: group.id
                            }])
                          }, {
                            model: _models["default"].wallet,
                            as: 'wallet'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 58:
                        usersToRain = _context.sent;

                        if (!(usersToRain.length < 2)) {
                          _context.next = 67;
                          break;
                        }

                        _context.next = 62;
                        return _models["default"].activity.create({
                          type: 'sleet_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 62:
                        failActivity = _context.sent;
                        activity.unshift(failActivity);
                        _context.next = 66;
                        return ctx.replyWithHTML((0, _telegram.notEnoughUsers)('Sleet'));

                      case 66:
                        return _context.abrupt("return");

                      case 67:
                        if (!(usersToRain.length >= 2)) {
                          _context.next = 144;
                          break;
                        }

                        _context.next = 70;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 70:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / usersToRain.length).toFixed(0);
                        _context.next = 75;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 75:
                        faucetWatered = _context.sent;
                        _context.next = 78;
                        return _models["default"].sleet.create({
                          feeAmount: fee,
                          amount: amount,
                          userCount: usersToRain.length,
                          userId: user.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 78:
                        sleetRecord = _context.sent;
                        _context.next = 81;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'sleet_s',
                          spenderId: user.id,
                          sleetId: sleetRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 81:
                        preActivity = _context.sent;
                        _context.next = 84;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].sleet,
                            as: 'sleet'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 84:
                        finalActivity = _context.sent;
                        activity.push(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        _iterator = _createForOfIteratorHelper(usersToRain);
                        _context.prev = 88;

                        _iterator.s();

                      case 90:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 115;
                          break;
                        }

                        sleetee = _step.value;
                        _context.next = 94;
                        return sleetee.wallet.update({
                          available: sleetee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 94:
                        sleeteeWallet = _context.sent;
                        _context.next = 97;
                        return _models["default"].sleettip.create({
                          amount: Number(amountPerUser),
                          userId: sleetee.id,
                          sleetId: sleetRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 97:
                        sleettipRecord = _context.sent;
                        _context.next = 100;
                        return (0, _userToMention.getUserToMentionFromDatabaseRecord)(sleetee);

                      case 100:
                        _yield$getUserToMenti = _context.sent;
                        _yield$getUserToMenti2 = (0, _slicedToArray2["default"])(_yield$getUserToMenti, 2);
                        userToMention = _yield$getUserToMenti2[0];
                        userId = _yield$getUserToMenti2[1];

                        if (sleetee.ignoreMe) {
                          listOfUsersRained.push("".concat(userToMention));
                        } else {
                          listOfUsersRained.push("<a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 108;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'sleettip_s',
                          spenderId: user.id,
                          earnerId: sleetee.id,
                          sleetId: sleetRecord.id,
                          sleettipId: sleettipRecord.id,
                          earner_balance: sleeteeWallet.available + sleeteeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 108:
                        tipActivity = _context.sent;
                        _context.next = 111;
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
                            model: _models["default"].sleet,
                            as: 'sleet'
                          }, {
                            model: _models["default"].sleettip,
                            as: 'sleettip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 111:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 113:
                        _context.next = 90;
                        break;

                      case 115:
                        _context.next = 120;
                        break;

                      case 117:
                        _context.prev = 117;
                        _context.t2 = _context["catch"](88);

                        _iterator.e(_context.t2);

                      case 120:
                        _context.prev = 120;

                        _iterator.f();

                        return _context.finish(120);

                      case 123:
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

                      case 127:
                        if (!(_i < _cutStringListUsers.length)) {
                          _context.next = 138;
                          break;
                        }

                        element = _cutStringListUsers[_i];
                        _context.t3 = ctx;
                        _context.next = 132;
                        return (0, _telegram.userListMessage)(element);

                      case 132:
                        _context.t4 = _context.sent;
                        _context.next = 135;
                        return _context.t3.replyWithHTML.call(_context.t3, _context.t4);

                      case 135:
                        _i++;
                        _context.next = 127;
                        break;

                      case 138:
                        _context.t5 = ctx;
                        _context.next = 141;
                        return (0, _telegram.afterSuccessMessage)(ctx, sleetRecord.id, amount, listOfUsersRained.length, amountPerUser, 'Sleet', 'sleeted');

                      case 141:
                        _context.t6 = _context.sent;
                        _context.next = 144;
                        return _context.t5.replyWithHTML.call(_context.t5, _context.t6);

                      case 144:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 145:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[88, 117, 120, 123]]);
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
                          type: 'Sleet',
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

                        _logger["default"].error("sleet error: ".concat(err));

                        _context2.prev = 10;
                        _context2.t1 = ctx;
                        _context2.next = 14;
                        return (0, _telegram.errorMessage)('Sleet');

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

  return function telegramSleet(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramSleet = telegramSleet;