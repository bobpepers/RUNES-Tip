"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startPirateSync = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../models"));

var _rclient = require("./rclient");

var _waterFaucet = require("../helpers/waterFaucet");

var _messageHandlers = require("../helpers/messageHandlers");

var _settings = _interopRequireDefault(require("../config/settings"));

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

(0, _dotenv.config)();
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
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(discordClient, telegramClient, matrixClient) {
    var transactions, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3;

    return _regenerator["default"].wrap(function _callee7$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
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
            transactions = _context10.sent;
            // eslint-disable-next-line no-restricted-syntax
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context10.prev = 5;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var trans, transaction, _loop2, _loop3;

              return _regenerator["default"].wrap(function _loop$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      trans = _step.value;
                      _context9.next = 3;
                      return (0, _rclient.getInstance)().getTransaction(trans.txid);

                    case 3:
                      transaction = _context9.sent;
                      console.log(transaction);

                      if (!(transaction.sent && transaction.sent.length > 0 && trans.type === 'send')) {
                        _context9.next = 34;
                        break;
                      }

                      _iteratorAbruptCompletion2 = false;
                      _didIteratorError2 = false;
                      _context9.prev = 8;
                      _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
                        var detail, isWithdrawalComplete, isDepositComplete, userToMessage, updatedTransaction, updatedWallet;
                        return _regenerator["default"].wrap(function _loop2$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                detail = _step2.value;

                                if (!(detail.address !== process.env.PIRATE_MAIN_ADDRESS)) {
                                  _context5.next = 6;
                                  break;
                                }

                                isWithdrawalComplete = false;
                                isDepositComplete = false;
                                _context5.next = 6;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                                    var processTransaction, wallet, prepareLockedAmount, removeLockedAmount, createActivity, faucetSetting, faucetWatered;
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
                                              _context4.next = 33;
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
                                              _context4.next = 33;
                                              break;
                                            }

                                            prepareLockedAmount = detail.value * 1e8 + Number(processTransaction.feeAmount);
                                            removeLockedAmount = Math.abs(prepareLockedAmount);
                                            _context4.next = 16;
                                            return wallet.update({
                                              locked: wallet.locked - removeLockedAmount
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 16:
                                            updatedWallet = _context4.sent;
                                            _context4.next = 19;
                                            return processTransaction.update({
                                              confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                              phase: 'confirmed'
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 19:
                                            updatedTransaction = _context4.sent;
                                            _context4.next = 22;
                                            return _models["default"].activity.create({
                                              spenderId: updatedWallet.userId,
                                              type: 'withdrawComplete',
                                              amount: detail.value * 1e8,
                                              spender_balance: updatedWallet.available + updatedWallet.locked,
                                              transactionId: updatedTransaction.id
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 22:
                                            createActivity = _context4.sent;
                                            _context4.next = 25;
                                            return _models["default"].features.findOne({
                                              where: {
                                                type: 'global',
                                                name: 'faucet'
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 25:
                                            faucetSetting = _context4.sent;
                                            _context4.next = 28;
                                            return (0, _waterFaucet.waterFaucet)(t, Number(processTransaction.feeAmount), faucetSetting);

                                          case 28:
                                            faucetWatered = _context4.sent;
                                            _context4.next = 31;
                                            return _models["default"].user.findOne({
                                              where: {
                                                id: updatedWallet.userId
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 31:
                                            userToMessage = _context4.sent;
                                            isWithdrawalComplete = true;

                                          case 33:
                                            t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                                              return _regenerator["default"].wrap(function _callee3$(_context3) {
                                                while (1) {
                                                  switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                      _context3.next = 2;
                                                      return (0, _messageHandlers.isDepositOrWithdrawalCompleteMessageHandler)(isDepositComplete, isWithdrawalComplete, discordClient, telegramClient, matrixClient, userToMessage, trans, detail.value);

                                                    case 2:
                                                    case "end":
                                                      return _context3.stop();
                                                  }
                                                }
                                              }, _callee3);
                                            })));

                                          case 34:
                                          case "end":
                                            return _context4.stop();
                                        }
                                      }
                                    }, _callee4);
                                  }));

                                  return function (_x7) {
                                    return _ref3.apply(this, arguments);
                                  };
                                }());

                              case 6:
                              case "end":
                                return _context5.stop();
                            }
                          }
                        }, _loop2);
                      });
                      _iterator2 = _asyncIterator(transaction.sent);

                    case 11:
                      _context9.next = 13;
                      return _iterator2.next();

                    case 13:
                      if (!(_iteratorAbruptCompletion2 = !(_step2 = _context9.sent).done)) {
                        _context9.next = 18;
                        break;
                      }

                      return _context9.delegateYield(_loop2(), "t0", 15);

                    case 15:
                      _iteratorAbruptCompletion2 = false;
                      _context9.next = 11;
                      break;

                    case 18:
                      _context9.next = 24;
                      break;

                    case 20:
                      _context9.prev = 20;
                      _context9.t1 = _context9["catch"](8);
                      _didIteratorError2 = true;
                      _iteratorError2 = _context9.t1;

                    case 24:
                      _context9.prev = 24;
                      _context9.prev = 25;

                      if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
                        _context9.next = 29;
                        break;
                      }

                      _context9.next = 29;
                      return _iterator2["return"]();

                    case 29:
                      _context9.prev = 29;

                      if (!_didIteratorError2) {
                        _context9.next = 32;
                        break;
                      }

                      throw _iteratorError2;

                    case 32:
                      return _context9.finish(29);

                    case 33:
                      return _context9.finish(24);

                    case 34:
                      if (!(transaction.received && transaction.received.length > 0 && trans.type === 'receive')) {
                        _context9.next = 63;
                        break;
                      }

                      _iteratorAbruptCompletion3 = false;
                      _didIteratorError3 = false;
                      _context9.prev = 37;
                      _loop3 = /*#__PURE__*/_regenerator["default"].mark(function _loop3() {
                        var detail, isWithdrawalComplete, isDepositComplete, userToMessage, updatedTransaction, updatedWallet;
                        return _regenerator["default"].wrap(function _loop3$(_context8) {
                          while (1) {
                            switch (_context8.prev = _context8.next) {
                              case 0:
                                detail = _step3.value;

                                if (!(detail.address !== process.env.PIRATE_MAIN_ADDRESS && detail.address === trans.address.address)) {
                                  _context8.next = 6;
                                  break;
                                }

                                isWithdrawalComplete = false;
                                isDepositComplete = false;
                                _context8.next = 6;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(t) {
                                    var processTransaction, wallet, createActivity;
                                    return _regenerator["default"].wrap(function _callee6$(_context7) {
                                      while (1) {
                                        switch (_context7.prev = _context7.next) {
                                          case 0:
                                            _context7.next = 2;
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
                                            processTransaction = _context7.sent;

                                            if (!processTransaction) {
                                              _context7.next = 26;
                                              break;
                                            }

                                            _context7.next = 6;
                                            return _models["default"].wallet.findOne({
                                              where: {
                                                userId: processTransaction.address.wallet.userId
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 6:
                                            wallet = _context7.sent;

                                            if (!(transaction.confirmations < Number(settings.min.confirmations))) {
                                              _context7.next = 11;
                                              break;
                                            }

                                            _context7.next = 10;
                                            return processTransaction.update({
                                              confirmations: transaction.confirmations
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 10:
                                            updatedTransaction = _context7.sent;

                                          case 11:
                                            if (!(transaction.confirmations >= Number(settings.min.confirmations))) {
                                              _context7.next = 26;
                                              break;
                                            }

                                            console.log('updating balance');
                                            _context7.next = 15;
                                            return wallet.update({
                                              available: wallet.available + detail.value * 1e8
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 15:
                                            updatedWallet = _context7.sent;
                                            _context7.next = 18;
                                            return processTransaction.update({
                                              confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                                              phase: 'confirmed'
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 18:
                                            updatedTransaction = _context7.sent;
                                            _context7.next = 21;
                                            return _models["default"].activity.create({
                                              earnerId: updatedWallet.userId,
                                              type: 'depositComplete',
                                              amount: detail.value * 1e8,
                                              earner_balance: updatedWallet.available + updatedWallet.locked,
                                              transactionId: updatedTransaction.id
                                            }, {
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 21:
                                            createActivity = _context7.sent;
                                            _context7.next = 24;
                                            return _models["default"].user.findOne({
                                              where: {
                                                id: updatedWallet.userId
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 24:
                                            userToMessage = _context7.sent;
                                            isDepositComplete = true;

                                          case 26:
                                            t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                                              return _regenerator["default"].wrap(function _callee5$(_context6) {
                                                while (1) {
                                                  switch (_context6.prev = _context6.next) {
                                                    case 0:
                                                      _context6.next = 2;
                                                      return (0, _messageHandlers.isDepositOrWithdrawalCompleteMessageHandler)(isDepositComplete, isWithdrawalComplete, discordClient, telegramClient, matrixClient, userToMessage, trans, detail.value);

                                                    case 2:
                                                    case "end":
                                                      return _context6.stop();
                                                  }
                                                }
                                              }, _callee5);
                                            })));

                                          case 27:
                                          case "end":
                                            return _context7.stop();
                                        }
                                      }
                                    }, _callee6);
                                  }));

                                  return function (_x8) {
                                    return _ref5.apply(this, arguments);
                                  };
                                }());

                              case 6:
                              case "end":
                                return _context8.stop();
                            }
                          }
                        }, _loop3);
                      });
                      _iterator3 = _asyncIterator(transaction.received);

                    case 40:
                      _context9.next = 42;
                      return _iterator3.next();

                    case 42:
                      if (!(_iteratorAbruptCompletion3 = !(_step3 = _context9.sent).done)) {
                        _context9.next = 47;
                        break;
                      }

                      return _context9.delegateYield(_loop3(), "t2", 44);

                    case 44:
                      _iteratorAbruptCompletion3 = false;
                      _context9.next = 40;
                      break;

                    case 47:
                      _context9.next = 53;
                      break;

                    case 49:
                      _context9.prev = 49;
                      _context9.t3 = _context9["catch"](37);
                      _didIteratorError3 = true;
                      _iteratorError3 = _context9.t3;

                    case 53:
                      _context9.prev = 53;
                      _context9.prev = 54;

                      if (!(_iteratorAbruptCompletion3 && _iterator3["return"] != null)) {
                        _context9.next = 58;
                        break;
                      }

                      _context9.next = 58;
                      return _iterator3["return"]();

                    case 58:
                      _context9.prev = 58;

                      if (!_didIteratorError3) {
                        _context9.next = 61;
                        break;
                      }

                      throw _iteratorError3;

                    case 61:
                      return _context9.finish(58);

                    case 62:
                      return _context9.finish(53);

                    case 63:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _loop, null, [[8, 20, 24, 34], [25,, 29, 33], [37, 49, 53, 63], [54,, 58, 62]]);
            });
            _iterator = _asyncIterator(transactions);

          case 8:
            _context10.next = 10;
            return _iterator.next();

          case 10:
            if (!(_iteratorAbruptCompletion = !(_step = _context10.sent).done)) {
              _context10.next = 15;
              break;
            }

            return _context10.delegateYield(_loop(), "t0", 12);

          case 12:
            _iteratorAbruptCompletion = false;
            _context10.next = 8;
            break;

          case 15:
            _context10.next = 21;
            break;

          case 17:
            _context10.prev = 17;
            _context10.t1 = _context10["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context10.t1;

          case 21:
            _context10.prev = 21;
            _context10.prev = 22;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context10.next = 26;
              break;
            }

            _context10.next = 26;
            return _iterator["return"]();

          case 26:
            _context10.prev = 26;

            if (!_didIteratorError) {
              _context10.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context10.finish(26);

          case 30:
            return _context10.finish(21);

          case 31:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee7, null, [[5, 17, 21, 31], [22,, 26, 30]]);
  }));

  return function syncTransactions(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var insertBlock = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(startBlock) {
    var blockHash, block, dbBlock;
    return _regenerator["default"].wrap(function _callee8$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return (0, _rclient.getInstance)().getBlockHash(startBlock);

          case 3:
            blockHash = _context11.sent;

            if (!blockHash) {
              _context11.next = 16;
              break;
            }

            block = (0, _rclient.getInstance)().getBlock(blockHash, 2);

            if (!block) {
              _context11.next = 16;
              break;
            }

            _context11.next = 9;
            return _models["default"].block.findOne({
              where: {
                id: Number(startBlock)
              }
            });

          case 9:
            dbBlock = _context11.sent;

            if (!dbBlock) {
              _context11.next = 13;
              break;
            }

            _context11.next = 13;
            return dbBlock.update({
              id: Number(startBlock),
              blockTime: block.time
            });

          case 13:
            if (dbBlock) {
              _context11.next = 16;
              break;
            }

            _context11.next = 16;
            return _models["default"].block.create({
              id: startBlock,
              blockTime: block.time
            });

          case 16:
            return _context11.abrupt("return", true);

          case 19:
            _context11.prev = 19;
            _context11.t0 = _context11["catch"](0);
            console.log(_context11.t0);
            return _context11.abrupt("return", false);

          case 23:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee8, null, [[0, 19]]);
  }));

  return function insertBlock(_x9) {
    return _ref7.apply(this, arguments);
  };
}();

var startPirateSync = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(discordClient, telegramClient, matrixClient, queue) {
    var currentBlockCount, startBlock, blocks, numOfIterations;
    return _regenerator["default"].wrap(function _callee13$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.t0 = Math;
            _context16.next = 3;
            return (0, _rclient.getInstance)().getBlockCount();

          case 3:
            _context16.t1 = _context16.sent;
            currentBlockCount = _context16.t0.max.call(_context16.t0, 0, _context16.t1);
            startBlock = Number(settings.startSyncBlock);
            _context16.next = 8;
            return _models["default"].block.findAll({
              limit: 1,
              order: [['id', 'DESC']]
            });

          case 8:
            blocks = _context16.sent;

            if (blocks.length > 0) {
              startBlock = Math.max(blocks[0].id + 1, startBlock);
            }

            numOfIterations = Math.ceil((currentBlockCount - startBlock + 1) / 1);
            _context16.next = 13;
            return sequentialLoop(numOfIterations, /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(loop) {
                var endBlock;
                return _regenerator["default"].wrap(function _callee11$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        endBlock = Math.min(startBlock + 1 - 1, currentBlockCount);
                        _context14.next = 3;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                          var task;
                          return _regenerator["default"].wrap(function _callee9$(_context12) {
                            while (1) {
                              switch (_context12.prev = _context12.next) {
                                case 0:
                                  _context12.next = 2;
                                  return syncTransactions(discordClient, telegramClient, matrixClient);

                                case 2:
                                  task = _context12.sent;

                                case 3:
                                case "end":
                                  return _context12.stop();
                              }
                            }
                          }, _callee9);
                        })));

                      case 3:
                        _context14.next = 5;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                          var task;
                          return _regenerator["default"].wrap(function _callee10$(_context13) {
                            while (1) {
                              switch (_context13.prev = _context13.next) {
                                case 0:
                                  _context13.next = 2;
                                  return insertBlock(startBlock);

                                case 2:
                                  task = _context13.sent;

                                case 3:
                                case "end":
                                  return _context13.stop();
                              }
                            }
                          }, _callee10);
                        })));

                      case 5:
                        startBlock = endBlock + 1;
                        _context14.next = 8;
                        return loop.next();

                      case 8:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x14) {
                return _ref9.apply(this, arguments);
              };
            }(), /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
              return _regenerator["default"].wrap(function _callee12$(_context15) {
                while (1) {
                  switch (_context15.prev = _context15.next) {
                    case 0:
                      console.log('Synced block'); // setTimeout(startSync, 5000);

                    case 1:
                    case "end":
                      return _context15.stop();
                  }
                }
              }, _callee12);
            })));

          case 13:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee13);
  }));

  return function startPirateSync(_x10, _x11, _x12, _x13) {
    return _ref8.apply(this, arguments);
  };
}();

exports.startPirateSync = startPirateSync;