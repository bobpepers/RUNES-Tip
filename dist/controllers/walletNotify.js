'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rclient = require('../services/rclient');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Notify New Block From Runebase Node
 */


var walletNotify = async function walletNotify(req, res, next) {
  var txId = req.body.payload;
  var transaction = await (0, _rclient.getInstance)().getTransaction(txId);
  console.log(transaction);
  console.log(transaction.details[0]);

  // const testt = await getInstance().utils.toUtf8(transaction.hex);
  // console.log(testt);

  if (transaction.details[0].category === 'receive') {
    await _models2.default.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, async function (t) {
      console.log(transaction.details[0].address);
      console.log(transaction.txid);
      var address = await _models2.default.address.findOne({
        where: {
          address: transaction.details[0].address
        },
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      console.log(address);
      res.locals.userId = address.wallet.userId;
      res.locals.transaction = await _models2.default.transaction.findOrCreate({
        where: {
          txid: transaction.txid
        },
        defaults: {
          txid: txId,
          addressId: address.id,
          phase: 'confirming',
          type: transaction.details[0].category,
          amount: transaction.details[0].amount * 1e8
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      console.log(res.locals.transaction);
      console.log(res.locals.transaction[1]);
      console.log('111111111111111111112222222222222222222222222222222222');

      if (res.locals.transaction[1]) {
        var activity = await _models2.default.activity.findOrCreate({
          where: {
            txid: res.locals.transaction[0].id
          },
          defaults: {
            earnerId: res.locals.userId,
            type: 'depositAccepted',
            amount: transaction.details[0].amount * 1e8,
            txId: res.locals.transaction[0].id
          },
          transaction: t,
          lock: t.LOCK.UPDATE
        });

        res.locals.activity = await _models2.default.activity.findOne({
          where: {
            txId: res.locals.transaction[0].id
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
      }

      t.afterCommit(function () {
        next();
        console.log('commited');
      });
    });
  }
};

exports.default = walletNotify;