"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startRunebaseSync = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../models"));

var _settings = _interopRequireDefault(require("../config/settings"));

var _rclient = require("./rclient");

var _waterFaucet = require("../helpers/waterFaucet");

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _messageHandlers = require("../helpers/messageHandlers");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

var settings = (0, _settings["default"])();

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

                          index += 1;
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
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(discordClient, telegramClient, matrixClient) {
    var transactions, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2;

    return _regenerator["default"].wrap(function _callee6$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
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
            transactions = _context8.sent;
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context8.prev = 5;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var trans, transaction, _loop2;

              return _regenerator["default"].wrap(function _loop$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      trans = _step.value;
                      _context7.next = 3;
                      return (0, _rclient.getInstance)().getTransaction(trans.txid);

                    case 3:
                      transaction = _context7.sent;
                      _iteratorAbruptCompletion2 = false;
                      _didIteratorError2 = false;
                      _context7.prev = 6;
                      _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
                        var detail, isWithdrawalComplete, isDepositComplete, userToMessage, updatedTransaction, updatedWallet;
                        return _regenerator["default"].wrap(function _loop2$(_context6) {
                          while (1) {
                            switch (_context6.prev = _context6.next) {
                              case 0:
                                detail = _step2.value;
                                isWithdrawalComplete = false;
                                isDepositComplete = false;
                                userToMessage = void 0;
                                updatedTransaction = void 0;
                                updatedWallet = void 0;
                                _context6.next = 8;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                                    var processTransaction, wallet, prepareLockedAmount, removeLockedAmount, createActivity, faucetSetting, faucetWatered, _createActivity;

                                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                                      while (1) {
                                        switch (_context4.prev = _context4.next) {
                                          case 0:
                                            _context4.next = 2;
                                            return _models["default"].transaction.findOne({
                                              where: {
                                                phase: 'confirming',
                                                id: trans.id
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
                                            processTransaction = _context4.sent;

                                            if (!processTransaction) {
                                              _context4.next = 48;
                                              break;
                                            }

                                            _context4.next = 6;
                                            return _models["default"].wallet.findOne({
                                              where: {
                                                userId: processTransaction.address.wallet.userId
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 6:
                                            wallet = _context4.sent;

                                            if (!(transaction.confirmations < Number(settings.min.confirmations))) {
                                              _context4.next = 11;
                                              break;
                                            }

                                            _context4.next = 10;
                                            return processTransaction.update({
                                              confirmations: transaction.confirmations
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 10:
                                            updatedTransaction = _context4.sent;

                                          case 11:
                                            if (!(transaction.confirmations >= Number(settings.min.confirmations))) {
                                              _context4.next = 48;
                                              break;
                                            }

                                            if (!(detail.category === 'send' && processTransaction.type === 'send')) {
                                              _context4.next = 34;
                                              break;
                                            }

                                            prepareLockedAmount = detail.amount * 1e8 - Number(processTransaction.feeAmount);
                                            removeLockedAmount = Math.abs(prepareLockedAmount);
                                            _context4.next = 17;
                                            return wallet.update({
                                              locked: wallet.locked - removeLockedAmount
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 17:
                                            updatedWallet = _context4.sent;
                                            _context4.next = 20;
                                            return processTransaction.update({
                                              confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                              phase: 'confirmed'
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 20:
                                            updatedTransaction = _context4.sent;
                                            _context4.next = 23;
                                            return _models["default"].activity.create({
                                              spenderId: updatedWallet.userId,
                                              type: 'withdrawComplete',
                                              amount: detail.amount * 1e8,
                                              spender_balance: updatedWallet.available + updatedWallet.locked,
                                              transactionId: updatedTransaction.id
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 23:
                                            createActivity = _context4.sent;
                                            _context4.next = 26;
                                            return _models["default"].features.findOne({
                                              where: {
                                                type: 'global',
                                                name: 'faucet'
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 26:
                                            faucetSetting = _context4.sent;
                                            _context4.next = 29;
                                            return (0, _waterFaucet.waterFaucet)(t, Number(processTransaction.feeAmount), faucetSetting);

                                          case 29:
                                            faucetWatered = _context4.sent;
                                            _context4.next = 32;
                                            return _models["default"].user.findOne({
                                              where: {
                                                id: updatedWallet.userId
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 32:
                                            userToMessage = _context4.sent;
                                            isWithdrawalComplete = true;

                                          case 34:
                                            if (!(detail.category === 'receive' && processTransaction.type === 'receive' && detail.address === processTransaction.address.address)) {
                                              _context4.next = 48;
                                              break;
                                            }

                                            _context4.next = 37;
                                            return wallet.update({
                                              available: wallet.available + detail.amount * 1e8
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 37:
                                            updatedWallet = _context4.sent;
                                            _context4.next = 40;
                                            return trans.update({
                                              confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                              phase: 'confirmed'
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 40:
                                            updatedTransaction = _context4.sent;
                                            _context4.next = 43;
                                            return _models["default"].activity.create({
                                              earnerId: updatedWallet.userId,
                                              type: 'depositComplete',
                                              amount: detail.amount * 1e8,
                                              earner_balance: updatedWallet.available + updatedWallet.locked,
                                              transactionId: updatedTransaction.id
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 43:
                                            _createActivity = _context4.sent;
                                            _context4.next = 46;
                                            return _models["default"].user.findOne({
                                              where: {
                                                id: updatedWallet.userId
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 46:
                                            userToMessage = _context4.sent;
                                            isDepositComplete = true;

                                          case 48:
                                            t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                                              return _regenerator["default"].wrap(function _callee3$(_context3) {
                                                while (1) {
                                                  switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                      _context3.next = 2;
                                                      return (0, _messageHandlers.isDepositOrWithdrawalCompleteMessageHandler)(isDepositComplete, isWithdrawalComplete, discordClient, telegramClient, matrixClient, userToMessage, trans, detail.amount);

                                                    case 2:
                                                    case "end":
                                                      return _context3.stop();
                                                  }
                                                }
                                              }, _callee3);
                                            })));

                                          case 49:
                                          case "end":
                                            return _context4.stop();
                                        }
                                      }
                                    }, _callee4);
                                  }));

                                  return function (_x7) {
                                    return _ref3.apply(this, arguments);
                                  };
                                }())["catch"]( /*#__PURE__*/function () {
                                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err) {
                                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                                      while (1) {
                                        switch (_context5.prev = _context5.next) {
                                          case 0:
                                            _context5.prev = 0;
                                            _context5.next = 3;
                                            return _models["default"].error.create({
                                              type: 'sync',
                                              error: "".concat(err)
                                            });

                                          case 3:
                                            _context5.next = 8;
                                            break;

                                          case 5:
                                            _context5.prev = 5;
                                            _context5.t0 = _context5["catch"](0);

                                            _logger["default"].error("Error sync: ".concat(_context5.t0));

                                          case 8:
                                            console.log(err);

                                            _logger["default"].error("Error sync: ".concat(err));

                                          case 10:
                                          case "end":
                                            return _context5.stop();
                                        }
                                      }
                                    }, _callee5, null, [[0, 5]]);
                                  }));

                                  return function (_x8) {
                                    return _ref5.apply(this, arguments);
                                  };
                                }());

                              case 8:
                              case "end":
                                return _context6.stop();
                            }
                          }
                        }, _loop2);
                      });
                      _iterator2 = _asyncIterator(transaction.details);

                    case 9:
                      _context7.next = 11;
                      return _iterator2.next();

                    case 11:
                      if (!(_iteratorAbruptCompletion2 = !(_step2 = _context7.sent).done)) {
                        _context7.next = 16;
                        break;
                      }

                      return _context7.delegateYield(_loop2(), "t0", 13);

                    case 13:
                      _iteratorAbruptCompletion2 = false;
                      _context7.next = 9;
                      break;

                    case 16:
                      _context7.next = 22;
                      break;

                    case 18:
                      _context7.prev = 18;
                      _context7.t1 = _context7["catch"](6);
                      _didIteratorError2 = true;
                      _iteratorError2 = _context7.t1;

                    case 22:
                      _context7.prev = 22;
                      _context7.prev = 23;

                      if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
                        _context7.next = 27;
                        break;
                      }

                      _context7.next = 27;
                      return _iterator2["return"]();

                    case 27:
                      _context7.prev = 27;

                      if (!_didIteratorError2) {
                        _context7.next = 30;
                        break;
                      }

                      throw _iteratorError2;

                    case 30:
                      return _context7.finish(27);

                    case 31:
                      return _context7.finish(22);

                    case 32:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _loop, null, [[6, 18, 22, 32], [23,, 27, 31]]);
            });
            _iterator = _asyncIterator(transactions);

          case 8:
            _context8.next = 10;
            return _iterator.next();

          case 10:
            if (!(_iteratorAbruptCompletion = !(_step = _context8.sent).done)) {
              _context8.next = 15;
              break;
            }

            return _context8.delegateYield(_loop(), "t0", 12);

          case 12:
            _iteratorAbruptCompletion = false;
            _context8.next = 8;
            break;

          case 15:
            _context8.next = 21;
            break;

          case 17:
            _context8.prev = 17;
            _context8.t1 = _context8["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context8.t1;

          case 21:
            _context8.prev = 21;
            _context8.prev = 22;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context8.next = 26;
              break;
            }

            _context8.next = 26;
            return _iterator["return"]();

          case 26:
            _context8.prev = 26;

            if (!_didIteratorError) {
              _context8.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context8.finish(26);

          case 30:
            return _context8.finish(21);

          case 31:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee6, null, [[5, 17, 21, 31], [22,, 26, 30]]);
  }));

  return function syncTransactions(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var insertBlock = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(startBlock) {
    var blockHash, block, dbBlock;
    return _regenerator["default"].wrap(function _callee7$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return (0, _rclient.getInstance)().getBlockHash(startBlock);

          case 3:
            blockHash = _context9.sent;

            if (!blockHash) {
              _context9.next = 16;
              break;
            }

            block = (0, _rclient.getInstance)().getBlock(blockHash, 2);

            if (!block) {
              _context9.next = 16;
              break;
            }

            _context9.next = 9;
            return _models["default"].block.findOne({
              where: {
                id: Number(startBlock)
              }
            });

          case 9:
            dbBlock = _context9.sent;

            if (!dbBlock) {
              _context9.next = 13;
              break;
            }

            _context9.next = 13;
            return dbBlock.update({
              id: Number(startBlock),
              blockTime: block.time
            });

          case 13:
            if (dbBlock) {
              _context9.next = 16;
              break;
            }

            _context9.next = 16;
            return _models["default"].block.create({
              id: startBlock,
              blockTime: block.time
            });

          case 16:
            return _context9.abrupt("return", true);

          case 19:
            _context9.prev = 19;
            _context9.t0 = _context9["catch"](0);
            console.log(_context9.t0);
            return _context9.abrupt("return", false);

          case 23:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee7, null, [[0, 19]]);
  }));

  return function insertBlock(_x9) {
    return _ref6.apply(this, arguments);
  };
}();

var startRunebaseSync = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(discordClient, telegramClient, matrixClient, queue) {
    var currentBlockCount, startBlock, blocks, numOfIterations;
    return _regenerator["default"].wrap(function _callee12$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.t0 = Math;
            _context14.next = 3;
            return (0, _rclient.getInstance)().getBlockCount();

          case 3:
            _context14.t1 = _context14.sent;
            currentBlockCount = _context14.t0.max.call(_context14.t0, 0, _context14.t1);
            startBlock = Number(settings.startSyncBlock);
            _context14.next = 8;
            return _models["default"].block.findAll({
              limit: 1,
              order: [['id', 'DESC']]
            });

          case 8:
            blocks = _context14.sent;

            if (blocks.length > 0) {
              startBlock = Math.max(blocks[0].id + 1, startBlock);
            }

            numOfIterations = Math.ceil((currentBlockCount - startBlock + 1) / 1);
            _context14.next = 13;
            return sequentialLoop(numOfIterations, /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(loop) {
                var endBlock;
                return _regenerator["default"].wrap(function _callee10$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        endBlock = Math.min(startBlock + 1 - 1, currentBlockCount);
                        _context12.next = 3;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                          var task;
                          return _regenerator["default"].wrap(function _callee8$(_context10) {
                            while (1) {
                              switch (_context10.prev = _context10.next) {
                                case 0:
                                  _context10.next = 2;
                                  return syncTransactions(discordClient, telegramClient, matrixClient);

                                case 2:
                                  task = _context10.sent;

                                case 3:
                                case "end":
                                  return _context10.stop();
                              }
                            }
                          }, _callee8);
                        })));

                      case 3:
                        _context12.next = 5;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                          var task;
                          return _regenerator["default"].wrap(function _callee9$(_context11) {
                            while (1) {
                              switch (_context11.prev = _context11.next) {
                                case 0:
                                  _context11.next = 2;
                                  return insertBlock(startBlock);

                                case 2:
                                  task = _context11.sent;

                                case 3:
                                case "end":
                                  return _context11.stop();
                              }
                            }
                          }, _callee9);
                        })));

                      case 5:
                        startBlock = endBlock + 1;
                        _context12.next = 8;
                        return loop.next();

                      case 8:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x14) {
                return _ref8.apply(this, arguments);
              };
            }(), /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
              return _regenerator["default"].wrap(function _callee11$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      console.log('Synced block');

                    case 1:
                    case "end":
                      return _context13.stop();
                  }
                }
              }, _callee11);
            })));

          case 13:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee12);
  }));

  return function startRunebaseSync(_x10, _x11, _x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();

exports.startRunebaseSync = startRunebaseSync;