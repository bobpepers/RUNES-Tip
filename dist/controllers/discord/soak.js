"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordSoak = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _sequelize = require("sequelize");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var discordSoak = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io) {
    var members, onlineMembers, mappedMembersArray, withoutBots, _iterator, _step, discordUser, userExist, userIdTest, activity, user;

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
              var _member$presence, _member$presence2, _member$presence3;

              return ((_member$presence = member.presence) === null || _member$presence === void 0 ? void 0 : _member$presence.status) === "online" || ((_member$presence2 = member.presence) === null || _member$presence2 === void 0 ? void 0 : _member$presence2.status) === "idle" || ((_member$presence3 = member.presence) === null || _member$presence3 === void 0 ? void 0 : _member$presence3.status) === "dnd";
            });
            mappedMembersArray = onlineMembers.map(function (a) {
              return a.user;
            });
            withoutBots = []; // eslint-disable-next-line no-restricted-syntax

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
                withoutBots.push(userExist);
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
            _context2.next = 28;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var amount, updatedBalance, amountPerUser, soakRecord, listOfUsersRained, _iterator2, _step2, soakee, soakeeWallet, soaktipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator3, _step3, element;

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
                            include: [{
                              model: _models["default"].address,
                              as: 'addresses'
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
                          type: 'soak_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context.sent;
                        _context.next = 9;
                        return message.channel.send({
                          embeds: [(0, _discord.walletNotFoundMessage)(message, 'Soak')]
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

                        if (!(amount < Number(_settings["default"].min.discord.soak))) {
                          _context.next = 19;
                          break;
                        }

                        _context.next = 15;
                        return _models["default"].activity.create({
                          type: 'soak_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        activity = _context.sent;
                        _context.next = 18;
                        return message.channel.send({
                          embeds: [(0, _discord.minimumMessage)(message, 'Soak')]
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
                          type: 'soak_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 22:
                        activity = _context.sent;
                        _context.next = 25;
                        return message.channel.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'Soak')]
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
                          type: 'soak_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        activity = _context.sent;
                        _context.next = 32;
                        return message.channel.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'Soak')]
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
                          type: 'soak_i',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 36:
                        activity = _context.sent;
                        _context.next = 39;
                        return message.channel.send({
                          embeds: [(0, _discord.insufficientBalanceMessage)(message, 'Soak')]
                        });

                      case 39:
                        return _context.abrupt("return");

                      case 40:
                        if (!(withoutBots.length < 2)) {
                          _context.next = 47;
                          break;
                        }

                        _context.next = 43;
                        return _models["default"].activity.create({
                          type: 'soak_f',
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
                        return _models["default"].soak.create({
                          amount: amount,
                          userCount: withoutBots.length,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 53:
                        soakRecord = _context.sent;
                        _context.next = 56;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'soak_s',
                          spenderId: user.id,
                          soakId: soakRecord.id,
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
                            model: _models["default"].soak,
                            as: 'soak'
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
                          _context.next = 84;
                          break;
                        }

                        soakee = _step2.value;
                        _context.next = 68;
                        return soakee.wallet.update({
                          available: soakee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 68:
                        soakeeWallet = _context.sent;
                        _context.next = 71;
                        return _models["default"].soaktip.create({
                          amount: amountPerUser,
                          userId: soakee.id,
                          soakId: soakRecord.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 71:
                        soaktipRecord = _context.sent;

                        if (soakee.ignoreMe) {
                          listOfUsersRained.push("".concat(soakee.username));
                        } else {
                          userIdReceivedRain = soakee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                        tipActivity = void 0;
                        _context.next = 76;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'soaktip_s',
                          spenderId: user.id,
                          earnerId: soakee.id,
                          soakId: soakRecord.id,
                          soaktipId: soaktipRecord.id,
                          earner_balance: soakeeWallet.available + soakeeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 76:
                        tipActivity = _context.sent;
                        _context.next = 79;
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
                            model: _models["default"].soak,
                            as: 'soak'
                          }, {
                            model: _models["default"].soaktip,
                            as: 'soaktip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 79:
                        tipActivity = _context.sent;
                        console.log(tipActivity);
                        io.to('admin').emit('updateActivity', {
                          activity: tipActivity
                        });

                      case 82:
                        _context.next = 64;
                        break;

                      case 84:
                        _context.next = 89;
                        break;

                      case 86:
                        _context.prev = 86;
                        _context.t0 = _context["catch"](62);

                        _iterator2.e(_context.t0);

                      case 89:
                        _context.prev = 89;

                        _iterator2.f();

                        return _context.finish(89);

                      case 92:
                        newStringListUsers = listOfUsersRained.join(", ");
                        console.log(newStringListUsers);
                        cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator3 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 96;

                        _iterator3.s();

                      case 98:
                        if ((_step3 = _iterator3.n()).done) {
                          _context.next = 104;
                          break;
                        }

                        element = _step3.value;
                        _context.next = 102;
                        return message.channel.send(element);

                      case 102:
                        _context.next = 98;
                        break;

                      case 104:
                        _context.next = 109;
                        break;

                      case 106:
                        _context.prev = 106;
                        _context.t1 = _context["catch"](96);

                        _iterator3.e(_context.t1);

                      case 109:
                        _context.prev = 109;

                        _iterator3.f();

                        return _context.finish(109);

                      case 112:
                        _context.next = 114;
                        return message.channel.send({
                          embeds: [(0, _discord.AfterSuccessMessage)(message, amount, withoutBots, amountPerUser, 'Soak', 'soaked')]
                        });

                      case 114:
                        _logger["default"].info("Success Soak Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 116:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[62, 86, 89, 92], [96, 106, 109, 112]]);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send('something went wrong');
            });

          case 28:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 20, 23, 26]]);
  }));

  return function discordSoak(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordSoak = discordSoak;