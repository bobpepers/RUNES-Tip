"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startKomodoSync = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _pQueue = _interopRequireDefault(require("p-queue"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../models"));

var _telegram = require("../messages/telegram");

var _discord = require("../messages/discord");

var _settings = _interopRequireDefault(require("../config/settings"));

var _rclient = require("./rclient");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

var settings = (0, _settings["default"])();
var queue = new _pQueue["default"]({
  concurrency: 1
});

var sequentialLoop = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(iterations, process, exit) {
    var index, done, shouldExit, loop;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            index = 0;
            done = false;
            shouldExit = false;
            loop = {
              next: function next() {
                return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!done) {
                            _context.next = 3;
                            break;
                          }

                          if (!(shouldExit && exit)) {
                            _context.next = 3;
                            break;
                          }

                          return _context.abrupt("return", exit());

                        case 3:
                          if (!(index < iterations)) {
                            _context.next = 9;
                            break;
                          }

                          index++;
                          _context.next = 7;
                          return process(loop);

                        case 7:
                          _context.next = 11;
                          break;

                        case 9:
                          done = true;

                          if (exit) {
                            exit();
                          }

                        case 11:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }))();
              },
              iteration: function iteration() {
                return index - 1; // Return the loop number we're on
              },
              "break": function _break(end) {
                done = true;
                shouldExit = end;
              }
            };
            _context2.next = 6;
            return loop.next();

          case 6:
            return _context2.abrupt("return", loop);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function sequentialLoop(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var syncTransactions = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(discordClient, telegramClient) {
    var transactions, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

    return _regenerator["default"].wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _models["default"].transaction.findAll({
              where: {
                phase: 'confirming'
              },
              include: [{
                model: _models["default"].address,
                as: 'address',
                include: [{
                  model: _models["default"].wallet,
                  as: 'wallet'
                }]
              }]
            });

          case 2:
            transactions = _context5.sent;
            // console.log('transactions');
            // console.log(transactions);
            // eslint-disable-next-line no-restricted-syntax
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context5.prev = 5;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var trans, transaction;
              return _regenerator["default"].wrap(function _loop$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      trans = _step.value;
                      _context4.next = 3;
                      return (0, _rclient.getInstance)().getTransaction(trans.txid);

                    case 3:
                      transaction = _context4.sent;
                      console.log(transaction); // eslint-disable-next-line no-await-in-loop

                      _context4.next = 7;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                          var wallet, updatedTransaction, updatedWallet, prepareLockedAmount, removeLockedAmount, createActivity, faucet, createFaucetActivity, _createActivity, userToMessage, userClientId, myClient;

                          return _regenerator["default"].wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  _context3.next = 2;
                                  return _models["default"].wallet.findOne({
                                    where: {
                                      userId: trans.address.wallet.userId
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 2:
                                  wallet = _context3.sent;

                                  if (!(transaction.confirmations < Number(settings.min.confirmations))) {
                                    _context3.next = 7;
                                    break;
                                  }

                                  _context3.next = 6;
                                  return trans.update({
                                    confirmations: transaction.confirmations
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 6:
                                  updatedTransaction = _context3.sent;

                                case 7:
                                  if (!(transaction.confirmations >= Number(settings.min.confirmations))) {
                                    _context3.next = 50;
                                    break;
                                  }

                                  if (!(transaction.details[1] && transaction.details[1].category === 'send' && trans.type === 'send')) {
                                    _context3.next = 29;
                                    break;
                                  }

                                  prepareLockedAmount = transaction.details[1].amount * 1e8 - Number(trans.feeAmount);
                                  removeLockedAmount = Math.abs(prepareLockedAmount);
                                  _context3.next = 13;
                                  return wallet.update({
                                    locked: wallet.locked - removeLockedAmount
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 13:
                                  updatedWallet = _context3.sent;
                                  _context3.next = 16;
                                  return trans.update({
                                    confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                    phase: 'confirmed'
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 16:
                                  updatedTransaction = _context3.sent;
                                  _context3.next = 19;
                                  return _models["default"].activity.create({
                                    spenderId: updatedWallet.userId,
                                    type: 'withdrawComplete',
                                    amount: transaction.details[1].amount * 1e8,
                                    spender_balance: updatedWallet.available + updatedWallet.locked,
                                    transactionId: updatedTransaction.id
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 19:
                                  createActivity = _context3.sent;
                                  _context3.next = 22;
                                  return _models["default"].faucet.findOne({
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 22:
                                  faucet = _context3.sent;

                                  if (!faucet) {
                                    _context3.next = 26;
                                    break;
                                  }

                                  _context3.next = 26;
                                  return faucet.update({
                                    amount: Number(faucet.amount) + Number(trans.feeAmount / 2)
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 26:
                                  _context3.next = 28;
                                  return _models["default"].activity.create({
                                    spenderId: updatedWallet.userId,
                                    type: 'faucet_add',
                                    amount: trans.feeAmount / 2
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 28:
                                  createFaucetActivity = _context3.sent;

                                case 29:
                                  if (!(transaction.details[0].category === 'receive' && trans.type === 'receive')) {
                                    _context3.next = 50;
                                    break;
                                  }

                                  _context3.next = 32;
                                  return wallet.update({
                                    available: wallet.available + transaction.details[0].amount * 1e8
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 32:
                                  updatedWallet = _context3.sent;
                                  _context3.next = 35;
                                  return trans.update({
                                    confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                    phase: 'confirmed'
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 35:
                                  updatedTransaction = _context3.sent;
                                  _context3.next = 38;
                                  return _models["default"].activity.create({
                                    earnerId: updatedWallet.userId,
                                    type: 'depositComplete',
                                    amount: transaction.details[0].amount * 1e8,
                                    earner_balance: updatedWallet.available + updatedWallet.locked,
                                    transactionId: updatedTransaction.id
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 38:
                                  _createActivity = _context3.sent;
                                  _context3.next = 41;
                                  return _models["default"].user.findOne({
                                    where: {
                                      id: updatedWallet.userId
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 41:
                                  userToMessage = _context3.sent;

                                  if (!userToMessage.user_id.startsWith('discord')) {
                                    _context3.next = 49;
                                    break;
                                  }

                                  userClientId = userToMessage.user_id.replace('discord-', '');
                                  _context3.next = 46;
                                  return discordClient.users.fetch(userClientId, false);

                                case 46:
                                  myClient = _context3.sent;
                                  _context3.next = 49;
                                  return myClient.send({
                                    embeds: [(0, _discord.discordDepositConfirmedMessage)(transaction.details[0].amount)]
                                  });

                                case 49:
                                  if (userToMessage.user_id.startsWith('telegram')) {
                                    userClientId = userToMessage.user_id.replace('telegram-', '');
                                    telegramClient.telegram.sendMessage(userClientId, (0, _telegram.telegramDepositConfirmedMessage)(transaction.details[0].amount));
                                  }

                                case 50:
                                  t.afterCommit(function () {
                                    console.log('done');
                                  });

                                case 51:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3);
                        }));

                        return function (_x6) {
                          return _ref3.apply(this, arguments);
                        };
                      }());

                    case 7:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _loop);
            });
            _iterator = _asyncIterator(transactions);

          case 8:
            _context5.next = 10;
            return _iterator.next();

          case 10:
            if (!(_iteratorAbruptCompletion = !(_step = _context5.sent).done)) {
              _context5.next = 15;
              break;
            }

            return _context5.delegateYield(_loop(), "t0", 12);

          case 12:
            _iteratorAbruptCompletion = false;
            _context5.next = 8;
            break;

          case 15:
            _context5.next = 21;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t1 = _context5["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context5.t1;

          case 21:
            _context5.prev = 21;
            _context5.prev = 22;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context5.next = 26;
              break;
            }

            _context5.next = 26;
            return _iterator["return"]();

          case 26:
            _context5.prev = 26;

            if (!_didIteratorError) {
              _context5.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context5.finish(26);

          case 30:
            return _context5.finish(21);

          case 31:
            return _context5.abrupt("return", true);

          case 32:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4, null, [[5, 17, 21, 31], [22,, 26, 30]]);
  }));

  return function syncTransactions(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var insertBlock = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(startBlock) {
    var blockHash, block, dbBlock;
    return _regenerator["default"].wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return (0, _rclient.getInstance)().getBlockHash(startBlock);

          case 3:
            blockHash = _context6.sent;

            if (!blockHash) {
              _context6.next = 16;
              break;
            }

            block = (0, _rclient.getInstance)().getBlock(blockHash, 2);

            if (!block) {
              _context6.next = 16;
              break;
            }

            _context6.next = 9;
            return _models["default"].block.findOne({
              where: {
                id: Number(startBlock)
              }
            });

          case 9:
            dbBlock = _context6.sent;

            if (!dbBlock) {
              _context6.next = 13;
              break;
            }

            _context6.next = 13;
            return dbBlock.update({
              id: Number(startBlock),
              blockTime: block.time
            });

          case 13:
            if (dbBlock) {
              _context6.next = 16;
              break;
            }

            _context6.next = 16;
            return _models["default"].block.create({
              id: startBlock,
              blockTime: block.time
            });

          case 16:
            return _context6.abrupt("return", true);

          case 19:
            _context6.prev = 19;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);
            return _context6.abrupt("return", false);

          case 23:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee5, null, [[0, 19]]);
  }));

  return function insertBlock(_x7) {
    return _ref4.apply(this, arguments);
  };
}();

var startKomodoSync = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(discordClient, telegramClient) {
    var currentBlockCount, startBlock, blocks, numOfIterations;
    return _regenerator["default"].wrap(function _callee8$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.t0 = Math;
            _context9.next = 3;
            return (0, _rclient.getInstance)().getBlockCount();

          case 3:
            _context9.t1 = _context9.sent;
            currentBlockCount = _context9.t0.max.call(_context9.t0, 0, _context9.t1);
            startBlock = Number(settings.startSyncBlock);
            _context9.next = 8;
            return _models["default"].block.findAll({
              limit: 1,
              order: [['id', 'DESC']]
            });

          case 8:
            blocks = _context9.sent;

            if (blocks.length > 0) {
              startBlock = Math.max(blocks[0].id + 1, startBlock);
            }

            numOfIterations = Math.ceil((currentBlockCount - startBlock + 1) / 1);
            _context9.next = 13;
            return sequentialLoop(numOfIterations, /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(loop) {
                var endBlock, task;
                return _regenerator["default"].wrap(function _callee6$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        endBlock = Math.min(startBlock + 1 - 1, currentBlockCount); // await syncTransactions(startBlock, endBlock);

                        _context7.next = 3;
                        return queue.add(function () {
                          return syncTransactions(discordClient, telegramClient);
                        });

                      case 3:
                        _context7.next = 5;
                        return insertBlock(startBlock);

                      case 5:
                        task = _context7.sent;
                        _context7.next = 8;
                        return queue.add(function () {
                          return task;
                        });

                      case 8:
                        startBlock = endBlock + 1;
                        console.log('Synced block');
                        _context7.next = 12;
                        return loop.next();

                      case 12:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x10) {
                return _ref6.apply(this, arguments);
              };
            }(), /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
              return _regenerator["default"].wrap(function _callee7$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      console.log('sleep'); // setTimeout(startSync, 5000);

                    case 1:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee7);
            })));

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee8);
  }));

  return function startKomodoSync(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.startKomodoSync = startKomodoSync;