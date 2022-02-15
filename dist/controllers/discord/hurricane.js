"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordHurricane = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _validateAmount = require("../../helpers/discord/validateAmount");

var _mapMembers = require("../../helpers/discord/mapMembers");

var _userWalletExist = require("../../helpers/discord/userWalletExist");

var _waterFaucet = require("../../helpers/discord/waterFaucet");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordHurricane = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var members, onlineMembers, activity, userActivity, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!groupTask || !channelTask)) {
              _context2.next = 4;
              break;
            }

            _context2.next = 3;
            return message.channel.send({
              embeds: [(0, _discord.NotInDirectMessage)(message, 'Hurricane')]
            });

          case 3:
            return _context2.abrupt("return");

          case 4:
            if (!(Number(filteredMessage[2]) > 50)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 7;
            return message.channel.send({
              embeds: [(0, _discord.hurricaneMaxUserAmountMessage)(message)]
            });

          case 7:
            return _context2.abrupt("return");

          case 8:
            if (!(Number(filteredMessage[2]) % 1 !== 0)) {
              _context2.next = 12;
              break;
            }

            _context2.next = 11;
            return message.channel.send({
              embeds: [(0, _discord.hurricaneInvalidUserAmount)(message)]
            });

          case 11:
            return _context2.abrupt("return");

          case 12:
            if (!(Number(filteredMessage[2]) <= 0)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 15;
            return message.channel.send({
              embeds: [(0, _discord.hurricaneUserZeroAmountMessage)(message)]
            });

          case 15:
            return _context2.abrupt("return");

          case 16:
            _context2.next = 18;
            return discordClient.guilds.cache.get(message.guildId).members.fetch({
              withPresences: true
            });

          case 18:
            members = _context2.sent;
            onlineMembers = members.filter(function (member) {
              return member.presence && member.presence.status === "online" || member.presence && member.presence.status === "idle" || member.presence && member.presence.status === "dnd";
            });
            activity = [];
            _context2.next = 23;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, preWithoutBots, withoutBots, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, activityA, updatedBalance, fee, amountPerUser, faucetWatered, hurricaneRecord, factivity, activityC, listOfUsersRained, _iterator, _step, hurricaneee, hurricaneeeWallet, hurricanetipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

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
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[4], onlineMembers, setting);

                      case 11:
                        preWithoutBots = _context.sent;
                        withoutBots = _lodash["default"].sampleSize(preWithoutBots, Number(filteredMessage[2]));
                        _context.next = 15;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[3], user, setting, filteredMessage[1].toLowerCase());

                      case 15:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 22;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 22:
                        if (!(withoutBots.length < 1)) {
                          _context.next = 30;
                          break;
                        }

                        _context.next = 25;
                        return _models["default"].activity.create({
                          type: 'hurricane_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 25:
                        activityA = _context.sent;
                        activity.unshift(activityA);
                        _context.next = 29;
                        return message.channel.send('Not enough online users');

                      case 29:
                        return _context.abrupt("return");

                      case 30:
                        _context.next = 32;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 32:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 37;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 37:
                        faucetWatered = _context.sent;
                        _context.next = 40;
                        return _models["default"].hurricane.create({
                          amount: amount,
                          feeAmount: fee,
                          userCount: withoutBots.length,
                          userId: user.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 40:
                        hurricaneRecord = _context.sent;
                        _context.next = 43;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'hurricane_s',
                          spenderId: user.id,
                          hurricaneId: hurricaneRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 43:
                        factivity = _context.sent;
                        _context.next = 46;
                        return _models["default"].activity.findOne({
                          where: {
                            id: factivity.id
                          },
                          include: [{
                            model: _models["default"].hurricane,
                            as: 'hurricane'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 46:
                        activityC = _context.sent;
                        activity.unshift(activityC);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 50;

                        _iterator.s();

                      case 52:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 71;
                          break;
                        }

                        hurricaneee = _step.value;
                        _context.next = 56;
                        return hurricaneee.wallet.update({
                          available: hurricaneee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 56:
                        hurricaneeeWallet = _context.sent;
                        _context.next = 59;
                        return _models["default"].hurricanetip.create({
                          amount: amountPerUser,
                          userId: hurricaneee.id,
                          hurricaneId: hurricaneRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 59:
                        hurricanetipRecord = _context.sent;

                        if (hurricaneee.ignoreMe) {
                          listOfUsersRained.push("".concat(hurricaneee.username));
                        } else {
                          userIdReceivedRain = hurricaneee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 64;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'hurricanetip_s',
                          spenderId: user.id,
                          earnerId: hurricaneee.id,
                          hurricaneId: hurricaneRecord.id,
                          hurricanetipId: hurricanetipRecord.id,
                          earner_balance: hurricaneeeWallet.available + hurricaneeeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 64:
                        tipActivity = _context.sent;
                        _context.next = 67;
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
                            model: _models["default"].hurricane,
                            as: 'hurricane'
                          }, {
                            model: _models["default"].hurricanetip,
                            as: 'hurricanetip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 67:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 69:
                        _context.next = 52;
                        break;

                      case 71:
                        _context.next = 76;
                        break;

                      case 73:
                        _context.prev = 73;
                        _context.t0 = _context["catch"](50);

                        _iterator.e(_context.t0);

                      case 76:
                        _context.prev = 76;

                        _iterator.f();

                        return _context.finish(76);

                      case 79:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 82;

                        _iterator2.s();

                      case 84:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 90;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 88;
                        return message.channel.send(element);

                      case 88:
                        _context.next = 84;
                        break;

                      case 90:
                        _context.next = 95;
                        break;

                      case 92:
                        _context.prev = 92;
                        _context.t1 = _context["catch"](82);

                        _iterator2.e(_context.t1);

                      case 95:
                        _context.prev = 95;

                        _iterator2.f();

                        return _context.finish(95);

                      case 98:
                        _context.next = 100;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterSuccessMessage)(message, amount, withoutBots, amountPerUser, '⛈ Hurricane ⛈', 'hurricaned')]
                        });

                      case 100:
                        // logger.info(`Success Hurricane Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 101:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[50, 73, 76, 79], [82, 92, 95, 98]]);
              }));

              return function (_x10) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);

              _logger["default"].error("hurricane error: ".concat(err));

              message.channel.send({
                embeds: [(0, _discord.discordErrorMessage)("Hurricane")]
              });
            });

          case 23:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function discordHurricane(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordHurricane = discordHurricane;