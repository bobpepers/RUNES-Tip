import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

const removeBannerTickets = async (onlineUsers) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const bannerOrderTickets = await db.bannerOrderTickets.destroy({
      transaction: t,
      lock: t.LOCK.UPDATE,
      where: {
        updatedAt: {
          [Op.lte]: new Date(Date.now() - (3 * 60 * 60 * 1000)),
        },
      },
    });
    t.afterCommit(() => {
      console.log('commited');
    });
  });
};

module.exports = {
  removeBannerTickets,
};
