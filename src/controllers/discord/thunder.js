/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  walletNotFoundMessage,
  minimumMessage,
  AfterThunderSuccess,
  NotInDirectMessage,
} from '../../messages/discord';

import _ from "lodash";

import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import logger from "../../helpers/logger";

export const discordThunder = async (
  discordClient, 
  message, 
  filteredMessage, 
  io, 
  groupTask, 
  channelTask,
  setting,
  ) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Flood')] });
    return;
  }
  const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
  const onlineMembers = members.filter((member) =>
    member.presence?.status === "online"
  );
  const mappedMembersArray = onlineMembers.map((a) => {
    return a.user;
  });
  const preWithoutBots = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const discordUser of mappedMembersArray) {
    // eslint-disable-next-line no-await-in-loop
    if (discordUser.bot === false) {
      // eslint-disable-next-line no-await-in-loop
      const userExist = await db.user.findOne({
        where: {
          user_id: `discord-${discordUser.id}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            required: true,
            include: [
              {
                model: db.address,
                as: 'addresses',
                required: true,
              },
            ],
          },
        ],
      });
      if (userExist) {
        const userIdTest = userExist.user_id.replace('discord-', '');
        if (userIdTest !== message.author.id) {
          preWithoutBots.push(userExist);
        }
      }
    }
  }
  const withoutBots = _.sampleSize(preWithoutBots, 1);
  let activity;
  let user;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          required: true,
          include: [
            {
              model: db.address,
              as: 'addresses',
              required: true,
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!user) {
      activity = await db.activity.create({
        type: 'thunder_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Thunder')] });
      return;
    }
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }
    if (amount < setting.min) {
      activity = await db.activity.create({
        type: 'thunder_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [minimumMessage(message, 'Thunder')] });
      return;
    }
    if (amount % 1 !== 0) {
      activity = await db.activity.create({
        type: 'thunder_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Thunder')] });
      return;
    }
    if (amount <= 0) {
      activity = await db.activity.create({
        type: 'thunder_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Thunder')] });
      return;
    }

    if (user.wallet.available < amount) {
      activity = await db.activity.create({
        type: 'thunder_i',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Thunder')] });
      return;
    }

    if (withoutBots.length < 1) {
      activity = await db.activity.create({
        type: 'thunder_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send('Not enough online users');
      return;
    }
    if (withoutBots.length === 1) {
      const updatedBalance = await user.wallet.update({
        available: user.wallet.available - amount,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const amountPerUser = (((amount / withoutBots.length).toFixed(0)));
      const thunderRecord = await db.thunder.create({
        amount,
        userCount: withoutBots.length,
        userId: user.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity = await db.activity.create({
        amount,
        type: 'thunder_s',
        spenderId: user.id,
        thunderId: thunderRecord.id,
        spender_balance: updatedBalance.available + updatedBalance.locked,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity = await db.activity.findOne({
        where: {
          id: activity.id,
        },
        include: [
          {
            model: db.thunder,
            as: 'thunder'
          },
          {
            model: db.user,
            as: 'spender'
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,

      });
      const listOfUsersRained = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const thunderee of withoutBots) {
        // eslint-disable-next-line no-await-in-loop
        const thundereeWallet = await thunderee.wallet.update({
          available: thunderee.wallet.available + Number(amountPerUser),
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        // eslint-disable-next-line no-await-in-loop
        const thundertipRecord = await db.thundertip.create({
          amount: amountPerUser,
          userId: thunderee.id,
          thunderId: thunderRecord.id,
          groupId: groupTask.id,
          channelId: channelTask.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (thunderee.ignoreMe) {
          listOfUsersRained.push(`${thunderee.username}`);
        } else {
          const userIdReceivedRain = thunderee.user_id.replace('discord-', '');
          listOfUsersRained.push(`<@${userIdReceivedRain}>`);
        }
        let tipActivity;
        tipActivity = await db.activity.create({
          amount: Number(amountPerUser),
          type: 'thundertip_s',
          spenderId: user.id,
          earnerId: thunderee.id,
          thunderId: thunderRecord.id,
          thundertipId: thundertipRecord.id,
          earner_balance: thundereeWallet.available + thundereeWallet.locked,
          spender_balance: updatedBalance.available + updatedBalance.locked,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        tipActivity = await db.activity.findOne({
          where: {
            id: tipActivity.id,
          },
          include: [
            {
              model: db.user,
              as: 'earner'
            },
            {
              model: db.user,
              as: 'spender'
            },
            {
              model: db.thunder,
              as: 'thunder'
            },
            {
              model: db.thundertip,
              as: 'thundertip'
            },
          ],
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        console.log(tipActivity);
        io.to('admin').emit('updateActivity', {
          activity: tipActivity,
        });
      }
      for (const userThunder of listOfUsersRained) {
        // eslint-disable-next-line no-await-in-loop
        await message.channel.send({ embeds: [AfterThunderSuccess(message, amount, userThunder)] });
      }

      logger.info(`Success Thunder Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send('something went wrong');
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
