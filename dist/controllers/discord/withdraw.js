"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawDiscordCreate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/client/discord/validateAmount");

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _validateWithdrawalAddress = require("../../helpers/blockchain/validateWithdrawalAddress");

/* eslint-disable import/prefer-default-export */
var withdrawDiscordCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient, message, filteredMessage, io, groupTask, channelTask, setting) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, userId, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, _yield$validateWithdr, _yield$validateWithdr2, isInvalidAddress, isNodeOffline, failWithdrawalActivity, addressExternal, UserExternalAddressMnMAssociation, wallet, fee, transaction, activityCreate;

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
                        userId = user.user_id.replace('discord-', '');
                        _context.next = 12;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[3], user, setting, filteredMessage[1].toLowerCase());

                      case 12:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 19;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 19:
                        _context.next = 21;
                        return (0, _validateWithdrawalAddress.validateWithdrawalAddress)(filteredMessage[2], user, t);

                      case 21:
                        _yield$validateWithdr = _context.sent;
                        _yield$validateWithdr2 = (0, _slicedToArray2["default"])(_yield$validateWithdr, 3);
                        isInvalidAddress = _yield$validateWithdr2[0];
                        isNodeOffline = _yield$validateWithdr2[1];
                        failWithdrawalActivity = _yield$validateWithdr2[2];

                        if (!isNodeOffline) {
                          _context.next = 29;
                          break;
                        }

                        _context.next = 29;
                        return message.author.send('Runebase node offline');

                      case 29:
                        if (!isInvalidAddress) {
                          _context.next = 32;
                          break;
                        }

                        _context.next = 32;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAddressMessage)(message)]
                        });

                      case 32:
                        if (!(isInvalidAddress || isNodeOffline)) {
                          _context.next = 36;
                          break;
                        }

                        if (!(message.channel.type !== 'DM')) {
                          _context.next = 36;
                          break;
                        }

                        _context.next = 36;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Withdraw')]
                        });

                      case 36:
                        if (!failWithdrawalActivity) {
                          _context.next = 39;
                          break;
                        }

                        activity.unshift(failWithdrawalActivity);
                        return _context.abrupt("return");

                      case 39:
                        _context.next = 41;
                        return _models["default"].addressExternal.findOne({
                          where: {
                            address: filteredMessage[2]
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 41:
                        addressExternal = _context.sent;

                        if (addressExternal) {
                          _context.next = 46;
                          break;
                        }

                        _context.next = 45;
                        return _models["default"].addressExternal.create({
                          address: filteredMessage[2]
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 45:
                        addressExternal = _context.sent;

                      case 46:
                        _context.next = 48;
                        return _models["default"].UserAddressExternal.findOne({
                          where: {
                            addressExternalId: addressExternal.id,
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 48:
                        UserExternalAddressMnMAssociation = _context.sent;

                        if (UserExternalAddressMnMAssociation) {
                          _context.next = 53;
                          break;
                        }

                        _context.next = 52;
                        return _models["default"].UserAddressExternal.create({
                          addressExternalId: addressExternal.id,
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 52:
                        UserExternalAddressMnMAssociation = _context.sent;

                      case 53:
                        _context.next = 55;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 55:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 59;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          addressExternalId: addressExternal.id,
                          phase: 'review',
                          type: 'send',
                          to_from: filteredMessage[2],
                          amount: amount,
                          feeAmount: Number(fee),
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 59:
                        transaction = _context.sent;
                        _context.next = 62;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 62:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate);

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 67;
                          break;
                        }

                        _context.next = 67;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message, transaction)]
                        });

                      case 67:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 72;
                          break;
                        }

                        _context.next = 70;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message, transaction)]
                        });

                      case 70:
                        _context.next = 72;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Withdraw')]
                        });

                      case 72:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 73:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x8) {
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
                          type: 'withdraw',
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

                        _logger["default"].error("withdraw error: ".concat(err));

                        if (!(err.code && err.code === 50007)) {
                          _context2.next = 15;
                          break;
                        }

                        _context2.next = 13;
                        return message.channel.send({
                          embeds: [(0, _discord.cannotSendMessageUser)("Withdraw", message)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 13:
                        _context2.next = 17;
                        break;

                      case 15:
                        _context2.next = 17;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Withdraw")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 17:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x9) {
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

  return function withdrawDiscordCreate(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawDiscordCreate = withdrawDiscordCreate;