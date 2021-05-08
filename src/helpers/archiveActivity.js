import db from '../models';
import logger from './logger';

const schedule = require('node-schedule');

const { Sequelize, Transaction, Op } = require('sequelize');

const archiveActivity = async () => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    try {
      const activities = await db.activity.findAll({
        order: [['id', 'ASC']],
        where: {
          createdAt: {
            [Op.lte]: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)), // Older then 3 days
          },
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      // for (const activity of activities) {
      //  console.log(activity);
      // }
      console.log('archive Activity');
      await Promise.all(
        activities.map(async (activity) => {
          await db.activityArchive.create({
            type: activity.type,
            amount: activity.amount,
            spender_balance: activity.spender_balance,
            earner_balance: activity.earner_balance,
            ipId: activity.ipId,
            spenderId: activity.spenderId,
            eanerId: activity.eanerId,
            orderId: activity.orderId,
            domainId: activity.domainId,
            txId: activity.txId,
            transactionId: activity.transactionId,
            userId: activity.userId,
            createdAt: activity.createdAt,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          await activity.destroy({
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }),
      );

      return;
    } catch (error) {
      console.error(error);
    }
    t.afterCommit(() => {
      logger.info('after commit archive activity');
    });
  }).catch((err) => {
    console.log(err);
    logger.info('Jackpot Error');
    logger.debug(err);
  });
};

export default archiveActivity;
