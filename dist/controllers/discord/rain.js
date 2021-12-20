"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordRain = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _sequelize = require("sequelize");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/discord/validateAmount");

var _mapMembers = require("../../helpers/discord/mapMembers");

var _userWalletExist = require("../../helpers/discord/userWalletExist");

var _waterFaucet = require("../../helpers/discord/waterFaucet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordRain = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var members, onlineMembers, activity, user;
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
              var _member$presence;

              return ((_member$presence = member.presence) === null || _member$presence === void 0 ? void 0 : _member$presence.status) === "online";
            });
            _context2.next = 10;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, withoutBots, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, amountPerUser, faucetWatered, rainRecord, listOfUsersRained, _iterator, _step, rainee, raineeWallet, raintipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

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
                        activity = _yield$userWalletExis2[1];

                        if (user) {
                          _context.next = 8;
                          break;
                        }

                        return _context.abrupt("return");

                      case 8:
                        _context.next = 10;
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[3], onlineMembers, setting);

                      case 10:
                        withoutBots = _context.sent;
                        _context.next = 13;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

                      case 13:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 20;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context.abrupt("return");

                      case 20:
                        if (!(withoutBots.length < 2)) {
                          _context.next = 28;
                          break;
                        }

                        console.log(withoutBots.length);
                        _context.next = 24;
                        return _models["default"].activity.create({
                          type: 'rain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 24:
                        activity = _context.sent;
                        _context.next = 27;
                        return message.channel.send('Not enough online users');

                      case 27:
                        return _context.abrupt("return");

                      case 28:
                        _context.next = 30;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 35;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 35:
                        faucetWatered = _context.sent;
                        _context.next = 38;
                        return _models["default"].rain.create({
                          feeAmount: Number(fee),
                          amount: amount,
                          userCount: withoutBots.length,
                          userId: user.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 38:
                        rainRecord = _context.sent;
                        _context.next = 41;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'rain_s',
                          spenderId: user.id,
                          rainId: rainRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 41:
                        activity = _context.sent;
                        _context.next = 44;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activity.id
                          },
                          include: [{
                            model: _models["default"].rain,
                            as: 'rain'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 44:
                        activity = _context.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 47;

                        _iterator.s();

                      case 49:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 69;
                          break;
                        }

                        rainee = _step.value;
                        _context.next = 53;
                        return rainee.wallet.update({
                          available: rainee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 53:
                        raineeWallet = _context.sent;
                        _context.next = 56;
                        return _models["default"].raintip.create({
                          amount: amountPerUser,
                          userId: rainee.id,
                          rainId: rainRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 56:
                        raintipRecord = _context.sent;

                        if (rainee.ignoreMe) {
                          listOfUsersRained.push("".concat(rainee.username));
                        } else {
                          userIdReceivedRain = rainee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0;
                        _context.next = 61;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'raintip_s',
                          spenderId: user.id,
                          earnerId: rainee.id,
                          rainId: rainRecord.id,
                          raintipId: raintipRecord.id,
                          earner_balance: raineeWallet.available + raineeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 61:
                        tipActivity = _context.sent;
                        _context.next = 64;
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
                            model: _models["default"].rain,
                            as: 'rain'
                          }, {
                            model: _models["default"].raintip,
                            as: 'raintip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 64:
                        tipActivity = _context.sent;
                        console.log(tipActivity);
                        io.to('admin').emit('updateActivity', {
                          activity: tipActivity
                        });

                      case 67:
                        _context.next = 49;
                        break;

                      case 69:
                        _context.next = 74;
                        break;

                      case 71:
                        _context.prev = 71;
                        _context.t0 = _context["catch"](47);

                        _iterator.e(_context.t0);

                      case 74:
                        _context.prev = 74;

                        _iterator.f();

                        return _context.finish(74);

                      case 77:
                        newStringListUsers = listOfUsersRained.join(", ");
                        console.log(newStringListUsers);
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
                          embeds: [(0, _discord.AfterSuccessMessage)(message, amount, withoutBots, amountPerUser, 'Rain', 'rained')]
                        });

                      case 99:
                        _logger["default"].info("Success Rain Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 101:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[47, 71, 74, 77], [81, 91, 94, 97]]);
              }));

              return function (_x10) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send('something went wrong');
            });

          case 10:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function discordRain(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordRain = discordRain;