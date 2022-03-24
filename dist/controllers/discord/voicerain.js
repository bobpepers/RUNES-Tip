"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordVoiceRain = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _validateAmount = require("../../helpers/client/discord/validateAmount");

var _mapMembers = require("../../helpers/client/discord/mapMembers");

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _waterFaucet = require("../../helpers/waterFaucet");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordVoiceRain = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var activity, userActivity, user;
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
                var voiceChannelId, voiceChannel, onlineMembers, _yield$userWalletExis, _yield$userWalletExis2, withoutBots, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, failActivity, updatedBalance, fee, amountPerUser, faucetWatered, rainRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, rainee, raineeWallet, raintipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (filteredMessage[3].startsWith('<#')) {
                          _context.next = 4;
                          break;
                        }

                        _context.next = 3;
                        return message.channel.send({
                          embeds: [(0, _discord.notAVoiceChannel)(message)]
                        });

                      case 3:
                        return _context.abrupt("return");

                      case 4:
                        if (filteredMessage[3].endsWith('>')) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 7;
                        return message.channel.send({
                          embeds: [(0, _discord.notAVoiceChannel)(message)]
                        });

                      case 7:
                        return _context.abrupt("return");

                      case 8:
                        voiceChannelId = filteredMessage[3].substr(2).slice(0, -1);
                        _context.next = 11;
                        return _models["default"].channel.findOne({
                          where: {
                            channelId: "discord-".concat(voiceChannelId),
                            groupId: groupTask.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 11:
                        voiceChannel = _context.sent;

                        if (voiceChannel) {
                          _context.next = 16;
                          break;
                        }

                        _context.next = 15;
                        return message.channel.send({
                          embeds: [(0, _discord.voiceChannelNotFound)(message)]
                        });

                      case 15:
                        return _context.abrupt("return");

                      case 16:
                        _context.next = 18;
                        return discordClient.channels.cache.get(voiceChannelId).members;

                      case 18:
                        onlineMembers = _context.sent;
                        _context.next = 21;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

                      case 21:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 28;
                          break;
                        }

                        return _context.abrupt("return");

                      case 28:
                        _context.next = 30;
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[4], onlineMembers, setting);

                      case 30:
                        withoutBots = _context.sent;
                        _context.next = 33;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

                      case 33:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 40;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 40:
                        if (!(withoutBots.length < 2)) {
                          _context.next = 48;
                          break;
                        }

                        _context.next = 43;
                        return _models["default"].activity.create({
                          type: 'voicerain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 43:
                        failActivity = _context.sent;
                        activity.unshift(failActivity);
                        _context.next = 47;
                        return message.channel.send({
                          embeds: [(0, _discord.notEnoughActiveUsersMessage)(message, 'Voice Rain')]
                        });

                      case 47:
                        return _context.abrupt("return");

                      case 48:
                        _context.next = 50;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 50:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 55;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 55:
                        faucetWatered = _context.sent;
                        _context.next = 58;
                        return _models["default"].voicerain.create({
                          amount: Number(amount),
                          feeAmount: Number(fee),
                          userCount: withoutBots.length,
                          userId: user.id,
                          groupId: groupTask.id,
                          channelId: voiceChannel.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 58:
                        rainRecord = _context.sent;
                        _context.next = 61;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'voicerain_s',
                          spenderId: user.id,
                          rainId: rainRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 61:
                        preActivity = _context.sent;
                        _context.next = 64;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
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

                      case 64:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 68;

                        _iterator.s();

                      case 70:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 89;
                          break;
                        }

                        rainee = _step.value;
                        _context.next = 74;
                        return rainee.wallet.update({
                          available: rainee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 74:
                        raineeWallet = _context.sent;
                        _context.next = 77;
                        return _models["default"].voiceraintip.create({
                          amount: Number(amountPerUser),
                          userId: rainee.id,
                          voicerainId: rainRecord.id,
                          groupId: groupTask.id,
                          channelId: voiceChannel.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 77:
                        raintipRecord = _context.sent;

                        if (rainee.ignoreMe) {
                          listOfUsersRained.push("".concat(rainee.username));
                        } else {
                          userIdReceivedRain = rainee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 82;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'voiceraintip_s',
                          spenderId: user.id,
                          earnerId: rainee.id,
                          voicerainId: rainRecord.id,
                          voiceraintipId: raintipRecord.id,
                          earner_balance: raineeWallet.available + raineeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 82:
                        tipActivity = _context.sent;
                        _context.next = 85;
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

                      case 85:
                        tipActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 87:
                        _context.next = 70;
                        break;

                      case 89:
                        _context.next = 94;
                        break;

                      case 91:
                        _context.prev = 91;
                        _context.t0 = _context["catch"](68);

                        _iterator.e(_context.t0);

                      case 94:
                        _context.prev = 94;

                        _iterator.f();

                        return _context.finish(94);

                      case 97:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 100;

                        _iterator2.s();

                      case 102:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 108;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 106;
                        return message.channel.send(element);

                      case 106:
                        _context.next = 102;
                        break;

                      case 108:
                        _context.next = 113;
                        break;

                      case 110:
                        _context.prev = 110;
                        _context.t1 = _context["catch"](100);

                        _iterator2.e(_context.t1);

                      case 113:
                        _context.prev = 113;

                        _iterator2.f();

                        return _context.finish(113);

                      case 116:
                        _context.next = 118;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterSuccessMessage)(message, rainRecord.id, amount, withoutBots, amountPerUser, 'VoiceRain', 'rained')]
                        });

                      case 118:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 119:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[68, 91, 94, 97], [100, 110, 113, 116]]);
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
                          type: 'voicerain',
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
                        _logger["default"].error("voicerain error: ".concat(err));

                        message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("VoiceRain")]
                        });

                      case 10:
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

  return function discordVoiceRain(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordVoiceRain = discordVoiceRain;