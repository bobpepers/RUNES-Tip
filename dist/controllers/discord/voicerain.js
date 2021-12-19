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

var _validateAmount = require("../../helpers/discord/validateAmount");

var _mapMembers = require("../../helpers/discord/mapMembers");

var _userWalletExist = require("../../helpers/discord/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordVoiceRain = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io, groupTask, channelTask, setting) {
    var voiceChannelId, voiceChannel, onlineMembers, activity, user;
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
              embeds: [(0, _discord.NotInDirectMessage)(message, 'Voicerain')]
            });

          case 3:
            return _context2.abrupt("return");

          case 4:
            if (filteredMessage[3].startsWith('<#')) {
              _context2.next = 7;
              break;
            }

            console.log('not a channel');
            return _context2.abrupt("return");

          case 7:
            if (filteredMessage[3].endsWith('>')) {
              _context2.next = 10;
              break;
            }

            console.log('not a channel');
            return _context2.abrupt("return");

          case 10:
            voiceChannelId = filteredMessage[3].substr(2).slice(0, -1);
            _context2.next = 13;
            return _models["default"].channel.findOne({
              where: {
                channelId: "discord-".concat(voiceChannelId),
                groupId: groupTask.id
              }
            });

          case 13:
            voiceChannel = _context2.sent;

            if (voiceChannel) {
              _context2.next = 17;
              break;
            }

            console.log('channel not found');
            return _context2.abrupt("return");

          case 17:
            _context2.next = 19;
            return discordClient.channels.cache.get(voiceChannelId).members;

          case 19:
            onlineMembers = _context2.sent;
            _context2.next = 22;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, withoutBots, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, amountPerUser, rainRecord, listOfUsersRained, _iterator, _step, rainee, raineeWallet, raintipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

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
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[4], onlineMembers, setting);

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
                          _context.next = 27;
                          break;
                        }

                        _context.next = 23;
                        return _models["default"].activity.create({
                          type: 'voicerain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 23:
                        activity = _context.sent;
                        _context.next = 26;
                        return message.channel.send('Not enough users');

                      case 26:
                        return _context.abrupt("return");

                      case 27:
                        _context.next = 29;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 34;
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

                      case 34:
                        rainRecord = _context.sent;
                        _context.next = 37;
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

                      case 37:
                        activity = _context.sent;
                        _context.next = 40;
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

                      case 40:
                        activity = _context.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 43;

                        _iterator.s();

                      case 45:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 65;
                          break;
                        }

                        rainee = _step.value;
                        _context.next = 49;
                        return rainee.wallet.update({
                          available: rainee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        raineeWallet = _context.sent;
                        _context.next = 52;
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

                      case 52:
                        raintipRecord = _context.sent;

                        if (rainee.ignoreMe) {
                          listOfUsersRained.push("".concat(rainee.username));
                        } else {
                          userIdReceivedRain = rainee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 57;
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

                      case 57:
                        tipActivity = _context.sent;
                        _context.next = 60;
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

                      case 60:
                        tipActivity = _context.sent;
                        console.log(tipActivity);
                        io.to('admin').emit('updateActivity', {
                          activity: tipActivity
                        });

                      case 63:
                        _context.next = 45;
                        break;

                      case 65:
                        _context.next = 70;
                        break;

                      case 67:
                        _context.prev = 67;
                        _context.t0 = _context["catch"](43);

                        _iterator.e(_context.t0);

                      case 70:
                        _context.prev = 70;

                        _iterator.f();

                        return _context.finish(70);

                      case 73:
                        newStringListUsers = listOfUsersRained.join(", ");
                        console.log(newStringListUsers);
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 77;

                        _iterator2.s();

                      case 79:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 85;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 83;
                        return message.channel.send(element);

                      case 83:
                        _context.next = 79;
                        break;

                      case 85:
                        _context.next = 90;
                        break;

                      case 87:
                        _context.prev = 87;
                        _context.t1 = _context["catch"](77);

                        _iterator2.e(_context.t1);

                      case 90:
                        _context.prev = 90;

                        _iterator2.f();

                        return _context.finish(90);

                      case 93:
                        _context.next = 95;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterSuccessMessage)(message, amount, withoutBots, amountPerUser, 'Rain', 'rained')]
                        });

                      case 95:
                        _logger["default"].info("Success Rain Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 97:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[43, 67, 70, 73], [77, 87, 90, 93]]);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send('something went wrong');
            });

          case 22:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function discordVoiceRain(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordVoiceRain = discordVoiceRain;