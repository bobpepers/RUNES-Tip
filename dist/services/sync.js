'use strict';

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash'); /* eslint no-underscore-dangle: [2, { "allow": ["_eventName", "_address", "_time", "_orderId"] }] */

var moment = require('moment');
// const BigNumber = require('bignumber.js');
// const { forEach } = require('p-iteration');
// const abi = require('ethjs-abi');
// const { sendSyncInfo } = require('../publisher');
// const { getLogger } = require('../utils/logger');
// const { Utils } = require('rweb3');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('./rclientConfig'),
    isMainnet = _require2.isMainnet;
// const { BLOCK_0_TIMESTAMP, SATOSHI_CONVERSION, fill } = require('../constants');
// const { db, DBHelper } = require('../db');
// const MarketMaker = require('../models/marketMaker');
// const network = require('../api/network');

var _require3 = require('./rclient'),
    getInstance = _require3.getInstance;

var RPC_BATCH_SIZE = 5;
var BLOCK_BATCH_SIZE = 5;
var SYNC_THRESHOLD_SECS = 2400;
var BLOCK_0_TIMESTAMP = 0;

// hardcode sender address as it doesnt matter
// let MetaData;
var senderAddress = void 0;

var sequentialLoop = function sequentialLoop(iterations, process, exit) {
  var index = 0;
  var done = false;
  var shouldExit = false;

  var loop = {
    next: function next() {
      if (done) {
        if (shouldExit && exit) {
          return exit();
        }
      }

      if (index < iterations) {
        index++;
        process(loop);
      } else {
        done = true;

        if (exit) {
          exit();
        }
      }
    },
    iteration: function iteration() {
      return index - 1; // Return the loop number we're on
    },
    break: function _break(end) {
      done = true;
      shouldExit = end;
    }
  };
  loop.next();
  return loop;
};

var syncTransactions = async function syncTransactions(startBlock, endBlock, io, onlineUsers) {
  var transactions = await _models2.default.transaction.findAll({
    where: {
      phase: 'confirming'
    },
    include: [{
      model: _models2.default.address,
      as: 'address',
      include: [{
        model: _models2.default.wallet,
        as: 'wallet'
      }]
    }]
  });
  transactions.forEach(async function (trans) {
    _models2.default.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, async function (t) {
      var wallet = await _models2.default.wallet.findOne({
        where: {
          userId: trans.address.wallet.userId
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      var transaction = await getInstance().getTransaction(trans.txid);
      var updatedTransaction = void 0;
      var updatedWallet = void 0;
      if (transaction.confirmations < 10) {
        updatedTransaction = await trans.update({
          confirmations: transaction.confirmations
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE
        });
      }
      if (transaction.confirmations >= 10) {
        if (transaction.details[0].category === 'send') {
          console.log(transaction.amount);
          console.log(transaction.amount * 1e8 / 0.95);
          var removeLockedAmount = Math.abs(transaction.amount * 1e8 / 0.95);
          console.log('removeLockedAmount');
          console.log(removeLockedAmount);
          updatedWallet = await wallet.update({
            locked: wallet.locked - removeLockedAmount
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE
          });
        }
        if (transaction.details[0].category === 'receive') {
          updatedWallet = await wallet.update({
            available: wallet.available + transaction.amount * 1e8
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE
          });
        }

        updatedTransaction = await trans.update({
          confirmations: transaction.confirmations,
          phase: 'confirmed'
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE
        });

        if (transaction.details[0].category === 'receive') {
          var createActivity = await _models2.default.activity.create({
            earnerId: updatedWallet.userId,
            type: 'depositComplete',
            amount: transaction.details[0].amount * 1e8,
            earner_balance: updatedWallet.available + updatedWallet.locked,
            txId: updatedTransaction.id
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE
          });

          var activity = await _models2.default.activity.findOne({
            where: {
              id: createActivity.id
            },
            attributes: ['createdAt', 'type', 'amount'],
            include: [{
              model: _models2.default.user,
              as: 'earner',
              required: false,
              attributes: ['username']
            }, {
              model: _models2.default.transaction,
              as: 'txActivity',
              required: false,
              attributes: ['txid']
            }],
            transaction: t,
            lock: t.LOCK.UPDATE
          });
          io.emit('Activity', activity);
        }
        if (transaction.details[0].category === 'send') {
          var _createActivity = await _models2.default.activity.create({
            spenderId: updatedWallet.userId,
            type: 'withdrawComplete',
            amount: transaction.details[0].amount * 1e8,
            spender_balance: updatedWallet.available + updatedWallet.locked,
            txId: updatedTransaction.id
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE
          });

          var _activity = await _models2.default.activity.findOne({
            where: {
              id: _createActivity.id
            },
            attributes: ['createdAt', 'type', 'amount'],
            include: [{
              model: _models2.default.user,
              as: 'spender',
              required: false,
              attributes: ['username']
            }, {
              model: _models2.default.transaction,
              as: 'txActivity',
              required: false,
              attributes: ['txid']
            }],
            transaction: t,
            lock: t.LOCK.UPDATE
          });
          console.log(_activity);
          console.log('io.emit activity sync');
          io.emit('Activity', _activity);
        }
      }
      t.afterCommit(function () {
        if (onlineUsers[trans.address.wallet.userId.toString()]) {
          onlineUsers[trans.address.wallet.userId.toString()].emit('updateTransaction', { transaction: updatedTransaction });
          if (updatedWallet) {
            onlineUsers[trans.address.wallet.userId.toString()].emit('updateWallet', { wallet: updatedWallet });
          }
        }
      });
    });
  });
  console.log(transactions.length);
};

var getInsertBlockPromises = async function getInsertBlockPromises(startBlock, endBlock) {
  var blockHash = void 0;
  var blockTime = void 0;
  var insertBlockPromises = [];

  var _loop = function _loop(i) {
    console.log(i);
    var blockPromise = new Promise(function (resolve) {
      try {
        getInstance().getBlockHash(i).then(function (blockHash) {
          getInstance().getBlock(blockHash, 2).then(function (blockInfo) {
            _models2.default.block.findOne({
              where: {
                id: i
              }
            }).then(async function (obj) {
              if (obj) {
                await obj.update({
                  id: i,
                  blockTime: blockInfo.time
                });
              }
              if (!obj) {
                await _models2.default.block.create({
                  id: i,
                  blockTime: blockTime
                });
              }
              resolve();
            });
          }).catch(function (err) {
            console.log(err);
          });
        }).catch(function (err) {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
    });

    insertBlockPromises.push(blockPromise);
  };

  for (var i = startBlock; i <= endBlock; i += 1) {
    _loop(i);
  }

  return { insertBlockPromises: insertBlockPromises };
};

var peerHighestSyncedHeader = async function peerHighestSyncedHeader() {
  var peerBlockHeader = null;
  try {
    var res = await getInstance().getPeerInfo();
    _.each(res, function (nodeInfo) {
      if (_.isNumber(nodeInfo.synced_headers) && nodeInfo.synced_headers !== -1) {
        peerBlockHeader = Math.max(nodeInfo.synced_headers, peerBlockHeader);
      }
    });
  } catch (err) {
    console.log('Error calling getPeerInfo: ' + err.message);
    return null;
  }

  return peerBlockHeader;
};

var calculateSyncPercent = async function calculateSyncPercent(blockCount, blockTime) {
  var peerBlockHeader = await peerHighestSyncedHeader();
  if (_.isNull(peerBlockHeader)) {
    // estimate by blockTime
    var syncPercent = 100;
    var timestampNow = moment().unix();
    // if blockTime is 20 min behind, we are not fully synced
    if (blockTime < timestampNow - SYNC_THRESHOLD_SECS) {
      syncPercent = Math.floor((blockTime - BLOCK_0_TIMESTAMP) / (timestampNow - BLOCK_0_TIMESTAMP) * 100);
    }
    return syncPercent;
  }

  return Math.floor(blockCount / peerBlockHeader * 100);
};

var sync = async function sync(io, onlineUsers) {
  var currentBlockCount = Math.max(0, (await getInstance().getBlockCount()));
  var currentBlockHash = await getInstance().getBlockHash(currentBlockCount);
  var currentBlockTime = (await getInstance().getBlock(currentBlockHash)).time;
  var startBlock = 230000;

  // const blocks = await db.Blocks.cfind({}).sort({ blockNum: -1 }).limit(1).exec();
  var blocks = await _models2.default.block.findAll({
    limit: 1,
    order: [['id', 'DESC']]
  });

  if (blocks.length > 0) {
    startBlock = Math.max(blocks[0].id + 1, startBlock);
  }

  var numOfIterations = Math.ceil((currentBlockCount - startBlock + 1) / BLOCK_BATCH_SIZE);

  sequentialLoop(numOfIterations, async function (loop) {
    var endBlock = Math.min(startBlock + BLOCK_BATCH_SIZE - 1, currentBlockCount);

    await syncTransactions(startBlock, endBlock, io, onlineUsers);
    console.log('Synced syncTrade');

    var _ref = await getInsertBlockPromises(startBlock, endBlock),
        insertBlockPromises = _ref.insertBlockPromises;

    await Promise.all(insertBlockPromises);
    console.log('Inserted Blocks');

    startBlock = endBlock + 1;
    loop.next();
  }, async function () {
    if (numOfIterations > 0) {
      // sendSyncInfo(
      //  currentBlockCount,
      //  currentBlockTime,
      //  await calculateSyncPercent(currentBlockCount, currentBlockTime),
      //  await network.getPeerNodeCount(),
      //  await getAddressBalances(),
      // );
    }
    console.log('sleep');
    // setTimeout(startSync, 5000);
  });
};

async function startSync(io, onlineUsers) {
  // const transactions = await getInstance().listTransactions(1000);
  // console.log(transactions);

  // TransactionModel.findAll
  // MetaData = await getContractMetadata();
  senderAddress = isMainnet() ? 'RKBLGRvYqunBtpueEPuXzQQmoVsQQTvd3a' : '5VMGo2gGHhkW5TvRRtcKM1RkyUgrnNP7dn';
  console.log('startSync');
  sync(io, onlineUsers);
}

module.exports = {
  startSync: startSync,
  calculateSyncPercent: calculateSyncPercent
  // getAddressBalances,
};