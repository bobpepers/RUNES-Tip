"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordThunderStorm = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _validateAmount = require("../../helpers/client/discord/validateAmount");

var _mapMembers = require("../../helpers/client/discord/mapMembers");

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _waterFaucet = require("../../helpers/waterFaucet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordThunderStorm = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, members, onlineMembers, preWithoutBots, withoutBots, failActivity, updatedBalance, fee, amountPerUser, faucetWatered, thunderstormRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, thunderstormee, thunderstormeeWallet, thunderstormtipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(Number(filteredMessage[2]) > 50)) {
                          _context.next = 4;
                          break;
                        }

                        _context.next = 3;
                        return message.channel.send({
                          embeds: [(0, _discord.thunderstormMaxUserAmountMessage)(message)]
                        });

                      case 3:
                        return _context.abrupt("return");

                      case 4:
                        if (!(Number(filteredMessage[2]) % 1 !== 0)) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 7;
                        return message.channel.send({
                          embeds: [(0, _discord.thunderstormInvalidUserAmount)(message)]
                        });

                      case 7:
                        return _context.abrupt("return");

                      case 8:
                        if (!(Number(filteredMessage[2]) <= 0)) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 11;
                        return message.channel.send({
                          embeds: [(0, _discord.thunderstormUserZeroAmountMessage)(message)]
                        });

                      case 11:
                        return _context.abrupt("return");

                      case 12:
                        _context.next = 14;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

                      case 14:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 21;
                          break;
                        }

                        return _context.abrupt("return");

                      case 21:
                        _context.next = 23;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[3], user, setting, 'thunderstorm');

                      case 23:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 3);
                        validAmount = _yield$validateAmount2[0];
                        activityValiateAmount = _yield$validateAmount2[1];
                        amount = _yield$validateAmount2[2];

                        if (validAmount) {
                          _context.next = 31;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 31:
                        _context.next = 33;
                        return discordClient.guilds.cache.get(message.guildId).members.fetch({
                          withPresences: true
                        });

                      case 33:
                        members = _context.sent;
                        onlineMembers = members.filter(function (member) {
                          return member && member.presence && member.presence.status && member.presence.status === "online";
                        });
                        _context.next = 37;
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[4], onlineMembers, setting);

                      case 37:
                        preWithoutBots = _context.sent;
                        withoutBots = _lodash["default"].sampleSize(preWithoutBots, Number(filteredMessage[2]));

                        if (!(withoutBots.length < 1)) {
                          _context.next = 47;
                          break;
                        }

                        _context.next = 42;
                        return _models["default"].activity.create({
                          type: 'thunderstorm_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 42:
                        failActivity = _context.sent;
                        activity.unshift(failActivity);
                        _context.next = 46;
                        return message.channel.send({
                          embeds: [(0, _discord.notEnoughActiveUsersMessage)(message, 'ThunderStorm')]
                        });

                      case 46:
                        return _context.abrupt("return");

                      case 47:
                        _context.next = 49;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 54;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 54:
                        faucetWatered = _context.sent;
                        _context.next = 57;
                        return _models["default"].thunderstorm.create({
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

                      case 57:
                        thunderstormRecord = _context.sent;
                        _context.next = 60;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'thunderstorm_s',
                          spenderId: user.id,
                          thunderstormId: thunderstormRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 60:
                        preActivity = _context.sent;
                        _context.next = 63;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].thunderstorm,
                            as: 'thunderstorm'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 63:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 67;

                        _iterator.s();

                      case 69:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 88;
                          break;
                        }

                        thunderstormee = _step.value;
                        _context.next = 73;
                        return thunderstormee.wallet.update({
                          available: thunderstormee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 73:
                        thunderstormeeWallet = _context.sent;
                        _context.next = 76;
                        return _models["default"].thunderstormtip.create({
                          amount: amountPerUser,
                          userId: thunderstormee.id,
                          thunderstormId: thunderstormRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 76:
                        thunderstormtipRecord = _context.sent;

                        if (thunderstormee.ignoreMe) {
                          listOfUsersRained.push("".concat(thunderstormee.username));
                        } else {
                          userIdReceivedRain = thunderstormee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 81;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'thunderstormtip_s',
                          spenderId: user.id,
                          earnerId: thunderstormee.id,
                          thunderstormId: thunderstormRecord.id,
                          thunderstormtipId: thunderstormtipRecord.id,
                          earner_balance: thunderstormeeWallet.available + thunderstormeeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 81:
                        tipActivity = _context.sent;
                        _context.next = 84;
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
                            model: _models["default"].thunderstorm,
                            as: 'thunderstorm'
                          }, {
                            model: _models["default"].thunderstormtip,
                            as: 'thunderstormtip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 84:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 86:
                        _context.next = 69;
                        break;

                      case 88:
                        _context.next = 93;
                        break;

                      case 90:
                        _context.prev = 90;
                        _context.t0 = _context["catch"](67);

                        _iterator.e(_context.t0);

                      case 93:
                        _context.prev = 93;

                        _iterator.f();

                        return _context.finish(93);

                      case 96:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 99;

                        _iterator2.s();

                      case 101:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 107;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 105;
                        return message.channel.send(element);

                      case 105:
                        _context.next = 101;
                        break;

                      case 107:
                        _context.next = 112;
                        break;

                      case 109:
                        _context.prev = 109;
                        _context.t1 = _context["catch"](99);

                        _iterator2.e(_context.t1);

                      case 112:
                        _context.prev = 112;

                        _iterator2.f();

                        return _context.finish(112);

                      case 115:
                        _context.next = 117;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterSuccessMessage)(message, thunderstormRecord.id, amount, withoutBots, amountPerUser, '⛈ Thunderstorm ⛈', 'thunderstormed')]
                        });

                      case 117:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 118:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[67, 90, 93, 96], [99, 109, 112, 115]]);
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
                          type: 'thunderstorm',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("thunderstorm error: ".concat(err));

                        message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("ThunderStorm")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
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

  return function discordThunderStorm(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordThunderStorm = discordThunderStorm;