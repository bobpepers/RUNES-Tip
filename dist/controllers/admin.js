"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawTelegramAdminFetch = exports.withdrawTelegramAdminDecline = exports.withdrawTelegramAdminAccept = exports.fetchAdminNodeBalance = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../models"));

var _rclient = require("../services/rclient");

var _discord = require("../messages/discord");

var _telegram = require("../messages/telegram");

var _settings = _interopRequireDefault(require("../config/settings"));

// import { MessageEmbed, MessageAttachment } from "discord.js";
(0, _dotenv.config)();
/**
 * Create Withdrawal
 */

var withdrawTelegramAdminFetch = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(bot, ctx, adminTelegramId) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var withdrawal, withdrawalMessage;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].transaction.findOne({
                          order: [['createdAt', 'DESC']],
                          include: [{
                            model: _models["default"].address,
                            as: 'address',
                            include: [{
                              model: _models["default"].wallet,
                              as: 'wallet',
                              include: [{
                                model: _models["default"].user,
                                as: 'user'
                              }]
                            }]
                          }],
                          where: {
                            type: 'send',
                            phase: 'review'
                          }
                        });

                      case 2:
                        withdrawal = _context.sent;

                        if (!withdrawal) {
                          ctx.reply('No Withdrawals');
                        }

                        if (withdrawal) {
                          withdrawalMessage = "".concat(withdrawal.address.wallet.user.username, " with user_id ").concat(withdrawal.address.wallet.user.user_id, "\navailable: ").concat(withdrawal.address.wallet.available / 1e8, " \nlocked: ").concat(withdrawal.address.wallet.locked / 1e8, " \namount: ").concat(withdrawal.amount / 1e8, " \n      ");
                          ctx.deleteMessage();
                          bot.telegram.sendMessage(adminTelegramId, withdrawalMessage, {
                            reply_markup: {
                              inline_keyboard: [[{
                                text: "acceptWithdrawal",
                                callback_data: "acceptWithdrawal-".concat(withdrawal.id)
                              }, {
                                text: "declineWithdrawal",
                                callback_data: "declineWithdrawal-".concat(withdrawal.id)
                              }]]
                            }
                          });
                        }

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply('Something went wrong');
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function withdrawTelegramAdminFetch(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * isAdmin
 */


exports.withdrawTelegramAdminFetch = withdrawTelegramAdminFetch;

var withdrawTelegramAdminAccept = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(bot, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                var updatedTrans, transaction, amount, response, preResponse, opStatus, activity;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _models["default"].transaction.findOne({
                          where: {
                            id: withdrawalId,
                            phase: 'review'
                          },
                          include: [{
                            model: _models["default"].address,
                            as: 'address',
                            include: [{
                              model: _models["default"].wallet,
                              as: 'wallet',
                              include: [{
                                model: _models["default"].user,
                                as: 'user'
                              }]
                            }]
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        transaction = _context4.sent;

                        if (!transaction) {
                          ctx.reply('Transaction not found');
                        }

                        if (!transaction) {
                          _context4.next = 42;
                          break;
                        }

                        amount = (transaction.amount - Number(_settings["default"].fee.withdrawal)) / 1e8;

                        if (!(_settings["default"].coin.name === 'Runebase')) {
                          _context4.next = 12;
                          break;
                        }

                        _context4.next = 9;
                        return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

                      case 9:
                        response = _context4.sent;
                        _context4.next = 35;
                        break;

                      case 12:
                        if (!(_settings["default"].coin.name === 'Pirate')) {
                          _context4.next = 32;
                          break;
                        }

                        _context4.next = 15;
                        return (0, _rclient.getInstance)().zSendMany(process.env.PIRATE_MAIN_ADDRESS, [{
                          address: transaction.to_from,
                          amount: amount.toFixed(8)
                        }], 1, 0.0001);

                      case 15:
                        preResponse = _context4.sent;
                        _context4.next = 18;
                        return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

                      case 18:
                        opStatus = _context4.sent;

                      case 19:
                        if (!(!opStatus || opStatus[0].status === 'executing')) {
                          _context4.next = 27;
                          break;
                        }

                        _context4.next = 22;
                        return new Promise(function (resolve) {
                          return setTimeout(resolve, 1000);
                        });

                      case 22:
                        _context4.next = 24;
                        return (0, _rclient.getInstance)().zGetOperationStatus([preResponse]);

                      case 24:
                        opStatus = _context4.sent;
                        _context4.next = 19;
                        break;

                      case 27:
                        console.log('opStatus');
                        console.log(opStatus);
                        response = opStatus[0].result.txid;
                        _context4.next = 35;
                        break;

                      case 32:
                        _context4.next = 34;
                        return (0, _rclient.getInstance)().sendToAddress(transaction.to_from, amount.toFixed(8).toString());

                      case 34:
                        response = _context4.sent;

                      case 35:
                        console.log(5);
                        _context4.next = 38;
                        return transaction.update({
                          txid: response,
                          phase: 'confirming',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 38:
                        updatedTrans = _context4.sent;
                        _context4.next = 41;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdrawAccepted',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 41:
                        activity = _context4.sent;

                      case 42:
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                          var userDiscordId, myClient, userTelegramId;
                          return _regenerator["default"].wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  if (!transaction) {
                                    _context3.next = 11;
                                    break;
                                  }

                                  if (!transaction.address.wallet.user.user_id.startsWith('discord-')) {
                                    _context3.next = 8;
                                    break;
                                  }

                                  userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
                                  _context3.next = 5;
                                  return discordClient.users.fetch(userDiscordId, false);

                                case 5:
                                  myClient = _context3.sent;
                                  _context3.next = 8;
                                  return myClient.send({
                                    embeds: [(0, _discord.discordWithdrawalAcceptedMessage)(updatedTrans)]
                                  });

                                case 8:
                                  if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                                    userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
                                    bot.telegram.sendMessage(userTelegramId, (0, _telegram.withdrawalAcceptedMessage)(transaction, updatedTrans)); // bot.telegram.sendMessage(runesGroup, withdrawalAcceptedMessage(transaction, updatedTrans));
                                  }

                                  bot.telegram.sendMessage(adminTelegramId, (0, _telegram.withdrawalAcceptedAdminMessage)(updatedTrans));
                                  withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);

                                case 11:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3);
                        })));

                      case 43:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x11) {
                return _ref4.apply(this, arguments);
              };
            }())["catch"](function (err) {
              bot.telegram.sendMessage(adminTelegramId, "Something went wrong");
            });

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function withdrawTelegramAdminAccept(_x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

exports.withdrawTelegramAdminAccept = withdrawTelegramAdminAccept;

var withdrawTelegramAdminDecline = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(bot, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient) {
    var newTransaction, userTelegramId;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(t) {
                var transaction, newUserId, myClient, wallet, updatedWallet, updatedTransaction, activity;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return _models["default"].transaction.findOne({
                          where: {
                            id: withdrawalId,
                            phase: 'review'
                          },
                          include: [{
                            model: _models["default"].address,
                            as: 'address',
                            include: [{
                              model: _models["default"].wallet,
                              as: 'wallet',
                              include: [{
                                model: _models["default"].user,
                                as: 'user'
                              }]
                            }]
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        transaction = _context6.sent;
                        newUserId = transaction.address.wallet.user.user_id.replace('discord-', '');
                        _context6.next = 6;
                        return discordClient.users.fetch(newUserId, false);

                      case 6:
                        myClient = _context6.sent;

                        if (!transaction) {
                          ctx.reply('Transaction not found'); // await myClient.send({ embeds: [transactionNotFoundMessage('Withdraw')] });
                        }

                        if (!transaction) {
                          _context6.next = 28;
                          break;
                        }

                        _context6.next = 11;
                        return _models["default"].wallet.findOne({
                          where: {
                            userId: transaction.address.wallet.userId
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 11:
                        wallet = _context6.sent;

                        if (!wallet) {
                          ctx.reply('Wallet not found');
                        }

                        if (!wallet) {
                          _context6.next = 28;
                          break;
                        }

                        _context6.next = 16;
                        return wallet.update({
                          available: wallet.available + transaction.amount,
                          locked: wallet.locked - transaction.amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 16:
                        updatedWallet = _context6.sent;
                        _context6.next = 19;
                        return transaction.update({
                          phase: 'rejected'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 19:
                        updatedTransaction = _context6.sent;
                        _context6.next = 22;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdrawRejected',
                          transactionId: updatedTransaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 22:
                        activity = _context6.sent;

                        if (!transaction.address.wallet.user.user_id.startsWith('discord-')) {
                          _context6.next = 26;
                          break;
                        }

                        _context6.next = 26;
                        return myClient.send({
                          embeds: [(0, _discord.discordUserWithdrawalRejectMessage)()]
                        });

                      case 26:
                        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                          bot.telegram.sendMessage(runesGroup, "".concat(transaction.address.wallet.user.username, "'s withdrawal has been rejected"));
                        }

                        bot.telegram.sendMessage(adminTelegramId, "Withdrawal Rejected");

                      case 28:
                        t.afterCommit(function () {
                          withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);
                        });

                      case 29:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x18) {
                return _ref7.apply(this, arguments);
              };
            }())["catch"](function (err) {
              bot.telegram.sendMessage(adminTelegramId, "Something went wrong");
            });

          case 2:
            _context7.next = 4;
            return _models["default"].transaction.findOne({
              where: {
                id: withdrawalId,
                phase: 'rejected'
              },
              include: [{
                model: _models["default"].address,
                as: 'address',
                include: [{
                  model: _models["default"].wallet,
                  as: 'wallet',
                  include: [{
                    model: _models["default"].user,
                    as: 'user'
                  }]
                }]
              }]
            });

          case 4:
            newTransaction = _context7.sent;
            console.log(newTransaction.address.wallet.user.user_id);
            userTelegramId = newTransaction.address.wallet.user.user_id.substring(9);
            console.log(userTelegramId);

            if (newTransaction) {
              bot.telegram.sendMessage(userTelegramId, "Your withdrawal has been rejected");
            }

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function withdrawTelegramAdminDecline(_x12, _x13, _x14, _x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}();

exports.withdrawTelegramAdminDecline = withdrawTelegramAdminDecline;

var fetchAdminNodeBalance = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var response;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return (0, _rclient.getInstance)().getWalletInfo();

          case 3:
            response = _context8.sent;
            console.log(response);
            res.locals.balance = response.balance; // console.log(req.body);

            next();
            _context8.next = 14;
            break;

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](0);
            console.log(_context8.t0);
            res.locals.error = _context8.t0;
            next();

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 9]]);
  }));

  return function fetchAdminNodeBalance(_x19, _x20, _x21) {
    return _ref8.apply(this, arguments);
  };
}();

exports.fetchAdminNodeBalance = fetchAdminNodeBalance;