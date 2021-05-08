'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdraw = exports.fetchWallet = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _rclient = require('../services/rclient');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Fetch Wallet
 */


var fetchWallet = exports.fetchWallet = async function fetchWallet(req, res, next) {
  console.log('Fetch wallet here');
  res.json({ success: true });
};

/**
 * Create Withdrawal
 */
var withdraw = exports.withdraw = async function withdraw(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var amount = req.body.amount * 1e8;
    var isRunebaseAddress = await (0, _rclient.getInstance)().utils.isRunebaseAddress(req.body.address);
    if (!isRunebaseAddress) {
      throw new Error('INVALID_ADDRESS');
    }
    console.log('find user wallet');
    // Find Users Wallet
    var userWallet = await _models2.default.wallet.findOne({
      where: {
        userId: req.user.id
      },
      include: [{
        model: _models2.default.address,
        as: 'addresses'
      }],
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    // Withdrawal error conditions
    if (!userWallet) {
      console.log('wallet not found');
      throw new Error('WALLET_NOT_FOUND');
    }

    if (amount > userWallet.available) {
      console.log('not enough funds');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    var wallet = await userWallet.update({
      available: userWallet.available - amount,
      locked: userWallet.locked + amount
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('updated wallet');
    console.log(wallet);
    var transaction = await _models2.default.transaction.create({
      addressId: wallet.addresses[0].id,
      phase: 'review',
      type: 'send',
      to_from: req.body.address,
      amount: amount
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('created transaction');
    var activity = await _models2.default.activity.create({
      spenderId: wallet.userId,
      type: 'withdrawRequested',
      amount: transaction.amount,
      spender_balance: wallet.available + wallet.locked
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('created activity');
    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: activity.id
      },
      attributes: ['createdAt', 'type'],
      include: [{
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('end withdrawal request');
    t.afterCommit(function () {
      res.locals.wallet = wallet;
      res.locals.transaction = transaction;
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};