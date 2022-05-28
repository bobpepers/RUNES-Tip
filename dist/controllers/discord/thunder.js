"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordThunder = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/client/discord/validateAmount");

var _mapMembers = require("../../helpers/client/discord/mapMembers");

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _waterFaucet = require("../../helpers/waterFaucet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordThunder = /*#__PURE__*/function () {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, members, onlineMembers, preWithoutBots, withoutBots, failActivity, updatedBalance, fee, amountPerUser, faucetWatered, thunderRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, thunderee, thundereeWallet, thundertipRecord, userIdReceivedRain, tipActivity, _i, _listOfUsersRained, userThunder;

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
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

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
                        return discordClient.guilds.cache.get(message.guildId).members.fetch({
                          withPresences: true
                        });

                      case 21:
                        members = _context.sent;
                        onlineMembers = members.filter(function (member) {
                          return member.presence && member.presence.status && member.presence.status === "online";
                        });
                        _context.next = 25;
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[3], onlineMembers, setting);

                      case 25:
                        preWithoutBots = _context.sent;
                        withoutBots = _lodash["default"].sampleSize(preWithoutBots, 1);

                        if (!(withoutBots.length < 1)) {
                          _context.next = 35;
                          break;
                        }

                        _context.next = 30;
                        return _models["default"].activity.create({
                          type: 'thunder_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        failActivity = _context.sent;
                        activity.unshift(failActivity);
                        _context.next = 34;
                        return message.channel.send({
                          embeds: [(0, _discord.notEnoughActiveUsersMessage)(message, 'Thunder')]
                        });

                      case 34:
                        return _context.abrupt("return");

                      case 35:
                        if (!(withoutBots.length === 1)) {
                          _context.next = 93;
                          break;
                        }

                        _context.next = 38;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 38:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 43;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 43:
                        faucetWatered = _context.sent;
                        _context.next = 46;
                        return _models["default"].thunder.create({
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

                      case 46:
                        thunderRecord = _context.sent;
                        _context.next = 49;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'thunder_s',
                          spenderId: user.id,
                          thunderId: thunderRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        preActivity = _context.sent;
                        _context.next = 52;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].thunder,
                            as: 'thunder'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 52:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 56;

                        _iterator.s();

                      case 58:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 77;
                          break;
                        }

                        thunderee = _step.value;
                        _context.next = 62;
                        return thunderee.wallet.update({
                          available: thunderee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 62:
                        thundereeWallet = _context.sent;
                        _context.next = 65;
                        return _models["default"].thundertip.create({
                          amount: amountPerUser,
                          userId: thunderee.id,
                          thunderId: thunderRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 65:
                        thundertipRecord = _context.sent;

                        if (thunderee.ignoreMe) {
                          listOfUsersRained.push("".concat(thunderee.username));
                        } else {
                          userIdReceivedRain = thunderee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 70;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'thundertip_s',
                          spenderId: user.id,
                          earnerId: thunderee.id,
                          thunderId: thunderRecord.id,
                          thundertipId: thundertipRecord.id,
                          earner_balance: thundereeWallet.available + thundereeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 70:
                        tipActivity = _context.sent;
                        _context.next = 73;
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
                            model: _models["default"].thunder,
                            as: 'thunder'
                          }, {
                            model: _models["default"].thundertip,
                            as: 'thundertip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 73:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 75:
                        _context.next = 58;
                        break;

                      case 77:
                        _context.next = 82;
                        break;

                      case 79:
                        _context.prev = 79;
                        _context.t0 = _context["catch"](56);

                        _iterator.e(_context.t0);

                      case 82:
                        _context.prev = 82;

                        _iterator.f();

                        return _context.finish(82);

                      case 85:
                        _i = 0, _listOfUsersRained = listOfUsersRained;

                      case 86:
                        if (!(_i < _listOfUsersRained.length)) {
                          _context.next = 93;
                          break;
                        }

                        userThunder = _listOfUsersRained[_i];
                        _context.next = 90;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterThunderSuccess)(message, thunderRecord.id, amount, userThunder)]
                        });

                      case 90:
                        _i++;
                        _context.next = 86;
                        break;

                      case 93:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 94:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[56, 79, 82, 85]]);
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
                          type: 'thunder',
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

                        _logger["default"].error("thunder error: ".concat(err));

                        _context2.next = 12;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Thunder")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 12:
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

  return function discordThunder(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordThunder = discordThunder;