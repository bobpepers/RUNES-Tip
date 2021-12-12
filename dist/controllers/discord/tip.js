"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipRunesToDiscordUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _validateAmount = require("../../helpers/discord/validateAmount");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tipRunesToDiscordUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io, groupTask, channelTask, setting) {
    var activity, user, AmountPosition, AmountPositionEnded, usersToTip, type;
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
              embeds: [(0, _discord.NotInDirectMessage)(message, 'Tip')]
            });

          case 3:
            return _context2.abrupt("return");

          case 4:
            AmountPosition = 1;
            AmountPositionEnded = false;
            usersToTip = [];
            type = 'split';
            _context2.next = 10;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var discordId, userExist, userIdTest, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, userTipAmount, tipRecord, listOfUsersRained, _iterator, _step, tipee, tipeeWallet, tiptipRecord, userIdReceivedRain;

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
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context.sent;
                        _context.next = 9;
                        return message.channel.send({
                          embeds: [(0, _discord.userNotFoundMessage)(message, 'Tip')]
                        });

                      case 9:
                        return _context.abrupt("return");

                      case 10:
                        console.log(usersToTip);
                        console.log(AmountPosition);
                        console.log(type); // make users to tip array

                      case 13:
                        if (AmountPositionEnded) {
                          _context.next = 25;
                          break;
                        }

                        console.log(filteredMessage[AmountPosition]);
                        discordId = filteredMessage[AmountPosition].slice(3).slice(0, -1);
                        console.log(discordId); // eslint-disable-next-line no-await-in-loop

                        _context.next = 19;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(discordId)
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

                      case 19:
                        userExist = _context.sent;

                        if (userExist) {
                          userIdTest = userExist.user_id.replace('discord-', '');

                          if (userIdTest !== message.author.id) {
                            usersToTip.push(userExist);
                          }
                        } // usersToTip.push(filteredMessage[AmountPosition]);


                        // usersToTip.push(filteredMessage[AmountPosition]);
                        AmountPosition += 1;

                        if (!filteredMessage[AmountPosition].startsWith('<@!')) {
                          AmountPositionEnded = true;
                        }

                        _context.next = 13;
                        break;

                      case 25:
                        if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
                          type = 'each';
                        } // verify amount


                        _context.next = 28;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[AmountPosition], user, setting, 'tip', type, usersToTip);

                      case 28:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 35;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context.abrupt("return");

                      case 35:
                        _context.next = 37;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 37:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = (amount - Number(fee)) / usersToTip.length;
                        _context.next = 42;
                        return _models["default"].tip.create({
                          feeAmount: fee,
                          amount: amount,
                          type: type,
                          userCount: usersToTip.length,
                          userId: user.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 42:
                        tipRecord = _context.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToTip);
                        _context.prev = 45;

                        _iterator.s();

                      case 47:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 58;
                          break;
                        }

                        tipee = _step.value;
                        _context.next = 51;
                        return tipee.wallet.update({
                          available: tipee.wallet.available + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 51:
                        tipeeWallet = _context.sent;
                        _context.next = 54;
                        return _models["default"].tiptip.create({
                          amount: Number(userTipAmount),
                          userId: tipee.id,
                          tipId: tipRecord.id,
                          groupId: groupTask.id,
                          channelId: channelTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 54:
                        tiptipRecord = _context.sent;

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(tipee.username));
                        } else {
                          userIdReceivedRain = tipee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                      case 56:
                        _context.next = 47;
                        break;

                      case 58:
                        _context.next = 63;
                        break;

                      case 60:
                        _context.prev = 60;
                        _context.t0 = _context["catch"](45);

                        _iterator.e(_context.t0);

                      case 63:
                        _context.prev = 63;

                        _iterator.f();

                        return _context.finish(63);

                      case 66:
                        _context.next = 68;
                        return message.channel.send({
                          embeds: [(0, _discord.tipSuccessMessage)(message, listOfUsersRained, userTipAmount, type)]
                        });

                      case 68:
                        // await message.channel.send({ embeds: [AfterThunderStormSuccess(message, amount, amountPerUser, listOfUsersRained)] });
                        _logger["default"].info("Success Tip Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 70:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[45, 60, 63, 66]]);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send('something went wrong');
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function tipRunesToDiscordUser(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToDiscordUser = tipRunesToDiscordUser;