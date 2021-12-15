"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWithdrawals = exports.declineWithdrawal = exports.acceptWithdrawal = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _telegram = require("../../messages/telegram");

var _processWithdrawal = require("../../services/processWithdrawal");

// import { parseDomain } from "parse-domain";
var acceptWithdrawal = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var updatedTrans, transaction, settings, _yield$processWithdra, _yield$processWithdra2, response, responseStatus, activityF, activity;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _models["default"].transaction.findOne({
                          where: {
                            id: req.body.id,
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
                        transaction = _context2.sent;

                        if (!transaction) {
                          res.locals.error = "Transaction not found";
                          next();
                        }

                        _context2.next = 6;
                        return _models["default"].features.findOne({
                          where: {
                            type: 'global',
                            name: 'withdraw'
                          }
                        });

                      case 6:
                        settings = _context2.sent;

                        if (!settings) {
                          res.locals.error = "settings not found";
                          next();
                        }

                        if (!transaction) {
                          _context2.next = 30;
                          break;
                        }

                        _context2.next = 11;
                        return (0, _processWithdrawal.processWithdrawal)(transaction);

                      case 11:
                        _yield$processWithdra = _context2.sent;
                        _yield$processWithdra2 = (0, _slicedToArray2["default"])(_yield$processWithdra, 2);
                        response = _yield$processWithdra2[0];
                        responseStatus = _yield$processWithdra2[1];

                        if (!(responseStatus === 500)) {
                          _context2.next = 23;
                          break;
                        }

                        _context2.next = 18;
                        return transaction.update({
                          // txid: response,
                          phase: 'failed',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        updatedTrans = _context2.sent;
                        _context2.next = 21;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdraw_f',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 21:
                        activityF = _context2.sent;
                        return _context2.abrupt("return");

                      case 23:
                        if (!response) {
                          _context2.next = 30;
                          break;
                        }

                        _context2.next = 26;
                        return transaction.update({
                          txid: response,
                          phase: 'confirming',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 26:
                        res.locals.withdrawal = _context2.sent;
                        _context2.next = 29;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdrawAccepted',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 29:
                        activity = _context2.sent;

                      case 30:
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          var userDiscordId, myClient, userTelegramId;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  if (!transaction) {
                                    _context.next = 9;
                                    break;
                                  }

                                  if (!transaction.address.wallet.user.user_id.startsWith('discord-')) {
                                    _context.next = 8;
                                    break;
                                  }

                                  userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
                                  _context.next = 5;
                                  return res.locals.discordClient.users.fetch(userDiscordId, false);

                                case 5:
                                  myClient = _context.sent;
                                  _context.next = 8;
                                  return myClient.send({
                                    embeds: [(0, _discord.discordWithdrawalAcceptedMessage)(res.locals.withdrawal)]
                                  });

                                case 8:
                                  if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                                    userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
                                    res.locals.telegramClient.telegram.sendMessage(userTelegramId, (0, _telegram.withdrawalAcceptedMessage)(transaction, res.locals.withdrawal)); // bot.telegram.sendMessage(runesGroup, withdrawalAcceptedMessage(transaction, updatedTrans));
                                  } // res.locals.telegramClient.telegram.sendMessage(adminTelegramId, withdrawalAcceptedAdminMessage(updatedTrans));


                                case 9:
                                  next();

                                case 10:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 31:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {// res.locals.telegramClient.telegram.sendMessage(adminTelegramId, `Something went wrong`);
            });

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function acceptWithdrawal(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.acceptWithdrawal = acceptWithdrawal;

var declineWithdrawal = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var newTransaction;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                var transaction, wallet, updatedWallet, updatedTransaction, activity, userDiscordId, myClient, userTelegramId;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _models["default"].transaction.findOne({
                          where: {
                            id: req.body.id,
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
                          res.locals.error = "transaction not found";
                        }

                        console.log("123");

                        if (!transaction) {
                          _context4.next = 29;
                          break;
                        }

                        _context4.next = 8;
                        return _models["default"].wallet.findOne({
                          where: {
                            userId: transaction.address.wallet.userId
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 8:
                        wallet = _context4.sent;

                        if (!wallet) {
                          res.locals.error = "Wallet not found";
                        }

                        if (!wallet) {
                          _context4.next = 29;
                          break;
                        }

                        _context4.next = 13;
                        return wallet.update({
                          available: wallet.available + transaction.amount,
                          locked: wallet.locked - transaction.amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 13:
                        updatedWallet = _context4.sent;
                        _context4.next = 16;
                        return transaction.update({
                          phase: 'rejected'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 16:
                        updatedTransaction = _context4.sent;
                        console.log('beforeActivity');
                        _context4.next = 20;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdrawRejected',
                          transactionId: updatedTransaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 20:
                        activity = _context4.sent;

                        if (!transaction.address.wallet.user.user_id.startsWith('discord-')) {
                          _context4.next = 28;
                          break;
                        }

                        // await myClient.send({ embeds: [discordUserWithdrawalRejectMessage()] });
                        userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
                        _context4.next = 25;
                        return res.locals.discordClient.users.fetch(userDiscordId, false);

                      case 25:
                        myClient = _context4.sent;
                        _context4.next = 28;
                        return myClient.send({
                          embeds: [(0, _discord.discordWithdrawalRejectedMessage)(updatedTransaction)]
                        });

                      case 28:
                        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                          userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
                          res.locals.telegramClient.telegram.sendMessage(userTelegramId, (0, _telegram.telegramWithdrawalRejectedMessage)(updatedTransaction)); // bot.telegram.sendMessage(runesGroup, `${transaction.address.wallet.user.username}'s withdrawal has been rejected`);
                        } // bot.telegram.sendMessage(adminTelegramId, `Withdrawal Rejected`);


                      case 29:
                        t.afterCommit(function () {
                          console.log("done");
                        });

                      case 30:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x8) {
                return _ref5.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
              res.locals.error = "Something went wrong";
              next();
            });

          case 2:
            _context5.next = 4;
            return _models["default"].transaction.findOne({
              where: {
                id: req.body.id,
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
            newTransaction = _context5.sent;
            res.locals.withdrawal = newTransaction;
            next();

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function declineWithdrawal(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.declineWithdrawal = declineWithdrawal;

var fetchWithdrawals = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var transactionOptions, userOptions, options;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log(req.body);
            transactionOptions = {
              type: 'send'
            };
            userOptions = {};

            if (req.body.id !== '') {
              transactionOptions.id = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.txId !== '') {
              transactionOptions.txid = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.txId, "%"));
            }

            if (req.body.to !== '') {
              transactionOptions.to_from = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.to, "%"));
            }

            if (req.body.userId !== '') {
              userOptions.userId = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.userId, "%"));
            }

            if (req.body.username !== '') {
              userOptions.username = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.username, "%"));
            }

            options = {
              where: transactionOptions,
              order: [['id', 'DESC']],
              include: [{
                model: _models["default"].address,
                as: 'address',
                include: [{
                  model: _models["default"].wallet,
                  as: 'wallet',
                  include: [{
                    model: _models["default"].user,
                    as: 'user',
                    where: userOptions
                  }]
                }]
              }]
            };
            _context6.next = 11;
            return _models["default"].transaction.findAll(options);

          case 11:
            res.locals.withdrawals = _context6.sent;
            console.log(res.locals.withdrawals);
            next();

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetchWithdrawals(_x9, _x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

exports.fetchWithdrawals = fetchWithdrawals;