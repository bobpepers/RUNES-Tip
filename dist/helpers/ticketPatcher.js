'use strict';

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../services/rclient'),
    getInstance = _require2.getInstance;

async function removeStaleTickets(onlineUsers) {
  console.log('123');
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var surfTickets = await _models2.default.SurfTicket.findAll({
      transaction: t,
      lock: t.LOCK.UPDATE,
      where: {
        updatedAt: _defineProperty({}, Op.lte, new Date(Date.now() - 60 * 60 * 1000))
      },
      include: [{
        model: _models2.default.order,
        as: 'order',
        required: true,
        include: [{
          model: _models2.default.webslot,
          as: 'webslot',
          required: true
        }]
      }]
    });

    await Promise.all(surfTickets.map(async function (ticket) {
      try {
        console.log(ticket);
        console.log('ticket nummer');
        if (ticket.order.phase === 'active') {
          console.log('ticker is active');
          await ticket.destroy({
            transaction: t,
            lock: t.LOCK.UPDATE
          });
          return true;
        }
        if (ticket.order.phase === 'canceled') {
          console.log(ticket.order.price);
          // console.log(ticket.order.webslot.user.wallet.locked);
          var wallet = await _models2.default.wallet.findOne({
            where: {
              userId: ticket.order.webslot.userId
            },
            transaction: t,
            lock: t.LOCK.UPDATE
          });
          console.log(wallet.locked);
          var updatedWallet = await wallet.update({
            available: wallet.available + ticket.order.price,
            locked: wallet.locked - ticket.order.price
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE
          });
          await ticket.destroy({
            transaction: t,
            lock: t.LOCK.UPDATE
          });
          if (onlineUsers[updatedWallet.userId]) {
            onlineUsers[updatedWallet.userId].emit('updateWallet', { wallet: updatedWallet });
          }
          return true;
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    }));
    // console.log(surfTickets);
    t.afterCommit(function () {
      console.log('commited');
    });
  });
}

module.exports = {
  removeStaleTickets: removeStaleTickets
};