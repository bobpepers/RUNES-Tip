"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordThunder = void 0;

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

var discordThunder = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io) {
    var members, onlineMembers, mappedMembersArray, preWithoutBots, _iterator, _step, discordUser, userExist, userIdTest, withoutBots, activity, user;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return discordClient.guilds.cache.get(message.guildId).members.fetch({
              withPresences: true
            });

          case 2:
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
            _context2.prev = 7;

            _iterator.s();

          case 9:
            if ((_step = _iterator.n()).done) {
              _context2.next = 18;
              break;
            }

            discordUser = _step.value;

            if (!(discordUser.bot === false)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 14;
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

          case 14:
            userExist = _context2.sent;

            if (userExist) {
              userIdTest = userExist.user_id.replace('discord-', '');

              if (userIdTest !== message.author.id) {
                preWithoutBots.push(userExist);
              }
            }

          case 16:
            _context2.next = 9;
            break;

          case 18:
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](7);

            _iterator.e(_context2.t0);

          case 23:
            _context2.prev = 23;

            _iterator.f();

            return _context2.finish(23);

          case 26:
            withoutBots = _lodash["default"].sampleSize(preWithoutBots, 1);
            _context2.next = 29;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var amount, updatedBalance, amountPerUser, thunderRecord, listOfUsersRained, _iterator2, _step2, thunderee, thundereeWallet, thundertipRecord, userIdReceivedRain, tipActivity, _i, _listOfUsersRained, userThunder;

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
                          type: 'thunder_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context.sent;
                        _context.next = 9;
                        return message.channel.send({
                          embeds: [(0, _discord.walletNotFoundMessage)(message, 'Thunder')]
                        });

                      case 9:
                        return _context.abrupt("return");

                      case 10:
                        amount = 0;

                        if (filteredMessage[2].toLowerCase() === 'all') {
                          amount = user.wallet.available;
                        } else {
                          amount = new _bignumber["default"](filteredMessage[2]).times(1e8).toNumber();
                        }

                        if (!(amount < Number(_settings["default"].min.discord.thunder))) {
                          _context.next = 19;
                          break;
                        }

                        _context.next = 15;
                        return _models["default"].activity.create({
                          type: 'thunder_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        activity = _context.sent;
                        _context.next = 18;
                        return message.channel.send({
                          embeds: [(0, _discord.minimumMessage)(message, 'Thunder')]
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
                          type: 'thunder_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 22:
                        activity = _context.sent;
                        _context.next = 25;
                        return message.channel.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'Thunder')]
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
                          type: 'thunder_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        activity = _context.sent;
                        _context.next = 32;
                        return message.channel.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'Thunder')]
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
                          embeds: [(0, _discord.insufficientBalanceMessage)(message, 'Thunder')]
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
                          type: 'thunder_f',
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
                        if (!(withoutBots.length === 1)) {
                          _context.next = 102;
                          break;
                        }

                        _context.next = 50;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 50:
                        updatedBalance = _context.sent;
                        amountPerUser = (amount / withoutBots.length).toFixed(0);
                        _context.next = 54;
                        return _models["default"].thunder.create({
                          amount: amount,
                          userCount: withoutBots.length,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 54:
                        thunderRecord = _context.sent;
                        _context.next = 57;
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

                      case 57:
                        activity = _context.sent;
                        _context.next = 60;
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

                      case 60:
                        activity = _context.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 63;

                        _iterator2.s();

                      case 65:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 85;
                          break;
                        }

                        thunderee = _step2.value;
                        _context.next = 69;
                        return thunderee.wallet.update({
                          available: thunderee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 69:
                        thundereeWallet = _context.sent;
                        _context.next = 72;
                        return _models["default"].thundertip.create({
                          amount: amountPerUser,
                          userId: thunderee.id,
                          thunderId: thunderRecord.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 72:
                        thundertipRecord = _context.sent;

                        if (thunderee.ignoreMe) {
                          listOfUsersRained.push("".concat(thunderee.username));
                        } else {
                          userIdReceivedRain = thunderee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0;
                        _context.next = 77;
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

                      case 77:
                        tipActivity = _context.sent;
                        _context.next = 80;
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

                      case 80:
                        tipActivity = _context.sent;
                        console.log(tipActivity);
                        io.to('admin').emit('updateActivity', {
                          activity: tipActivity
                        });

                      case 83:
                        _context.next = 65;
                        break;

                      case 85:
                        _context.next = 90;
                        break;

                      case 87:
                        _context.prev = 87;
                        _context.t0 = _context["catch"](63);

                        _iterator2.e(_context.t0);

                      case 90:
                        _context.prev = 90;

                        _iterator2.f();

                        return _context.finish(90);

                      case 93:
                        _i = 0, _listOfUsersRained = listOfUsersRained;

                      case 94:
                        if (!(_i < _listOfUsersRained.length)) {
                          _context.next = 101;
                          break;
                        }

                        userThunder = _listOfUsersRained[_i];
                        _context.next = 98;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterThunderSuccess)(message, amount, userThunder)]
                        });

                      case 98:
                        _i++;
                        _context.next = 94;
                        break;

                      case 101:
                        _logger["default"].info("Success Thunder Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                      case 102:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 103:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[63, 87, 90, 93]]);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send('something went wrong');
            });

          case 29:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 30:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 20, 23, 26]]);
  }));

  return function discordThunder(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordThunder = discordThunder;