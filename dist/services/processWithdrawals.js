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

var _matrix = require("../messages/matrix");

var _processWithdrawal = require("./processWithdrawal");

var _directMessageRoom = require("../helpers/client/matrix/directMessageRoom");

var _settings = _interopRequireDefault(require("../config/settings"));

var _rclient = require("./rclient");

(0, _dotenv.config)();
var settings = (0, _settings["default"])();

var processWithdrawals = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(telegramClient, discordClient, matrixClient) {
    var transaction, listKomodoUnspent, didWeFindUnspentConsolidationAddress, amountOfPirateCoinsAvailable;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
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
              }]
            });

          case 2:
            transaction = _context4.sent;

            if (transaction) {
              _context4.next = 6;
              break;
            }

            console.log('No withdrawal to process');
            return _context4.abrupt("return");

          case 6:
            if (!(settings.coin.setting === 'Komodo')) {
              _context4.next = 17;
              break;
            }

            _context4.next = 9;
            return (0, _rclient.getInstance)().listUnspent();

          case 9:
            listKomodoUnspent = _context4.sent;
            didWeFindUnspentConsolidationAddress = listKomodoUnspent.find(function (obj) {
              return obj.address === process.env.KOMODO_CONSOLIDATION_ADDRESS;
            }); // console.log('amountOfKomodoCoinsAvailable');
            // console.log(amountOfKomodoCoinsAvailable);

            console.log(didWeFindUnspentConsolidationAddress);
            console.log(didWeFindUnspentConsolidationAddress && didWeFindUnspentConsolidationAddress.amount);
            console.log(transaction.amount / 1e8);

            if (!(!didWeFindUnspentConsolidationAddress || didWeFindUnspentConsolidationAddress.amount < transaction.amount / 1e8 || !didWeFindUnspentConsolidationAddress.spendable)) {
              _context4.next = 17;
              break;
            }

            console.log('not enough komodo coins available at the moment');
            return _context4.abrupt("return");

          case 17:
            if (!(settings.coin.setting === 'Pirate')) {
              _context4.next = 26;
              break;
            }

            _context4.next = 20;
            return (0, _rclient.getInstance)().zGetBalance(process.env.PIRATE_MAIN_ADDRESS);

          case 20:
            amountOfPirateCoinsAvailable = _context4.sent;
            console.log('amountOfPirateCoinsAvailable');
            console.log(amountOfPirateCoinsAvailable);

            if (!(amountOfPirateCoinsAvailable < transaction.amount / 1e8)) {
              _context4.next = 26;
              break;
            }

            console.log('not enough pirate coins available at the moment');
            return _context4.abrupt("return");

          case 26:
            _context4.next = 28;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var updatedTrans, _yield$processWithdra, _yield$processWithdra2, response, responseStatus, activityF, activity, _activityF;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!transaction) {
                          _context2.next = 33;
                          break;
                        }

                        _context2.next = 3;
                        return (0, _processWithdrawal.processWithdrawal)(transaction);

                      case 3:
                        _yield$processWithdra = _context2.sent;
                        _yield$processWithdra2 = (0, _slicedToArray2["default"])(_yield$processWithdra, 2);
                        response = _yield$processWithdra2[0];
                        responseStatus = _yield$processWithdra2[1];
                        console.log(responseStatus);
                        console.log('responseStatus');

                        if (!responseStatus // && responseStatus === 500
                        ) {
                          _context2.next = 17;
                          break;
                        }

                        _context2.next = 12;
                        return transaction.update({
                          // txid: response,
                          phase: 'failed',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 12:
                        updatedTrans = _context2.sent;
                        _context2.next = 15;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdraw_f',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 15:
                        activityF = _context2.sent;
                        return _context2.abrupt("return");

                      case 17:
                        if (!response) {
                          _context2.next = 26;
                          break;
                        }

                        _context2.next = 20;
                        return transaction.update({
                          txid: response,
                          phase: 'confirming',
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
                          type: 'withdrawAccepted',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 23:
                        activity = _context2.sent;
                        _context2.next = 33;
                        break;

                      case 26:
                        _context2.next = 28;
                        return transaction.update({
                          // txid: response,
                          phase: 'failed',
                          type: 'send'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 28:
                        updatedTrans = _context2.sent;
                        _context2.next = 31;
                        return _models["default"].activity.create({
                          spenderId: transaction.address.wallet.userId,
                          type: 'withdraw_f',
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 31:
                        _activityF = _context2.sent;
                        return _context2.abrupt("return");

                      case 33:
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          var userDiscordId, myClient, userTelegramId, userMatrixId, _yield$findUserDirect, _yield$findUserDirect2, directUserMessageRoom, isCurrentRoomDirectMessage, userState;

                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.prev = 0;

                                  if (!transaction) {
                                    _context.next = 39;
                                    break;
                                  }

                                  if (!transaction.address.wallet.user.user_id.startsWith('discord-')) {
                                    _context.next = 9;
                                    break;
                                  }

                                  userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
                                  _context.next = 6;
                                  return discordClient.users.fetch(userDiscordId, false);

                                case 6:
                                  myClient = _context.sent;
                                  _context.next = 9;
                                  return myClient.send({
                                    embeds: [(0, _discord.discordWithdrawalAcceptedMessage)(updatedTrans)]
                                  });

                                case 9:
                                  if (!transaction.address.wallet.user.user_id.startsWith('telegram-')) {
                                    _context.next = 19;
                                    break;
                                  }

                                  userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
                                  _context.t0 = telegramClient.telegram;
                                  _context.t1 = userTelegramId;
                                  _context.next = 15;
                                  return (0, _telegram.withdrawalAcceptedMessage)(transaction, updatedTrans);

                                case 15:
                                  _context.t2 = _context.sent;
                                  _context.t3 = {
                                    parse_mode: 'HTML'
                                  };
                                  _context.next = 19;
                                  return _context.t0.sendMessage.call(_context.t0, _context.t1, _context.t2, _context.t3);

                                case 19:
                                  if (!transaction.address.wallet.user.user_id.startsWith('matrix-')) {
                                    _context.next = 31;
                                    break;
                                  }

                                  userMatrixId = transaction.address.wallet.user.user_id.replace('matrix-', '');
                                  _context.next = 23;
                                  return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, userMatrixId);

                                case 23:
                                  _yield$findUserDirect = _context.sent;
                                  _yield$findUserDirect2 = (0, _slicedToArray2["default"])(_yield$findUserDirect, 3);
                                  directUserMessageRoom = _yield$findUserDirect2[0];
                                  isCurrentRoomDirectMessage = _yield$findUserDirect2[1];
                                  userState = _yield$findUserDirect2[2];

                                  if (!directUserMessageRoom) {
                                    _context.next = 31;
                                    break;
                                  }

                                  _context.next = 31;
                                  return matrixClient.sendEvent(directUserMessageRoom.roomId, "m.room.message", (0, _matrix.matrixWithdrawalAcceptedMessage)(updatedTrans));

                                case 31:
                                  _context.t4 = telegramClient.telegram;
                                  _context.t5 = Number(process.env.TELEGRAM_ADMIN_ID);
                                  _context.next = 35;
                                  return (0, _telegram.withdrawalAcceptedAdminMessage)(updatedTrans);

                                case 35:
                                  _context.t6 = _context.sent;
                                  _context.t7 = {
                                    parse_mode: 'HTML'
                                  };
                                  _context.next = 39;
                                  return _context.t4.sendMessage.call(_context.t4, _context.t5, _context.t6, _context.t7);

                                case 39:
                                  _context.next = 44;
                                  break;

                                case 41:
                                  _context.prev = 41;
                                  _context.t8 = _context["catch"](0);
                                  console.log(_context.t8);

                                case 44:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee, null, [[0, 41]]);
                        })));

                      case 34:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        console.log(err);
                        _context3.next = 3;
                        return transaction.update({
                          phase: 'failed',
                          type: 'send'
                        });

                      case 3:
                        _context3.prev = 3;
                        _context3.next = 6;
                        return telegramClient.telegram.sendMessage(Number(process.env.TELEGRAM_ADMIN_ID), "Something went wrong with withdrawals", {
                          parse_mode: 'HTML'
                        });

                      case 6:
                        _context3.next = 11;
                        break;

                      case 8:
                        _context3.prev = 8;
                        _context3.t0 = _context3["catch"](3);
                        console.log(_context3.t0);

                      case 11:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[3, 8]]);
              }));

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 28:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function processWithdrawals(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.processWithdrawals = processWithdrawals;