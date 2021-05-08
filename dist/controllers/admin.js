'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rejectWithdraw = exports.acceptWithdraw = exports.fetchAdminUser = exports.fetchAdminUserList = exports.fetchAdminWithdrawals = exports.isAdmin = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../services/rclient'),
    getInstance = _require2.getInstance;

/**
 * isAdmin
 */


var isAdmin = exports.isAdmin = async function isAdmin(req, res, next) {
  if (req.user.role !== 4) {
    console.log('unauthorized');
    res.status(401).send({
      error: 'Unauthorized'
    });
  } else {
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
var fetchAdminWithdrawals = exports.fetchAdminWithdrawals = async function fetchAdminWithdrawals(req, res, next) {
  console.log('fetchAdminWithdrawals');
  try {
    res.locals.withdrawals = await _models2.default.transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: _models2.default.address,
        as: 'address',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet',
          include: [{
            model: _models2.default.user,
            as: 'user'
          }]
        }]
      }],
      where: {
        type: 'send'
      }
    });
    console.log(res.locals.withdrawals);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
var fetchAdminUserList = exports.fetchAdminUserList = async function fetchAdminUserList(req, res, next) {
  try {
    res.locals.userlist = await _models2.default.user.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'username', 'email', 'banned'],
      include: [{
        model: _models2.default.wallet,
        as: 'wallet',
        include: [{
          model: _models2.default.address,
          as: 'addresses'
        }]
      }]
    });
    console.log('after find all');
    console.log(res.locals.userlist);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
var fetchAdminUser = exports.fetchAdminUser = async function fetchAdminUser(req, res, next) {
  try {
    res.locals.user = await _models2.default.user.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['id', 'username', 'email', 'banned'],
      include: [{
        model: _models2.default.wallet,
        as: 'wallet',
        include: [{
          model: _models2.default.address,
          as: 'addresses'
        }]
      }, {
        model: _models2.default.activity,
        // required: false,
        as: 'spender'
      }, {
        model: _models2.default.activity,
        // required: false,
        as: 'earner'
      }, {
        model: _models2.default.activityArchive,
        // required: false,
        as: 'archivedSpender'
      }, {
        model: _models2.default.activityArchive,
        // required: false,
        as: 'archivedEarner'
      }, {
        model: _models2.default.webslot,
        as: 'webslots',
        required: false,
        include: [{
          model: _models2.default.order,
          as: 'order',
          required: false
        }, {
          model: _models2.default.domain,
          as: 'domain',
          required: false
        }]
      }]
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * isAdmin
 */
var acceptWithdraw = exports.acceptWithdraw = async function acceptWithdraw(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var transaction = await _models2.default.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review'
      },
      include: [{
        model: _models2.default.address,
        as: 'address',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }
    var amount = transaction.amount / 100 * 95 / 1e8;
    var response = await getInstance().sendToAddress(transaction.to_from, amount);
    res.locals.transaction = await transaction.update({
      txid: response,
      phase: 'confirming'
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    var activity = await _models2.default.activity.create({
      spenderId: transaction.address.wallet.userId,
      type: 'withdrawAccepted',
      txId: transaction.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
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
    t.afterCommit(function () {
      console.log('complete');
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};

/**
 * isAdmin
 */
var rejectWithdraw = exports.rejectWithdraw = async function rejectWithdraw(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var transaction = await _models2.default.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review'
      },
      include: [{
        model: _models2.default.address,
        as: 'address',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }

    var wallet = await _models2.default.wallet.findOne({
      where: {
        userId: transaction.address.wallet.userId
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!wallet) {
      throw new Error('WALLET_NOT_EXIST');
    }

    var updatedWallet = await wallet.update({
      available: wallet.available + transaction.amount,
      locked: wallet.locked - transaction.amount
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.transaction = await transaction.update({
      phase: 'rejected'
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var activity = await _models2.default.activity.create({
      spenderId: transaction.address.wallet.userId,
      type: 'withdrawRejected',
      txId: res.locals.transaction.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
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

    t.afterCommit(function () {
      console.log('Withdrawal Rejected');
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
  console.log(req.body.id);
};