"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordThunderStorm = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _sequelize = require("sequelize");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordThunderStorm = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io) {
    var members, onlineMembers, mappedMembersArray, preWithoutBots, _iterator, _step, discordUser, userExist, userIdTest, withoutBots, activity, user;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(Number(filteredMessage[2]) > 50)) {
              _context2.next = 4;
              break;
            }

            _context2.next = 3;
            return message.channel.send({
              embeds: [(0, _discord.thunderstormMaxUserAmountMessage)(message)]
            });

          case 3:
            return _context2.abrupt("return");

          case 4:
            if (!(Number(filteredMessage[2]) % 1 !== 0)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 7;
            return message.channel.send({
              embeds: [(0, _discord.thunderstormInvalidUserAmount)(message)]
            });

          case 7:
            return _context2.abrupt("return");

          case 8:
            if (!(Number(filteredMessage[2]) <= 0)) {
              _context2.next = 12;
              break;
            }

            _context2.next = 11;
            return message.channel.send({
              embeds: [(0, _discord.thunderstormUserZeroAmountMessage)(message)]
            });

          case 11:
            return _context2.abrupt("return");

          case 12:
            _context2.next = 14;
            return discordClient.guilds.cache.get(message.guildId).members.fetch({
              withPresences: true
            });

          case 14:
            members = _context2.sent;
            onlineMembers = members.filter(function (member) {
              var _member$presence;

              return ((_member$presence = member.presence) === null || _member$presence === void 0 ? void 0 : _member$presence.status) === "online";
            });
            mappedMembersArray = onlineMembers.map(function (a) {
              return a.user;
            });
            preWithoutBots = []; // eslint-disable-next-line no-restricted-syntax

            _iterator = _createForOfIteratorHelper(mappedMembersArray);
            _context2.prev = 19;

            _iterator.s();

          case 21:
            if ((_step = _iterator.n()).done) {
              _context2.next = 30;
              break;
            }

            discordUser = _step.value;

            if (!(discordUser.bot === false)) {
              _context2.next = 28;
              break;
            }

            _context2.next = 26;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(discordUser.id)
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet',
                required: true,
                include: [{
                  model: _models["default"].address,
                  as: 'addresses',
                  required: true
                }]
              }]
            });

          case 26:
            userExist = _context2.sent;

            if (userExist) {
              userIdTest = userExist.user_id.replace('discord-', '');

              if (userIdTest !== message.author.id) {
                preWithoutBots.push(userExist);
              }
            }

          case 28:
            _context2.next = 21;
            break;

          case 30:
            _context2.next = 35;
            break;

          case 32:
            _context2.prev = 32;
            _context2.t0 = _context2["catch"](19);

            _iterator.e(_context2.t0);

          case 35:
            _context2.prev = 35;

            _iterator.f();

            return _context2.finish(35);

          case 38:
            withoutBots = _lodash["default"].sampleSize(preWithoutBots, Number(filteredMessage[2]));
            _context2.next = 41;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var amount, updatedBalance, amountPerUser, thunderstormRecord, listOfUsersRained, _iterator2, _step2, thunderstormee, thunderstormeeWallet, thunderstormtipRecord, userIdReceivedRain, tipActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet',
                            required: true,
                            include: [{
                              model: _models["default"].address,
                              as: 'addresses',
                              required: true
                            }]
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;

                        if (user) {
                          _context.next = 10;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].activity.create({
                          type: 'thunderstorm_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context.sent;
                        _context.next = 9;
                        return message.channel.send({
                          embeds: [(0, _discord.walletNotFoundMessage)(message, 'ThunderStorm')]
                        });

                      case 9:
                        return _context.abrupt("return");

                      case 10:
                        amount = 0;

                        if (filteredMessage[3].toLowerCase() === 'all') {
                          amount = user.wallet.available;
                        } else {
                          amount = new _bignumber["default"](filteredMessage[3]).times(1e8).toNumber();
                        }

                        if (!(amount < Number(_settings["default"].min.discord.thunderstorm))) {
                          _context.next = 19;
                          break;
                        }

                        _context.next = 15;
                        return _models["default"].activity.create({
                          type: 'thunderstorm_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        activity = _context.sent;
                        _context.next = 18;
                        return message.channel.send({
                          embeds: [(0, _discord.minimumMessage)(message, 'ThunderStorm')]
                        });

                      case 18:
                        return _context.abrupt("return");

                      case 19:
                        if (!(amount % 1 !== 0)) {
                          _context.next = 26;
                          break;
                        }

                        _context.next = 22;
                        return _models["default"].activity.create({
                          type: 'thunderstorm_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 22:
                        activity = _context.sent;
                        _context.next = 25;
                        return message.channel.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'ThunderStorm')]
                        });

                      case 25:
                        return _context.abrupt("return");

                      case 26:
                        if (!(amount <= 0)) {
                          _context.next = 33;
                          break;
                        }

                        _context.next = 29;
                        return _models["default"].activity.create({
                          type: 'thunderstorm_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        activity = _context.sent;
                        _context.next = 32;
                        return message.channel.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'ThunderStorm')]
                        });

                      case 32:
                        return _context.abrupt("return");

                      case 33:
                        if (!(user.wallet.available < amount)) {
                          _context.next = 40;
                          break;
                        }

                        _context.next = 36;
                        return _models["default"].activity.create({
                          type: 'thunder_i',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 36:
                        activity = _context.sent;
                        _context.next = 39;
                        return message.channel.send({
                          embeds: [(0, _discord.insufficientBalanceMessage)(message, 'ThunderStorm')]
                        });

                      case 39:
                        return _context.abrupt("return");

                      case 40:
                        if (!(withoutBots.length < 1)) {
                          _context.next = 47;
                          break;
                        }

                        _context.next = 43;
                        return _models["default"].activity.create({
                          type: 'thunderstorm_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 43:
                        activity = _context.sent;
                        _context.next = 46;
                        return message.channel.send('Not enough online users');

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
                        amountPerUser = (amount / withoutBots.length).toFixed(0);
                        _context.next = 53;
                        return _models["default"].thunderstorm.create({
                          amount: amount,
                          userCount: withoutBots.length,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 53:
                        thunderstormRecord = _context.sent;
                        _context.next = 56;
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

                      case 56:
                        activity = _context.sent;
                        _context.next = 59;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activity.id
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

                      case 59:
                        activity = _context.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 62;

                        _iterator2.s();

                      case 64:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 88;
                          break;
                        }

                        thunderstormee = _step2.value;
                        _context.next = 68;
                        return thunderstormee.wallet.update({
                          available: thunderstormee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 68:
                        thunderstormeeWallet = _context.sent;
                        _context.next = 71;
                        return _models["default"].thunderstormtip.create({
                          amount: amountPerUser,
                          userId: thunderstormee.id,
                          thunderstormId: thunderstormRecord.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 71:
                        thunderstormtipRecord = _context.sent;

                        if (thunderstormee.ignoreMe) {
                          listOfUsersRained.push("".concat(thunderstormee.username));
                        } else {
                          userIdReceivedRain = thunderstormee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                          ;
                        }

                        tipActivity = void 0;
                        console.log(user);
                        console.log(thunderstormee);
                        console.log(thunderstormRecord);
                        console.log(thunderstormeeWallet);
                        _context.next = 80;
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

                      case 80:
                        tipActivity = _context.sent;
                        _context.next = 83;
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

                      case 83:
                        tipActivity = _context.sent;
                        console.log(tipActivity);
                        io.to('admin').emit('updateActivity', {
                          activity: tipActivity
                        });

                      case 86:
                        _context.next = 64;
                        break;

                      case 88:
                        _context.next = 93;
                        break;

                      case 90:
                        _context.prev = 90;
                        _context.t0 = _context["catch"](62);

                        _iterator2.e(_context.t0);

                      case 93:
                        _context.prev = 93;

                        _iterator2.f();

                        return _context.finish(93);

                      case 96:
                        _context.next = 98;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterThunderStormSuccess)(message, amount, amountPerUser, listOfUsersRained)]
                        });

                      case 98:
                        _logger["default"].info("Success Thunder Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 100:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[62, 90, 93, 96]]);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send('something went wrong');
            });

          case 41:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 42:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[19, 32, 35, 38]]);
  }));

  return function discordThunderStorm(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordThunderStorm = discordThunderStorm;