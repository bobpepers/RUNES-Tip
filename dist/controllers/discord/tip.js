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
    return _regenerator["default"].wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(!groupTask || !channelTask)) {
              _context3.next = 4;
              break;
            }

            _context3.next = 3;
            return message.channel.send({
              embeds: [(0, _discord.NotInDirectMessage)(message, 'Tip')]
            });

          case 3:
            return _context3.abrupt("return");

          case 4:
            AmountPosition = 1;
            AmountPositionEnded = false;
            usersToTip = [];
            type = 'split';
            _context3.next = 10;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _loop, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, updatedBalance, fee, userTipAmount, tipRecord, listOfUsersRained, _iterator, _step, tipee, tipeeWallet, tiptipRecord, userIdReceivedRain;

                return _regenerator["default"].wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
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
                        user = _context2.sent;

                        if (user) {
                          _context2.next = 11;
                          break;
                        }

                        console.log('user not found');
                        _context2.next = 7;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 7:
                        activity = _context2.sent;
                        _context2.next = 10;
                        return message.channel.send({
                          embeds: [(0, _discord.userNotFoundMessage)(message, 'Tip')]
                        });

                      case 10:
                        return _context2.abrupt("return");

                      case 11:
                        console.log(usersToTip);
                        console.log(AmountPosition);
                        console.log(type); // make users to tip array

                        _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                          var discordId, userExist, userIdTest;
                          return _regenerator["default"].wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  discordId = void 0;

                                  if (filteredMessage[AmountPosition].startsWith('<@!')) {
                                    discordId = filteredMessage[AmountPosition].slice(3).slice(0, -1);
                                  } else if (filteredMessage[AmountPosition].startsWith('<@') && !filteredMessage[AmountPosition].startsWith('<@!')) {
                                    discordId = filteredMessage[AmountPosition].slice(2).slice(0, -1);
                                  }

                                  console.log(discordId); // eslint-disable-next-line no-await-in-loop

                                  _context.next = 5;
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

                                case 5:
                                  userExist = _context.sent;

                                  if (userExist) {
                                    userIdTest = userExist.user_id.replace('discord-', '');

                                    if (userIdTest !== message.author.id) {
                                      if (!usersToTip.find(function (o) {
                                        return o.id === userExist.id;
                                      })) {
                                        usersToTip.push(userExist);
                                      }
                                    }
                                  } // usersToTip.push(filteredMessage[AmountPosition]);


                                  // usersToTip.push(filteredMessage[AmountPosition]);
                                  AmountPosition += 1;

                                  if (!filteredMessage[AmountPosition].startsWith('<@')) {
                                    AmountPositionEnded = true;
                                  }

                                case 9:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _loop);
                        });

                      case 15:
                        if (AmountPositionEnded) {
                          _context2.next = 19;
                          break;
                        }

                        return _context2.delegateYield(_loop(), "t0", 17);

                      case 17:
                        _context2.next = 15;
                        break;

                      case 19:
                        if (!(usersToTip.length < 1)) {
                          _context2.next = 23;
                          break;
                        }

                        _context2.next = 22;
                        return message.channel.send({
                          embeds: [(0, _discord.notEnoughUsersToTip)(message)]
                        });

                      case 22:
                        return _context2.abrupt("return");

                      case 23:
                        if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
                          type = 'each';
                        } // verify amount


                        _context2.next = 26;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[AmountPosition], user, setting, 'tip', type, usersToTip);

                      case 26:
                        _yield$validateAmount = _context2.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context2.next = 33;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context2.abrupt("return");

                      case 33:
                        _context2.next = 35;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 35:
                        updatedBalance = _context2.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = (amount - Number(fee)) / usersToTip.length;
                        _context2.next = 40;
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

                      case 40:
                        tipRecord = _context2.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToTip);
                        _context2.prev = 43;

                        _iterator.s();

                      case 45:
                        if ((_step = _iterator.n()).done) {
                          _context2.next = 56;
                          break;
                        }

                        tipee = _step.value;
                        _context2.next = 49;
                        return tipee.wallet.update({
                          available: tipee.wallet.available + Number(userTipAmount)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        tipeeWallet = _context2.sent;
                        _context2.next = 52;
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

                      case 52:
                        tiptipRecord = _context2.sent;

                        if (tipee.ignoreMe) {
                          listOfUsersRained.push("".concat(tipee.username));
                        } else {
                          userIdReceivedRain = tipee.user_id.replace('discord-', '');
                          listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                        }

                      case 54:
                        _context2.next = 45;
                        break;

                      case 56:
                        _context2.next = 61;
                        break;

                      case 58:
                        _context2.prev = 58;
                        _context2.t1 = _context2["catch"](43);

                        _iterator.e(_context2.t1);

                      case 61:
                        _context2.prev = 61;

                        _iterator.f();

                        return _context2.finish(61);

                      case 64:
                        _context2.next = 66;
                        return message.channel.send({
                          embeds: [(0, _discord.tipSuccessMessage)(message, listOfUsersRained, userTipAmount, type)]
                        });

                      case 66:
                        // await message.channel.send({ embeds: [AfterThunderStormSuccess(message, amount, amountPerUser, listOfUsersRained)] });
                        _logger["default"].info("Success Tip Requested by: ".concat(message.author.id, "-").concat(message.author.username, " for ").concat(amount / 1e8));

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 68:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee, null, [[43, 58, 61, 64]]);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send('something went wrong');
            });

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2);
  }));

  return function tipRunesToDiscordUser(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToDiscordUser = tipRunesToDiscordUser;