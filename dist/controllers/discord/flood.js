"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordFlood = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/discord/validateAmount");

var _mapMembers = require("../../helpers/discord/mapMembers");

var _userWalletExist = require("../../helpers/discord/userWalletExist");

var _waterFaucet = require("../../helpers/discord/waterFaucet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordFlood = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var members, onlineMembers, user, userActivity, activity;
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
              embeds: [(0, _discord.NotInDirectMessage)(message, 'Flood')]
            });

          case 3:
            return _context2.abrupt("return");

          case 4:
            _context2.next = 6;
            return discordClient.guilds.cache.get(message.guildId).members.fetch({
              withPresences: true
            });

          case 6:
            members = _context2.sent;
            onlineMembers = members.filter(function (member) {
              console.log(member.presence);
              return member;
            });
            activity = [];
            _context2.next = 11;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, withoutBots, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, factivity, updatedBalance, fee, amountPerUser, faucetWatered, floodRecord, cactivity, activityCreate, listOfUsersRained, _iterator, _step, floodee, floodeeWallet, floodtipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

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
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[3], onlineMembers, setting);

                      case 11:
                        withoutBots = _context.sent;
                        _context.next = 14;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

                      case 14:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 21;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 21:
                        if (!(withoutBots.length < 2)) {
                          _context.next = 29;
                          break;
                        }

                        _context.next = 24;
                        return _models["default"].activity.create({
                          type: 'flood_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 24:
                        factivity = _context.sent;
                        activity.unshift(factivity);
                        _context.next = 28;
                        return message.channel.send('Not enough online users');

                      case 28:
                        return _context.abrupt("return");

                      case 29:
                        _context.next = 31;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 31:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 36;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 36:
                        faucetWatered = _context.sent;
                        _context.next = 39;
                        return _models["default"].flood.create({
                          feeAmount: fee,
                          amount: amount,
                          userCount: withoutBots.length,
                          userId: user.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 39:
                        floodRecord = _context.sent;
                        _context.next = 42;
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

                      case 42:
                        cactivity = _context.sent;
                        _context.next = 45;
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

                      case 45:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 49;

                        _iterator.s();

                      case 51:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 70;
                          break;
                        }

                        floodee = _step.value;
                        _context.next = 55;
                        return floodee.wallet.update({
                          available: floodee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 55:
                        floodeeWallet = _context.sent;
                        _context.next = 58;
                        return _models["default"].floodtip.create({
                          amount: amountPerUser,
                          userId: floodee.id,
                          floodId: floodRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 58:
                        floodtipRecord = _context.sent;

                        if (floodee.ignoreMe) {
                          listOfUsersRained.push("".concat(floodee.username));
                        } else {
                          userIdReceivedRain = floodee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 63;
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

                      case 63:
                        tipActivity = _context.sent;
                        _context.next = 66;
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

                      case 66:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 68:
                        _context.next = 51;
                        break;

                      case 70:
                        _context.next = 75;
                        break;

                      case 72:
                        _context.prev = 72;
                        _context.t0 = _context["catch"](49);

                        _iterator.e(_context.t0);

                      case 75:
                        _context.prev = 75;

                        _iterator.f();

                        return _context.finish(75);

                      case 78:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 81;

                        _iterator2.s();

                      case 83:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 89;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 87;
                        return message.channel.send(element);

                      case 87:
                        _context.next = 83;
                        break;

                      case 89:
                        _context.next = 94;
                        break;

                      case 91:
                        _context.prev = 91;
                        _context.t1 = _context["catch"](81);

                        _iterator2.e(_context.t1);

                      case 94:
                        _context.prev = 94;

                        _iterator2.f();

                        return _context.finish(94);

                      case 97:
                        _context.next = 99;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterSuccessMessage)(message, amount, withoutBots, amountPerUser, 'Flood', 'flooded')]
                        });

                      case 99:
                        // logger.info(`Success Flood Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 100:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[49, 72, 75, 78], [81, 91, 94, 97]]);
              }));

              return function (_x10) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);

              _logger["default"].error("flood error: ".concat(err));

              message.channel.send({
                embeds: [(0, _discord.discordErrorMessage)("Flood")]
              });
            });

          case 11:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function discordFlood(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordFlood = discordFlood;