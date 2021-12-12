"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordThunder = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/discord/validateAmount");

var _mapMembers = require("../../helpers/discord/mapMembers");

var _userWalletExist = require("../../helpers/discord/userWalletExist");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordThunder = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io, groupTask, channelTask, setting) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, preWithoutBots, withoutBots, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, amountPerUser, thunderRecord, listOfUsersRained, _iterator, _step, thunderee, thundereeWallet, thundertipRecord, userIdReceivedRain, tipActivity, _i, _listOfUsersRained, userThunder;

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
                        return (0, _mapMembers.mapMembers)(message, t, filteredMessage[3], onlineMembers);

                      case 10:
                        preWithoutBots = _context.sent;
                        withoutBots = _lodash["default"].sampleSize(preWithoutBots, 1);
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

                        activity = activityValiateAmount;
                        return _context.abrupt("return");

                      case 21:
                        if (!(withoutBots.length < 1)) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 24;
                        return _models["default"].activity.create({
                          type: 'thunder_f',
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
                        if (!(withoutBots.length === 1)) {
                          _context.next = 84;
                          break;
                        }

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

                      case 36:
                        thunderRecord = _context.sent;
                        _context.next = 39;
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

                      case 39:
                        activity = _context.sent;
                        _context.next = 42;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activity.id
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

                      case 42:
                        activity = _context.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 45;

                        _iterator.s();

                      case 47:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 67;
                          break;
                        }

                        thunderee = _step.value;
                        _context.next = 51;
                        return thunderee.wallet.update({
                          available: thunderee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 51:
                        thundereeWallet = _context.sent;
                        _context.next = 54;
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

                      case 54:
                        thundertipRecord = _context.sent;

                        if (thunderee.ignoreMe) {
                          listOfUsersRained.push("".concat(thunderee.username));
                        } else {
                          userIdReceivedRain = thunderee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0;
                        _context.next = 59;
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

                      case 59:
                        tipActivity = _context.sent;
                        _context.next = 62;
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

                      case 62:
                        tipActivity = _context.sent;
                        console.log(tipActivity);
                        io.to('admin').emit('updateActivity', {
                          activity: tipActivity
                        });

                      case 65:
                        _context.next = 47;
                        break;

                      case 67:
                        _context.next = 72;
                        break;

                      case 69:
                        _context.prev = 69;
                        _context.t0 = _context["catch"](45);

                        _iterator.e(_context.t0);

                      case 72:
                        _context.prev = 72;

                        _iterator.f();

                        return _context.finish(72);

                      case 75:
                        _i = 0, _listOfUsersRained = listOfUsersRained;

                      case 76:
                        if (!(_i < _listOfUsersRained.length)) {
                          _context.next = 83;
                          break;
                        }

                        userThunder = _listOfUsersRained[_i];
                        _context.next = 80;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterThunderSuccess)(message, amount, userThunder)]
                        });

                      case 80:
                        _i++;
                        _context.next = 76;
                        break;

                      case 83:
                        _logger["default"].info("Success Thunder Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                      case 84:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 85:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[45, 69, 72, 75]]);
              }));

              return function (_x8) {
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

  return function discordThunder(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordThunder = discordThunder;