"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startPirateSync = startPirateSync;

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

function _asyncIterator(iterable) { var method, async, sync, retry = 2; if (typeof Symbol !== "undefined") { async = Symbol.asyncIterator; sync = Symbol.iterator; } while (retry--) { if (async && (method = iterable[async]) != null) { return method.call(iterable); } if (sync && (method = iterable[sync]) != null) { return new AsyncFromSyncIterator(method.call(iterable)); } async = "@@asyncIterator"; sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s; this.n = s.next; }; AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; if (ret === undefined) { return Promise.resolve({ value: value, done: true }); } return AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; if (thr === undefined) return Promise.reject(value); return AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }; function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) { return Promise.reject(new TypeError(r + " is not an object.")); } var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return new AsyncFromSyncIterator(s); }

var queue = new _pQueue["default"]({
  concurrency: 1
}); // const RPC_BATCH_SIZE = 1;

var BLOCK_BATCH_SIZE = 1; // const SYNC_THRESHOLD_SECS = 2400;
// const BLOCK_0_TIMESTAMP = 0;

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
            console.log('transactions');
            console.log(transactions); // eslint-disable-next-line no-restricted-syntax

            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context5.prev = 7;
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
                      _context4.next = 6;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE // eslint-disable-next-line no-loop-func

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
                                  console.log('update transaction');
                                  console.log(transaction);
                                  console.log(transaction.confirmations);

                                  if (!(transaction.confirmations < Number(_settings["default"].min.confirmations))) {
                                    _context3.next = 10;
                                    break;
                                  }

                                  _context3.next = 9;
                                  return trans.update({
                                    confirmations: transaction.confirmations
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 9:
                                  updatedTransaction = _context3.sent;

                                case 10:
                                  if (!(transaction.confirmations >= Number(_settings["default"].min.confirmations))) {
                                    _context3.next = 58;
                                    break;
                                  }

                                  if (!(transaction.sent.length > 0 && trans.type === 'send')) {
                                    _context3.next = 36;
                                    break;
                                  }

                                  console.log(transaction.sent[0].value);
                                  console.log(transaction.sent[0].value * 1e8);
                                  prepareLockedAmount = transaction.sent[0].value * 1e8 - Number(_settings["default"].fee.withdrawal);
                                  removeLockedAmount = Math.abs(prepareLockedAmount);
                                  console.log('removeLockedAmount');
                                  console.log(removeLockedAmount);
                                  _context3.next = 20;
                                  return wallet.update({
                                    locked: wallet.locked - removeLockedAmount
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 20:
                                  updatedWallet = _context3.sent;
                                  _context3.next = 23;
                                  return trans.update({
                                    confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                    phase: 'confirmed'
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 23:
                                  updatedTransaction = _context3.sent;
                                  _context3.next = 26;
                                  return _models["default"].activity.create({
                                    spenderId: updatedWallet.userId,
                                    type: 'withdrawComplete',
                                    amount: transaction.sent[0].value * 1e8,
                                    spender_balance: updatedWallet.available + updatedWallet.locked,
                                    transactionId: updatedTransaction.id
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 26:
                                  createActivity = _context3.sent;
                                  _context3.next = 29;
                                  return _models["default"].faucet.findOne({
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 29:
                                  faucet = _context3.sent;

                                  if (!faucet) {
                                    _context3.next = 33;
                                    break;
                                  }

                                  _context3.next = 33;
                                  return faucet.update({
                                    amount: Number(faucet.amount) + Number(_settings["default"].fee.withdrawal / 2)
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 33:
                                  _context3.next = 35;
                                  return _models["default"].activity.create({
                                    spenderId: updatedWallet.userId,
                                    type: 'faucet_add',
                                    amount: _settings["default"].fee.withdrawal / 2
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 35:
                                  createFaucetActivity = _context3.sent;

                                case 36:
                                  if (!(transaction.received.length > 0 && trans.type === 'receive')) {
                                    _context3.next = 58;
                                    break;
                                  }

                                  console.log('updating balance');
                                  _context3.next = 40;
                                  return wallet.update({
                                    available: wallet.available + transaction.received[0].value * 1e8
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 40:
                                  updatedWallet = _context3.sent;
                                  _context3.next = 43;
                                  return trans.update({
                                    confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                    phase: 'confirmed'
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 43:
                                  updatedTransaction = _context3.sent;
                                  _context3.next = 46;
                                  return _models["default"].activity.create({
                                    earnerId: updatedWallet.userId,
                                    type: 'depositComplete',
                                    amount: transaction.received[0].value * 1e8,
                                    earner_balance: updatedWallet.available + updatedWallet.locked,
                                    transactionId: updatedTransaction.id
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 46:
                                  _createActivity = _context3.sent;
                                  _context3.next = 49;
                                  return _models["default"].user.findOne({
                                    where: {
                                      id: updatedWallet.userId
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 49:
                                  userToMessage = _context3.sent;

                                  if (!userToMessage.user_id.startsWith('discord')) {
                                    _context3.next = 57;
                                    break;
                                  }

                                  userClientId = userToMessage.user_id.replace('discord-', '');
                                  _context3.next = 54;
                                  return discordClient.users.fetch(userClientId, false);

                                case 54:
                                  myClient = _context3.sent;
                                  _context3.next = 57;
                                  return myClient.send({
                                    embeds: [(0, _discord.discordDepositConfirmedMessage)(transaction.received[0].value)]
                                  });

                                case 57:
                                  if (userToMessage.user_id.startsWith('telegram')) {
                                    userClientId = userToMessage.user_id.replace('telegram-', '');
                                    telegramClient.telegram.sendMessage(userClientId, (0, _telegram.telegramDepositConfirmedMessage)(transaction.received[0].value));
                                  }

                                case 58:
                                  t.afterCommit(function () {
                                    console.log('done');
                                  });

                                case 59:
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

                    case 6:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _loop);
            });
            _iterator = _asyncIterator(transactions);

          case 10:
            _context5.next = 12;
            return _iterator.next();

          case 12:
            if (!(_iteratorAbruptCompletion = !(_step = _context5.sent).done)) {
              _context5.next = 17;
              break;
            }

            return _context5.delegateYield(_loop(), "t0", 14);

          case 14:
            _iteratorAbruptCompletion = false;
            _context5.next = 10;
            break;

          case 17:
            _context5.next = 23;
            break;

          case 19:
            _context5.prev = 19;
            _context5.t1 = _context5["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context5.t1;

          case 23:
            _context5.prev = 23;
            _context5.prev = 24;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context5.next = 28;
              break;
            }

            _context5.next = 28;
            return _iterator["return"]();

          case 28:
            _context5.prev = 28;

            if (!_didIteratorError) {
              _context5.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context5.finish(28);

          case 32:
            return _context5.finish(23);

          case 33:
            console.log(transactions.length);
            return _context5.abrupt("return", true);

          case 35:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4, null, [[7, 19, 23, 33], [24,, 28, 32]]);
  }));

  return function syncTransactions(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var getInsertBlockPromises = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(startBlock, endBlock) {
    var blockHash, blockTime, insertBlockPromises, _loop2, i;

    return _regenerator["default"].wrap(function _callee6$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            insertBlockPromises = [];

            _loop2 = function _loop2(i) {
              console.log(i);
              var blockPromise = new Promise(function (resolve) {
                try {
                  (0, _rclient.getInstance)().getBlockHash(i).then(function (blockHash) {
                    (0, _rclient.getInstance)().getBlock(blockHash, 2).then(function (blockInfo) {
                      _models["default"].block.findOne({
                        where: {
                          id: i
                        }
                      }).then( /*#__PURE__*/function () {
                        var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(obj) {
                          return _regenerator["default"].wrap(function _callee5$(_context6) {
                            while (1) {
                              switch (_context6.prev = _context6.next) {
                                case 0:
                                  if (!obj) {
                                    _context6.next = 3;
                                    break;
                                  }

                                  _context6.next = 3;
                                  return obj.update({
                                    id: i,
                                    blockTime: blockInfo.time
                                  });

                                case 3:
                                  if (obj) {
                                    _context6.next = 6;
                                    break;
                                  }

                                  _context6.next = 6;
                                  return _models["default"].block.create({
                                    id: i,
                                    blockTime: blockTime
                                  });

                                case 6:
                                  resolve();

                                case 7:
                                case "end":
                                  return _context6.stop();
                              }
                            }
                          }, _callee5);
                        }));

                        return function (_x9) {
                          return _ref5.apply(this, arguments);
                        };
                      }());
                    })["catch"](function (err) {
                      console.log(err);
                    });
                  })["catch"](function (err) {
                    console.log(err);
                  });
                } catch (err) {
                  console.log(err);
                }
              });
              insertBlockPromises.push(blockPromise);
            };

            for (i = startBlock; i <= endBlock; i += 1) {
              _loop2(i);
            }

            return _context7.abrupt("return", {
              insertBlockPromises: insertBlockPromises
            });

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee6);
  }));

  return function getInsertBlockPromises(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var sync = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(discordClient, telegramClient) {
    var currentBlockCount, currentBlockHash, currentBlockTime, startBlock, blocks, numOfIterations;
    return _regenerator["default"].wrap(function _callee9$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.t0 = Math;
            _context10.next = 3;
            return (0, _rclient.getInstance)().getBlockCount();

          case 3:
            _context10.t1 = _context10.sent;
            currentBlockCount = _context10.t0.max.call(_context10.t0, 0, _context10.t1);
            _context10.next = 7;
            return (0, _rclient.getInstance)().getBlockHash(currentBlockCount);

          case 7:
            currentBlockHash = _context10.sent;
            _context10.next = 10;
            return (0, _rclient.getInstance)().getBlock(currentBlockHash);

          case 10:
            currentBlockTime = _context10.sent.time;
            startBlock = Number(_settings["default"].startSyncBlock); // const blocks = await db.Blocks.cfind({}).sort({ blockNum: -1 }).limit(1).exec();

            _context10.next = 14;
            return _models["default"].block.findAll({
              limit: 1,
              order: [['id', 'DESC']]
            });

          case 14:
            blocks = _context10.sent;

            if (blocks.length > 0) {
              startBlock = Math.max(blocks[0].id + 1, startBlock);
            }

            numOfIterations = Math.ceil((currentBlockCount - startBlock + 1) / BLOCK_BATCH_SIZE);
            _context10.next = 19;
            return sequentialLoop(numOfIterations, /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(loop) {
                var endBlock, _yield$getInsertBlock, insertBlockPromises;

                return _regenerator["default"].wrap(function _callee7$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        endBlock = Math.min(startBlock + BLOCK_BATCH_SIZE - 1, currentBlockCount); // await syncTransactions(startBlock, endBlock);

                        _context8.next = 3;
                        return queue.add(function () {
                          return syncTransactions(discordClient, telegramClient);
                        });

                      case 3:
                        _context8.next = 5;
                        return getInsertBlockPromises(startBlock, endBlock);

                      case 5:
                        _yield$getInsertBlock = _context8.sent;
                        insertBlockPromises = _yield$getInsertBlock.insertBlockPromises;
                        _context8.next = 9;
                        return queue.add(function () {
                          return Promise.all(insertBlockPromises);
                        });

                      case 9:
                        // await Promise.all(insertBlockPromises);
                        console.log('Inserted Blocks');
                        startBlock = endBlock + 1;
                        _context8.next = 13;
                        return loop.next();

                      case 13:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x12) {
                return _ref7.apply(this, arguments);
              };
            }(), /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
              return _regenerator["default"].wrap(function _callee8$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      if (numOfIterations > 0) {// sendSyncInfo(
                        //  currentBlockCount,
                        //  currentBlockTime,
                        //  await calculateSyncPercent(currentBlockCount, currentBlockTime),
                        //  await network.getPeerNodeCount(),
                        //  await getAddressBalances(),
                        // );
                      }

                      console.log('sleep'); // setTimeout(startSync, 5000);

                    case 2:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _callee8);
            })));

          case 19:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee9);
  }));

  return function sync(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

function startPirateSync(_x13, _x14) {
  return _startPirateSync.apply(this, arguments);
}

function _startPirateSync() {
  _startPirateSync = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(discordClient, telegramClient) {
    return _regenerator["default"].wrap(function _callee10$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            sync(discordClient, telegramClient);

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee10);
  }));
  return _startPirateSync.apply(this, arguments);
}