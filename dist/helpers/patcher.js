'use strict';

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../services/rclient'),
    getInstance = _require2.getInstance;

async function patchDeposits() {
  console.log('patchDeposits');
  var transactions = await getInstance().listTransactions(1000);
  transactions.forEach(async function (trans) {
    if (trans.address) {
      var address = await _models2.default.address.findOne({
        where: {
          address: trans.address
        },
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      });
      if (!address) {
        return;
      }
      await _models2.default.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
      }, async function (t) {
        await _models2.default.transaction.findOrCreate({
          where: {
            txid: trans.txid
          },
          defaults: {
            txid: trans.txid,
            addressId: address.id,
            phase: 'confirming',
            type: trans.category,
            amount: trans.amount * 1e8
          },
          transaction: t,
          lock: t.LOCK.UPDATE
        });
        t.afterCommit(function () {
          console.log('commited');
        });
      });
    }
  });
}

module.exports = {
  patchDeposits: patchDeposits
};