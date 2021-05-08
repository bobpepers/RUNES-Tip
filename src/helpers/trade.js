import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

export async function endUnacceptedTrade(tradeTemp, onlineUsers) {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    // console.log(userId);
    const trade = await db.trade.findOne(
      {
        where: {
          id: tradeTemp.id,
          type: 'requested',
        },
        include: [
          {
            model: db.postAd,
            as: 'postAd',
            required: true,
            // attributes: ['username'],
            include: [
              {
                model: db.currency,
                as: 'currency',
                required: true,
                // attributes: ['username'],
              },
              {
                model: db.user,
                as: 'user',
                required: true,
                attributes: ['username'],
              },
            ],
          },
          {
            model: db.user,
            as: 'user',
            required: true,
            attributes: ['username'],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    console.log(trade);
    if (!trade) {
      return;
    }

    const updatedTrade = await trade.update(
      {
        type: 'canceled',
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    t.afterCommit(() => {
      if (onlineUsers[updatedTrade.userId.toString()]) {
        onlineUsers[updatedTrade.userId.toString()].emit('updateTrade', {
          trade: updatedTrade,
        });
      }
      if (onlineUsers[updatedTrade.postAd.userId.toString()]) {
        onlineUsers[updatedTrade.postAd.userId.toString()].emit('updateTrade', {
          trade: updatedTrade,
        });
      }
      if (onlineUsers[updatedTrade.userId.toString()]) {
        onlineUsers[updatedTrade.userId.toString()].emit('updateCurrentTrade', {
          trade: updatedTrade,
        });
      }

      if (onlineUsers[updatedTrade.postAd.userId.toString()]) {
        onlineUsers[updatedTrade.postAd.userId.toString()].emit('updateCurrentTrade', {
          trade: updatedTrade,
        });
      }
    });
  });
}

export async function patchUnacceptedTrades(onlineUsers) {
  const tradesFromDB = await db.trade.findAll({
    where: {
      type: 'requested',
    },
    include: [
      {
        model: db.postAd,
        as: 'postAd',
        required: true,
        // attributes: ['username'],
        include: [
          {
            model: db.currency,
            as: 'currency',
            required: true,
            // attributes: ['username'],
          },
          {
            model: db.user,
            as: 'user',
            required: true,
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.user,
        as: 'user',
        required: true,
        attributes: ['username'],
      },
    ],
  });

  tradesFromDB.forEach(async (trade) => {
    if (trade.reponseTime > new Date()) {
      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        const updatedTrade = await trade.update({
          type: 'canceled',
        }, {
          where: {
            type: 'requested',
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        t.afterCommit(() => {
          if (onlineUsers[updatedTrade.userId.toString()]) {
            onlineUsers[updatedTrade.userId.toString()].emit('updateTrade', {
              trade: updatedTrade,
            });
          }
          if (onlineUsers[updatedTrade.postAd.userId.toString()]) {
            onlineUsers[updatedTrade.postAd.userId.toString()].emit('updateTrade', {
              trade: updatedTrade,
            });
          }
          if (onlineUsers[updatedTrade.userId.toString()]) {
            onlineUsers[updatedTrade.userId.toString()].emit('updateCurrentTrade', {
              trade: updatedTrade,
            });
          }

          if (onlineUsers[updatedTrade.postAd.userId.toString()]) {
            onlineUsers[updatedTrade.postAd.userId.toString()].emit('updateCurrentTrade', {
              trade: updatedTrade,
            });
          }
          console.log('commited');
        });
      });
    }
  });
}

// module.exports = {
//  endUnacceptedTrade,
//  patchUnacceptedTrades,
// };
