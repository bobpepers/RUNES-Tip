/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../../models';
import {
  notEnoughActiveUsersMessage,
  hurricaneMaxUserAmountMessage,
  hurricaneInvalidUserAmount,
  hurricaneUserZeroAmountMessage,
  AfterSuccessMessage,
  discordErrorMessage,
} from '../../messages/discord';
import { validateAmount } from "../../helpers/client/discord/validateAmount";
import { mapMembers } from "../../helpers/client/discord/mapMembers";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { waterFaucet } from "../../helpers/waterFaucet";

import logger from "../../helpers/logger";

export const discordHurricane = async (
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
    if (Number(filteredMessage[2]) > 50) {
      await message.channel.send({
        embeds: [
          hurricaneMaxUserAmountMessage(
            message,
          ),
        ],
      });
      return;
    }
    if (Number(filteredMessage[2]) % 1 !== 0) {
      await message.channel.send({
        embeds: [
          hurricaneInvalidUserAmount(
            message,
          ),
        ],
      });
      return;
    }
    if (Number(filteredMessage[2]) <= 0) {
      await message.channel.send({
        embeds: [
          hurricaneUserZeroAmountMessage(
            message,
          ),
        ],
      });
      return;
    }
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

    const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
    const onlineMembers = members.filter((member) => (member.presence && member.presence.status === "online")
      || (member.presence && member.presence.status === "idle")
      || (member.presence && member.presence.status === "dnd"));

    const preWithoutBots = await mapMembers(
      message,
      t,
      filteredMessage[4],
      onlineMembers,
      setting,
    );
    const withoutBots = _.sampleSize(preWithoutBots, Number(filteredMessage[2]));

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[3],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );
    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    if (withoutBots.length < 1) {
      const activityA = await db.activity.create({
        type: 'hurricane_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(activityA);
      await message.channel.send({
        embeds: [
          notEnoughActiveUsersMessage(
            message,
            'Hurricane',
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
    const hurricaneRecord = await db.hurricane.create({
      amount,
      feeAmount: fee,
      userCount: withoutBots.length,
      userId: user.id,
      groupId: groupTask.id,
      channelId: channelTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const factivity = await db.activity.create({
      amount,
      type: 'hurricane_s',
      spenderId: user.id,
      hurricaneId: hurricaneRecord.id,
      spender_balance: updatedBalance.available + updatedBalance.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const activityC = await db.activity.findOne({
      where: {
        id: factivity.id,
      },
      include: [
        {
          model: db.hurricane,
          as: 'hurricane',
        },
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(activityC);
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const hurricaneee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const hurricaneeeWallet = await hurricaneee.wallet.update({
        available: hurricaneee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const hurricanetipRecord = await db.hurricanetip.create({
        amount: amountPerUser,
        userId: hurricaneee.id,
        hurricaneId: hurricaneRecord.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (hurricaneee.ignoreMe) {
        listOfUsersRained.push(`${hurricaneee.username}`);
      } else {
        const userIdReceivedRain = hurricaneee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }
      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'hurricanetip_s',
        spenderId: user.id,
        earnerId: hurricaneee.id,
        hurricaneId: hurricaneRecord.id,
        hurricanetipId: hurricanetipRecord.id,
        earner_balance: hurricaneeeWallet.available + hurricaneeeWallet.locked,
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
            model: db.hurricane,
            as: 'hurricane',
          },
          {
            model: db.hurricanetip,
            as: 'hurricanetip',
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
          hurricaneRecord.id,
          amount,
          withoutBots,
          amountPerUser,
          '⛈ Hurricane ⛈',
          'hurricaned',
        ),
      ],
    });

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'hurricane',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`hurricane error: ${err}`);
    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "Hurricane",
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
