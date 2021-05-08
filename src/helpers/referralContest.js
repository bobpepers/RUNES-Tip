import { rest } from 'lodash';
import db from '../models';
import logger from './logger';

const schedule = require('node-schedule');

const { Sequelize, Transaction, Op } = require('sequelize');

function sortObject(obj) {
  const arr = [];
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        key: prop,
        value: obj[prop],
      });
    }
  }
  arr.sort((a, b) => a.value - b.value);
  // arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
  return arr; // returns array
}

const drawReferralContest = async (sub, pub, expired_subKey) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    /// /

    const rewards = await db.contestRewards.findAll({
      limit: 1,
      order: [['id', 'DESC']],
    });

    console.log(rewards);

    if (!rewards || !rewards.length) {
      await db.contestRewards.create({
        firstPlace: '173 USD',
        secondPlace: '2000 RUNES',
        thirdPlace: '1000 RUNES',
        firstPlaceNext: '25 USD',
        secondPlaceNext: '1000 RUNES',
        thirdPlaceNext: '500 RUNES',
      });
    }

    const contestRewards = await db.contestRewards.findAll({
      limit: 1,
      order: [['id', 'DESC']],
    });

    /// /

    const constestReferral = await db.referralContest.findOne({
      order: [['id', 'DESC']],
      // where: {
      //  phase: 'running',
      // },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    logger.info(constestReferral);
    logger.info('Find Jackpot');
    // console.log(jackpot);
    if (!constestReferral) {
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      logger.info('Jackpot Not found');
      const startsAt = new Date('2021-04-18 17:00:00');
      const endsAt = new Date(new Date(startsAt).valueOf() + (7 * 24 * 60 * 60 * 1000));
      await db.referralContest.create({
        startsAt,
        endsAt,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    ///
    if (constestReferral) {
      const endsAtUnix = new Date(constestReferral.endsAt).valueOf();
      const nowUnix = new Date().valueOf();
      const newEndDate = new Date(new Date(constestReferral.endsAt).valueOf() + (7 * 24 * 60 * 60 * 1000)); // (7 * 24 * 60 * 60 * 1000)
      // const newEndDate = new Date(new Date(jackpot.endsAt).valueOf() + (5 * 60 * 1000)); // (7 * 24 * 60 * 60 * 1000)
      const cronjob = await db.cronjob.findOne({
        order: [['createdAt', 'DESC']],
        where: {
          type: 'drawJackpot',
          state: 'executing',
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!cronjob) {
        console.log(newEndDate.toISOString());
        console.log('cronjob not found');
        await db.cronjob.create({
          type: 'drawJackpot',
          state: 'executing',
          expression: newEndDate.toISOString(),
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        console.log('cronjob created');
      }
      if (endsAtUnix < nowUnix) {
        const userArray = [];
        const winnerArray = [];

        const referrals = await db.Referrals.findAll({
          where: {
            [Op.and]: [
              {
                createdAt: { [Op.gte]: new Date(constestReferral.startsAt) },
              },
              {
                createdAt: { [Op.lte]: new Date(constestReferral.endsAt) },
              },
            ],
          },
          include: [
            {
              model: db.user,
              // required: false,
              as: 'userReferred',
              attributes: [
                'id',
                'username',
                'firstTrade',
                'authused',
                'identityVerified',
              ],
              where: {
                [Op.and]: [
                  {
                    firstTrade: { [Op.ne]: null },
                  },
                  {
                    authused: true,
                  },
                  {
                    phoneNumberVerified: true,
                  },
                  {
                    identityVerified: 'accepted',
                  },
                ],
              },
            },
            {
              model: db.user,
              // required: false,
              as: 'userReferrer',
              attributes: [
                'id',
                'username',
                'firstTrade',
                'authused',
                'identityVerified',
              ],
              where: {
                [Op.and]: [
                  {
                    firstTrade: {
                      [Op.ne]: null,
                    },
                  },
                  {
                    authused: true,
                  },
                  {
                    phoneNumberVerified: true,
                  },
                  {
                    identityVerified: 'accepted',
                  },
                ],
              },
              include: [
                {
                  model: db.wallet,
                  // required: false,
                  as: 'wallet',
                  attributes: [
                    'available',
                    'locked',
                  ],
                  where: {
                    available: {
                      [Op.gte]: 20000000000,
                    },
                  },
                },
              ],
            },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');
        console.log('referrals');

        console.log(referrals);

        const result = [];

        for (let i = 0; i < referrals.length; ++i) { // loop over array
          if (!result[referrals[i].userReferred.id]) { // if no key for that number yet
            result[referrals[i].userReferred.id] = 0; // then make one
          }

          ++result[referrals[i].userReferred.id]; // increment the property for that number
          console.log(result);
        }

        //
        // const entries = Object.entries(result);
        // const sorted = entries.sort((a, b) => a[1] - b[1]);
        const sorted = sortObject(result);
        const revSorted = sorted.reverse();
        console.log(revSorted);
        console.log(revSorted[0]);
        console.log(revSorted[1]);
        console.log(revSorted[2]);

        const updatedReferralContest = constestReferral.update({
          first_place_reward: contestRewards[0].firstPlace,
          second_place_reward: contestRewards[0].secondPlace,
          third_place_reward: contestRewards[0].thirdPlace,
          winnerFirstId: revSorted[0] && revSorted[0].value >= 10 ? revSorted[0].key : null,
          winnerSecondId: revSorted[1] && revSorted[1].value >= 10 ? revSorted[1].key : null,
          winnerThirdId: revSorted[2] && revSorted[2].value >= 10 ? revSorted[2].key : null,
          phase: 'complete',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const newRewards = await db.contestRewards.create({
          firstPlace: contestRewards[0].firstPlaceNext,
          secondPlace: contestRewards[0].secondPlaceNext,
          thirdPlace: contestRewards[0].thirdPlaceNext,
          firstPlaceNext: contestRewards[0].firstPlaceNext,
          secondPlaceNext: contestRewards[0].secondPlaceNext,
          thirdPlaceNext: contestRewards[0].thirdPlaceNext,
        });

        const newReferralContest = await db.referralContest.create({
          startsAt: constestReferral.endsAt,
          endsAt: newEndDate,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (cronjob) {
          if (new Date(cronjob.expression).valueOf() > (nowUnix + (5 * 60 * 1000))) {
            await cronjob.update({
              state: 'error',
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
          } else {
            await cronjob.update({
              state: 'finished',
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
          }
          await db.cronjob.create({
            type: 'drawJackpot',
            state: 'executing',
            expression: newEndDate.toISOString(),
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          console.log('before schedule next draw');
          const scheduleNextDraw = schedule.scheduleJob(newEndDate, (fireDate) => {
            console.log(`draw: This job was supposed to run at ${fireDate}, but actually ran at ${new Date()}`);
            drawReferralContest();
          });
          logger.info('subscribe');
        }
      } else {
        console.log('have not reached date for draw');
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
    logger.info('Jackpot Error');
    logger.debug(err);
  });
};

export default drawReferralContest;
