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

var acceptWithdrawal = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var updatedTrans, newTransaction;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var transaction, settings, _yield$processWithdra, _yield$processWithdra2, response, responseStatus, activityF, activity;

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

                        if (transaction) {
                          _context2.next = 5;
                          break;
                        }

                        throw new Error("transaction not found");

                      case 5:
                        _context2.next = 7;
                        return _models["default"].features.findOne({
                          where: {
                            type: 'global',
                            name: 'withdraw'
                          }
                        });

                      case 7:
                        settings = _context2.sent;

                        if (settings) {
                          _context2.next = 10;
                          break;
                        }

                        throw new Error("settings not found");

                      case 10:
                        if (!transaction) {
                          _context2.next = 32;
                          break;
                        }

                        _context2.next = 13;
                        return (0, _processWithdrawal.processWithdrawal)(transaction);

                      case 13:
                        _yield$processWithdra = _context2.sent;
                        _yield$processWithdra2 = (0, _slicedToArray2["default"])(_yield$processWithdra, 2);
                        response = _yield$processWithdra2[0];
                        responseStatus = _yield$processWithdra2[1];

                        if (!(responseStatus === 500)) {
                          _context2.next = 25;
                          break;
                        }

                        _context2.next = 20;
                        return transaction.update({
                          // txid: response,
                          phase: 'failed',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 20:
                        updatedTrans = _context2.sent;
                        _context2.next = 23;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdraw_f',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 23:
                        activityF = _context2.sent;
                        return _context2.abrupt("return");

                      case 25:
                        if (!response) {
                          _context2.next = 32;
                          break;
                        }

                        _context2.next = 28;
                        return transaction.update({
                          txid: response,
                          phase: 'confirming',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 28:
                        res.locals.withdrawal = _context2.sent;
                        _context2.next = 31;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdrawAccepted',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 31:
                        activity = _context2.sent;

                      case 32:
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          var userDiscordId, myClient, userTelegramId, userMatrixId;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  if (!transaction) {
                                    _context.next = 19;
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
                                  if (!transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                                    _context.next = 18;
                                    break;
                                  }

                                  userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
                                  _context.t0 = res.locals.telegramClient.telegram;
                                  _context.t1 = userTelegramId;
                                  _context.next = 14;
                                  return (0, _telegram.withdrawalAcceptedMessage)(transaction, res.locals.withdrawal);

                                case 14:
                                  _context.t2 = _context.sent;
                                  _context.t3 = {
                                    parse_mode: 'HTML'
                                  };
                                  _context.next = 18;
                                  return _context.t0.sendMessage.call(_context.t0, _context.t1, _context.t2, _context.t3);

                                case 18:
                                  if (transaction.address.wallet.user.user_id.startsWith('matrix-')) {
                                    userMatrixId = transaction.address.wallet.user.user_id.replace('matrix-', ''); // TODO: SEND A WITHDRAWAL DECLINED MESSAGE TO USER ON MATRIX
                                    // res.locals.matrixClient has matrixclient attached
                                  }

                                case 19:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 33:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
              return next("Something went wrong");
            });

          case 2:
            _context3.prev = 2;
            _context3.next = 5;
            return _models["default"].transaction.findOne({
              where: {
                id: req.body.id,
                phase: 'confirming'
              },
              include: [{
                model: _models["default"].user,
                as: 'user'
              }, {
                model: _models["default"].address,
                as: 'address'
              }]
            });

          case 5:
            newTransaction = _context3.sent;
            res.locals.result = newTransaction;
            next();
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](2);
            console.log(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 10]]);
  }));

  return function acceptWithdrawal(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.acceptWithdrawal = acceptWithdrawal;

var declineWithdrawal = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var updatedTransaction, newTransaction;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                var transaction, wallet, updatedWallet, activity;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
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
                        transaction = _context5.sent;

                        if (transaction) {
                          _context5.next = 5;
                          break;
                        }

                        throw new Error("transaction not found");

                      case 5:
                        if (!transaction) {
                          _context5.next = 21;
                          break;
                        }

                        _context5.next = 8;
                        return _models["default"].wallet.findOne({
                          where: {
                            userId: transaction.address.wallet.userId
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 8:
                        wallet = _context5.sent;

                        if (wallet) {
                          _context5.next = 11;
                          break;
                        }

                        throw new Error("Wallet not found");

                      case 11:
                        if (!wallet) {
                          _context5.next = 21;
                          break;
                        }

                        _context5.next = 14;
                        return wallet.update({
                          available: wallet.available + transaction.amount,
                          locked: wallet.locked - transaction.amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        updatedWallet = _context5.sent;
                        _context5.next = 17;
                        return transaction.update({
                          phase: 'rejected'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 17:
                        updatedTransaction = _context5.sent;
                        _context5.next = 20;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdrawRejected',
                          transactionId: updatedTransaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 20:
                        activity = _context5.sent;

                      case 21:
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                          var userDiscordId, myClient, userTelegramId, userMatrixId;
                          return _regenerator["default"].wrap(function _callee4$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  _context4.prev = 0;

                                  if (!transaction.address.wallet.user.user_id.startsWith('discord-')) {
                                    _context4.next = 8;
                                    break;
                                  }

                                  userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
                                  _context4.next = 5;
                                  return res.locals.discordClient.users.fetch(userDiscordId, false);

                                case 5:
                                  myClient = _context4.sent;
                                  _context4.next = 8;
                                  return myClient.send({
                                    embeds: [(0, _discord.discordWithdrawalRejectedMessage)(updatedTransaction)]
                                  });

                                case 8:
                                  if (!transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                                    _context4.next = 18;
                                    break;
                                  }

                                  userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
                                  _context4.t0 = res.locals.telegramClient.telegram;
                                  _context4.t1 = userTelegramId;
                                  _context4.next = 14;
                                  return (0, _telegram.telegramWithdrawalRejectedMessage)(updatedTransaction);

                                case 14:
                                  _context4.t2 = _context4.sent;
                                  _context4.t3 = {
                                    parse_mode: 'HTML'
                                  };
                                  _context4.next = 18;
                                  return _context4.t0.sendMessage.call(_context4.t0, _context4.t1, _context4.t2, _context4.t3);

                                case 18:
                                  if (transaction.address.wallet.user.user_id.startsWith('matrix-')) {
                                    userMatrixId = transaction.address.wallet.user.user_id.replace('matrix-', ''); // TODO: SEND A WITHDRAWAL DECLINED MESSAGE TO USER ON MATRIX
                                    // res.locals.matrixClient has matrixclient attached
                                  }

                                  _context4.next = 24;
                                  break;

                                case 21:
                                  _context4.prev = 21;
                                  _context4.t4 = _context4["catch"](0);
                                  console.log(_context4.t4);

                                case 24:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4, null, [[0, 21]]);
                        })));

                      case 22:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x8) {
                return _ref5.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
              return next("Something went wrong");
            });

          case 2:
            _context6.prev = 2;
            _context6.next = 5;
            return _models["default"].transaction.findOne({
              where: {
                id: req.body.id,
                phase: 'rejected'
              },
              include: [{
                model: _models["default"].user,
                as: 'user'
              }, {
                model: _models["default"].address,
                as: 'address'
              }]
            });

          case 5:
            newTransaction = _context6.sent;
            res.locals.result = newTransaction;
            next();
            _context6.next = 13;
            break;

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](2);
            console.log(_context6.t0);

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 10]]);
  }));

  return function declineWithdrawal(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.declineWithdrawal = declineWithdrawal;

var fetchWithdrawals = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var transactionOptions, userOptions, options;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
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
              transactionOptions.userId = (0, _defineProperty2["default"])({}, _sequelize.Op.not, null);
              userOptions.user_id = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.userId, "%"));
            }

            if (req.body.username !== '') {
              transactionOptions.userId = (0, _defineProperty2["default"])({}, _sequelize.Op.not, null);
              userOptions.username = (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.username, "%"));
            }

            console.log(req.body.userId);
            options = {
              where: transactionOptions,
              limit: req.body.limit,
              offset: req.body.offset,
              order: [['id', 'DESC']],
              include: [{
                model: _models["default"].user,
                as: 'user',
                where: userOptions
              }, {
                model: _models["default"].address,
                as: 'address',
                include: [{
                  model: _models["default"].wallet,
                  as: 'wallet'
                }]
              }]
            };
            res.locals.name = 'withdrawal';
            _context7.next = 12;
            return _models["default"].transaction.count(options);

          case 12:
            res.locals.count = _context7.sent;
            _context7.next = 15;
            return _models["default"].transaction.findAll(options);

          case 15:
            res.locals.result = _context7.sent;
            next();

          case 17:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function fetchWithdrawals(_x9, _x10, _x11) {
    return _ref7.apply(this, arguments);
  };
}();

exports.fetchWithdrawals = fetchWithdrawals;