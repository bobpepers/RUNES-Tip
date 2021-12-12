/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  walletNotFoundMessage,
  AfterThunderSuccess,
  NotInDirectMessage,
} from '../../messages/discord';

import _ from "lodash";

import { Transaction } from "sequelize";
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/discord/validateAmount";
import { mapMembers } from "../../helpers/discord/mapMembers";
import { userWalletExist } from "../../helpers/discord/userWalletExist";

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


  let activity;
  let user;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      activity,
    ] = await userWalletExist(
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (!user) return;

    const preWithoutBots = await mapMembers(
      message,
      t,
      filteredMessage[3],
      onlineMembers,
    );
    const withoutBots = _.sampleSize(preWithoutBots, 1);

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[2],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );
    if (activityValiateAmount) {
      activity = activityValiateAmount;
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
      const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
      const amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
      const thunderRecord = await db.thunder.create({
        feeAmount: fee,
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
