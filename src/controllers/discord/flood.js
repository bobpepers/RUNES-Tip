/* eslint-disable import/prefer-default-export */

import { Transaction } from "sequelize";
import db from '../../models';
import {
  notEnoughActiveUsersMessage,
  AfterSuccessMessage,
  discordErrorMessage,
} from '../../messages/discord';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/discord/validateAmount";
import { mapMembers } from "../../helpers/client/discord/mapMembers";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { waterFaucet } from "../../helpers/waterFaucet";

export const discordFlood = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
  faucetSetting,
  queue,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

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
      activity.unshift(activityValiateAmount);
      return;
    }

    const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });

    const onlineMembers = members.filter((member) => {
      // console.log(member.presence);
      console.log('-');
      return member;
    });

    const withoutBots = await mapMembers(
      message,
      t,
      filteredMessage[3],
      onlineMembers,
      setting,
    );

    if (withoutBots.length < 2) {
      const factivity = await db.activity.create({
        type: 'flood_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(factivity);
      await message.channel.send({
        embeds: [
          notEnoughActiveUsersMessage(
            message,
            'Flood',
          ),
        ],
      });
      return;
    }
    const updatedBalance = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);

    const faucetWatered = await waterFaucet(
      t,
      Number(fee),
      faucetSetting,
    );

    const floodRecord = await db.flood.create({
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
    const cactivity = await db.activity.create({
      amount,
      type: 'flood_s',
      spenderId: user.id,
      floodId: floodRecord.id,
      spender_balance: updatedBalance.available + updatedBalance.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const activityCreate = await db.activity.findOne({
      where: {
        id: cactivity.id,
      },
      include: [
        {
          model: db.flood,
          as: 'flood',
        },
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(activityCreate);
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const floodee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const floodeeWallet = await floodee.wallet.update({
        available: floodee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const floodtipRecord = await db.floodtip.create({
        amount: amountPerUser,
        userId: floodee.id,
        floodId: floodRecord.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (floodee.ignoreMe) {
        listOfUsersRained.push(`${floodee.username}`);
      } else {
        const userIdReceivedRain = floodee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }
      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'floodtip_s',
        spenderId: user.id,
        earnerId: floodee.id,
        floodId: floodRecord.id,
        floodtipId: floodtipRecord.id,
        earner_balance: floodeeWallet.available + floodeeWallet.locked,
        spender_balance: updatedBalance.available + updatedBalance.locked,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.findOne({
        where: {
          id: tipActivity.id,
        },
        include: [
          {
            model: db.user,
            as: 'earner',
          },
          {
            model: db.user,
            as: 'spender',
          },
          {
            model: db.flood,
            as: 'flood',
          },
          {
            model: db.floodtip,
            as: 'floodtip',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(tipActivity);
    }

    const newStringListUsers = listOfUsersRained.join(", ");
    const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
    // eslint-disable-next-line no-restricted-syntax
    for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
      await message.channel.send(element);
    }

    await message.channel.send({
      embeds: [
        AfterSuccessMessage(
          message,
          floodRecord.id,
          amount,
          withoutBots,
          amountPerUser,
          'Flood',
          'flooded',
        ),
      ],
    });

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'flood',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`flood error: ${err}`);
    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "Flood",
        ),
      ],
    }).catch((e) => {
      console.log(e);
    });
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
