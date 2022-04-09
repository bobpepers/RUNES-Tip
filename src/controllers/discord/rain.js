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

export const discordRain = async (
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
    const onlineMembers = await members.filter((member) => {
      const memberStatus = member
        && member.presence
        && member.presence.status;
      return (
        memberStatus === "online"
      );
    });

    const withoutBots = await mapMembers(
      message,
      t,
      filteredMessage[3],
      onlineMembers,
      setting,
    );

    if (withoutBots.length < 2) {
      console.log(withoutBots.length);
      const fActivity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(fActivity);
      await message.channel.send({
        embeds: [
          notEnoughActiveUsersMessage(
            message,
            'Rain',
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

    const rainRecord = await db.rain.create({
      feeAmount: Number(fee),
      amount,
      userCount: withoutBots.length,
      userId: user.id,
      groupId: groupTask.id,
      channelId: channelTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const preActivity = await db.activity.create({
      amount,
      type: 'rain_s',
      spenderId: user.id,
      rainId: rainRecord.id,
      spender_balance: updatedBalance.available + updatedBalance.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const finalActivity = await db.activity.findOne({
      where: {
        id: preActivity.id,
      },
      include: [
        {
          model: db.rain,
          as: 'rain',
        },
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(finalActivity);
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const rainee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const raineeWallet = await rainee.wallet.update({
        available: rainee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const raintipRecord = await db.raintip.create({
        amount: amountPerUser,
        userId: rainee.id,
        rainId: rainRecord.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (rainee.ignoreMe) {
        listOfUsersRained.push(`${rainee.username}`);
      } else {
        const userIdReceivedRain = rainee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }

      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'raintip_s',
        spenderId: user.id,
        earnerId: rainee.id,
        rainId: rainRecord.id,
        raintipId: raintipRecord.id,
        earner_balance: raineeWallet.available + raineeWallet.locked,
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
            model: db.rain,
            as: 'rain',
          },
          {
            model: db.raintip,
            as: 'raintip',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(tipActivity);
    }

    const newStringListUsers = listOfUsersRained.join(", ");
    console.log(newStringListUsers);
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
          rainRecord.id,
          amount,
          withoutBots,
          amountPerUser,
          'Rain',
          'rained',
        ),
      ],
    });
    // logger.info(`Success Rain Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'rain',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`rain error: ${err}`);
    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "Rain",
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
