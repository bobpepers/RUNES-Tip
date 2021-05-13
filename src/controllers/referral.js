/* eslint-disable no-await-in-loop */
import db from '../models';
import { getInstance } from '../services/rclient';

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const qr = require('qr-image');
const logger = require('../helpers/logger');

const referralRunesReward = 20 * 1e8;

// eslint-disable-next-line import/prefer-default-export
export const createReferral = async (ctx, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    // console.log(ctx);
    // eslint-disable-next-line no-restricted-syntax
    for (const newMember of ctx.message.new_chat_members) {
      const user = await db.user.findOne({
        where: {
          user_id: `telegram-${ctx.message.from.id}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (user) {
        console.log('newMember');
        console.log(newMember);

        if (newMember.is_bot === false) {
          const myReferral = await db.referral.findOne({
            where: {
              user_id: `telegram-${newMember.id}`,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (!myReferral) {
            const addNewReferral = await db.referral.create({
              userId: user.id,
              user_id: `telegram-${newMember.id}`,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
            const updatedUser = await user.update({
              referral_count: user.referral_count + 1,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
            if (updatedUser.referral_count % 10 === 0) {
              const addReward = await db.referralReward.create({
                userId: user.id,
                count: updatedUser.referral_count,
                amount: referralRunesReward,
              }, {
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              const updatedUserWallet = await updatedUser.wallet.update({
                available: updatedUser.wallet.available + referralRunesReward,
              }, {
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              console.log(updatedUser);
              console.log(updatedUserWallet);
              await bot.telegram.sendMessage(runesGroup, `Congratulations ${user.username}, you added ${updatedUser.referral_count} users to Runebase Telegram channel,
we added ${referralRunesReward / 1e8} RUNES to your wallet as a reward.`);
            }
          }
        }
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong with adding referral');
  });
};

export const fetchReferralCount = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(ctx);
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${ctx.update.message.from.id}`,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!user) {
      ctx.reply(`User not found`);
    }
    if (user) {
      ctx.reply(`${user.username}'s referral count: ${user.referral_count}`);
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong with fetching referral');
  });
};