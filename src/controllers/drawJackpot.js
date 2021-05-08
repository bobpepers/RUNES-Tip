import { rest } from 'lodash';
import db from '../models';
import logger from '../helpers/logger';

const schedule = require('node-schedule');

const { Sequelize, Transaction, Op } = require('sequelize');

const drawJackpot = async (sub, pub, expired_subKey) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const jackpot = await db.jackpot.findOne({
      order: [['createdAt', 'DESC']],
      // where: {
      //  phase: 'running',
      // },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    logger.info(jackpot);
    logger.info('Find Jackpot');
    // console.log(jackpot);
    if (!jackpot) {
      logger.info('Jackpot Not found');
      await db.jackpot.create({
        jackpot_amount: 500 * 1e8,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (jackpot) {
      const endsAtUnix = new Date(jackpot.endsAt).valueOf();
      const nowUnix = new Date().valueOf();
      const newEndDate = new Date(new Date(jackpot.endsAt).valueOf() + (7 * 24 * 60 * 60 * 1000)); // (7 * 24 * 60 * 60 * 1000)
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

        const users = await db.user.findAll({
          where: {
            jackpot_tickets: {
              [Op.gt]: 0,
            },
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        console.log('selected all users');
        // console.log('users.length ');
        // console.log(users.length);
        if (users.length > 1) {
          const totalTickets = users.reduce((a, b) => +a + +b.jackpot_tickets, 0);
          let newTicketAmount = 0;
          let prevTicketAmount = 0;
          await Promise.all(users.map(async (user, i, n) => {
            try {
              prevTicketAmount = newTicketAmount + 1;
              newTicketAmount += user.jackpot_tickets;
              // console.log(n);
              userArray.push({
                id: user.id,
                p: prevTicketAmount,
                c: newTicketAmount,
                t: user.jackpot_tickets,
              });
              await user.update({ jackpot_tickets: 0 }, {
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
            } catch (error) {
              console.log(`error${error}`);
            }
          }));
          console.log('after user push');
          if (users.length < 10) {
            console.log('less then 10 users');
            console.log(userArray[userArray.length - 1].c);
            while (winnerArray.length < userArray.length) {
              // console.log('winner length');
              // console.log(winnerArray.length);
              // console.log('user length');
              // console.log(userArray.length);
              // console.log(userArray);
              // console.log('0');
              // console.log(userArray[0]);
              // console.log('1');
              // console.log(userArray[1]);
              // console.log('2');
              // console.log(userArray[2]);
              // console.log('3');
              // console.log(userArray[3]);
              // console.log('4');
              // console.log(userArray[4]);
              const random = Math.floor(Math.random() * (userArray[userArray.length - 1].c + 1));
              if (random === 78) {
                console.log(`random number = ${random}`);
              }

              userArray.forEach((entry) => {
                // console.log(entry);
                if (random >= entry.p && random <= entry.c) {
                  const found = winnerArray.some((el) => el.id === entry.id);
                  if (!found) winnerArray.push({ id: entry.id, tickets: entry.t });
                  // console.log('winner array');
                  // console.log(winnerArray);
                }
              });
            }
          } else {
            console.log('over 10 users');
            while (winnerArray.length < 10) {
              const random = Math.floor(Math.random() * (userArray[userArray.length - 1].c + 1));
              userArray.forEach((entry) => {
                if (random >= entry.p && random <= entry.c) {
                  const found = winnerArray.some((el) => el.id === entry.id);
                  if (!found) winnerArray.push({ id: entry.id, tickets: entry.t });
                }
              });
            }
          }
          console.log('after user draw');
          const winAmountArray = [
            ((jackpot.jackpot_amount / 100) * 24), // firstPrice
            ((jackpot.jackpot_amount / 100) * 19), // secondPrice
            ((jackpot.jackpot_amount / 100) * 14), // thirdPrice
            ((jackpot.jackpot_amount / 100) * 10), // fourthPrice
            ((jackpot.jackpot_amount / 100) * 9), // fifthPrice
            ((jackpot.jackpot_amount / 100) * 8), // sixedPrice
            ((jackpot.jackpot_amount / 100) * 6), // seventhPrice
            ((jackpot.jackpot_amount / 100) * 5), // eightPrice
            ((jackpot.jackpot_amount / 100) * 3), // nignthPrice
            ((jackpot.jackpot_amount / 100) * 2), // tenthPrice
          ];

          await Promise.all(winnerArray.map(async (zwinner, index) => {
            try {
              if (zwinner !== undefined) {
                const winnerWallet = await db.wallet.findOne({
                  where: {
                    userId: zwinner.id,
                  },
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
                // console.log(winnerWallet);
                await winnerWallet.update({
                  available: winnerWallet.available + winAmountArray[parseInt(index, 10)],
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });

                await db.activity.create({
                  amount: winAmountArray[parseInt(index, 10)],
                  earnerId: zwinner.id,
                  type: 'jackpot',
                  earner_balance: (winnerWallet.locked + (winnerWallet.available)),
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
              }
            } catch (error) {
              console.log(`error${error}`);
            }
          }));
          console.log('near end user jackpotdraw');
          // Count total tickets this week when drawing

          // UPDATE JACKPOT RECORD AND CREATE NEW
          await jackpot.update({
            phase: 'complete',
            total_tickets: totalTickets,

            winnerOneId: winnerArray[0] ? winnerArray[0].id : null,
            winner_one_tickets: winnerArray[0] ? winnerArray[0].tickets : null,

            winnerTwoId: winnerArray[1] ? winnerArray[1].id : null,
            winner_two_tickets: winnerArray[1] ? winnerArray[1].tickets : null,

            winnerThreeId: winnerArray[2] ? winnerArray[2].id : null,
            winner_three_tickets: winnerArray[2] ? winnerArray[2].tickets : null,

            winnerFourId: winnerArray[3] ? winnerArray[3].id : null,
            winner_four_tickets: winnerArray[3] ? winnerArray[3].tickets : null,

            winnerFiveId: winnerArray[4] ? winnerArray[4].id : null,
            winner_five_tickets: winnerArray[4] ? winnerArray[4].tickets : null,

            winnerSixId: winnerArray[5] ? winnerArray[5].id : null,
            winner_six_tickets: winnerArray[5] ? winnerArray[5].tickets : null,

            winnerSevenId: winnerArray[6] ? winnerArray[6].id : null,
            winner_seven_tickets: winnerArray[6] ? winnerArray[6].tickets : null,

            winnerEigthId: winnerArray[7] ? winnerArray[7].id : null,
            winner_eight_tickets: winnerArray[7] ? winnerArray[7].tickets : null,

            winnerNineId: winnerArray[8] ? winnerArray[8].id : null,
            winner_nine_tickets: winnerArray[8] ? winnerArray[8].tickets : null,

            winnerTenId: winnerArray[9] ? winnerArray[9].id : null,
            winner_ten_tickets: winnerArray[9] ? winnerArray[9].tickets : null,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          console.log(newEndDate);

          await db.jackpot.create({
            jackpot_amount: 500 * 1e8,
            endsAt: newEndDate,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const oldStats = await db.stats.findOne({
            where: {
              id: 1,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const newStats = await oldStats.update({
            jackpot: oldStats.jackpot + 1,
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
              drawJackpot();
            });
            logger.info('subscribe');
            sub.subscribe(expired_subKey, () => {
              pub.setex('jackpot:', 999999999999999999, newStats.jackpot);
            });
          }

          console.log(`winners: ${winnerArray}`);
        } else {
          console.log('Not Enough Users for draw');
          throw new Error('NO_USERS');
        }
      } else {
        console.log('have not reached date for draw');
      }
    }

    t.afterCommit((newStats) => {
      console.log(newStats);
    });
  }).catch((err) => {
    console.log(err);
    logger.info('Jackpot Error');
    logger.debug(err);
  });
};

export default drawJackpot;
