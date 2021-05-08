import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');

async function removeStaleTickets(onlineUsers) {
  console.log('123');
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const surfTickets = await db.SurfTicket.findAll({
      transaction: t,
      lock: t.LOCK.UPDATE,
      where: {
        updatedAt: {
          [Op.lte]: new Date(Date.now() - (60 * 60 * 1000)),
        },
      },
      include: [
        {
          model: db.order,
          as: 'order',
          required: true,
          include: [
            {
              model: db.webslot,
              as: 'webslot',
              required: true,
            },
          ],
        },
      ],
    });

    await Promise.all(surfTickets.map(async (ticket) => {
      try {
        console.log(ticket);
        console.log('ticket nummer');
        if (ticket.order.phase === 'active') {
          console.log('ticker is active');
          await ticket.destroy({
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          return true;
        }
        if (ticket.order.phase === 'canceled') {
          console.log(ticket.order.price);
          // console.log(ticket.order.webslot.user.wallet.locked);
          const wallet = await db.wallet.findOne({
            where: {
              userId: ticket.order.webslot.userId,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          console.log(wallet.locked);
          const updatedWallet = await wallet.update({
            available: wallet.available + ticket.order.price,
            locked: wallet.locked - ticket.order.price,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          await ticket.destroy({
            transaction: t,
            lock: t.LOCK.UPDATE,
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
    t.afterCommit(() => {
      console.log('commited');
    });
  });
}

module.exports = {
  removeStaleTickets,
};
