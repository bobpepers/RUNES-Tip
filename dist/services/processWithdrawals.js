"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processWithdrawals = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../models"));

var _discord = require("../messages/discord");

var _telegram = require("../messages/telegram");

var _processWithdrawal = require("./processWithdrawal");

(0, _dotenv.config)();

var processWithdrawals = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(telegramClient, discordClient) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var updatedTrans, transaction, _yield$processWithdra, _yield$processWithdra2, response, responseStatus, activityF, activity;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _models["default"].transaction.findOne({
                          where: {
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
                          _context2.next = 6;
                          break;
                        }

                        console.log('No withdrawal to process');
                        return _context2.abrupt("return");

                      case 6:
                        if (!transaction) {
                          _context2.next = 28;
                          break;
                        }

                        _context2.next = 9;
                        return (0, _processWithdrawal.processWithdrawal)(transaction);

                      case 9:
                        _yield$processWithdra = _context2.sent;
                        _yield$processWithdra2 = (0, _slicedToArray2["default"])(_yield$processWithdra, 2);
                        response = _yield$processWithdra2[0];
                        responseStatus = _yield$processWithdra2[1];

                        if (!(responseStatus && responseStatus === 500)) {
                          _context2.next = 21;
                          break;
                        }

                        _context2.next = 16;
                        return transaction.update({
                          // txid: response,
                          phase: 'failed',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 16:
                        updatedTrans = _context2.sent;
                        _context2.next = 19;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdraw_f',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 19:
                        activityF = _context2.sent;
                        return _context2.abrupt("return");

                      case 21:
                        if (!response) {
                          _context2.next = 28;
                          break;
                        }

                        _context2.next = 24;
                        return transaction.update({
                          txid: response,
                          phase: 'confirming',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 24:
                        updatedTrans = _context2.sent;
                        _context2.next = 27;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdrawAccepted',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 27:
                        activity = _context2.sent;

                      case 28:
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          var userDiscordId, myClient, userTelegramId;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  if (!transaction) {
                                    _context.next = 10;
                                    break;
                                  }

                                  if (!transaction.address.wallet.user.user_id.startsWith('discord-')) {
                                    _context.next = 8;
                                    break;
                                  }

                                  userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
                                  _context.next = 5;
                                  return discordClient.users.fetch(userDiscordId, false);

                                case 5:
                                  myClient = _context.sent;
                                  _context.next = 8;
                                  return myClient.send({
                                    embeds: [(0, _discord.discordWithdrawalAcceptedMessage)(updatedTrans)]
                                  });

                                case 8:
                                  if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                                    userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
                                    telegramClient.telegram.sendMessage(userTelegramId, (0, _telegram.withdrawalAcceptedMessage)(transaction, updatedTrans));
                                  }

                                  telegramClient.telegram.sendMessage(Number(process.env.TELEGRAM_ADMIN_ID), (0, _telegram.withdrawalAcceptedAdminMessage)(updatedTrans));

                                case 10:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 29:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
              telegramClient.telegram.sendMessage(Number(process.env.TELEGRAM_ADMIN_ID), "Something went wrong");
            });

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function processWithdrawals(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawals = processWithdrawals;