/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import { Api } from 'telegram';
import db from '../../models';
import {
  afterSuccessMessage,
  notEnoughUsers,
  userListMessage,
  errorMessage,
} from '../../messages/telegram';

import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/telegram/validateAmount";
import { mapMembers } from "../../helpers/client/telegram/mapMembers";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";
import { waterFaucet } from "../../helpers/waterFaucet";
import { getUserToMentionFromDatabaseRecord } from "../../helpers/client/telegram/userToMention";

export const telegramRain = async (
  telegramClient,
  telegramApiClient,
  ctx,
  filteredMessage,
  io,
  groupTask,
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
      ctx,
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
      ctx,
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

    const members = await telegramApiClient.getParticipants(ctx.message.chat.id, {
      filter: Api.ChannelParticipantsRecent,
      limit: 200000,
    });
    console.log(members);
    console.log('aftermembers');

    const onlineMembers = members.filter((member) => !member.bot
      && member.status
      && member.status.className
      && member.status.className === 'UserStatusRecently');

    // console.log(onlineMembers);
    const withoutBots = await mapMembers(
      ctx,
      t,
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
      await ctx.replyWithHTML(notEnoughUsers('Rain'));
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
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      const [
        userToMention,
        userId,
      ] = await getUserToMentionFromDatabaseRecord(rainee);

      if (rainee.ignoreMe) {
        listOfUsersRained.push(`${userToMention}`);
      } else {
        listOfUsersRained.push(`<a href="tg://user?id=${userId}">${userToMention}</a>`);
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

    const cutStringListUsers = [];
    let i = 0;
    listOfUsersRained.forEach((word) => {
      if (!cutStringListUsers[parseInt(i, 10)]) {
        cutStringListUsers[parseInt(i, 10)] = word;
      } else if (cutStringListUsers[parseInt(i, 10)].length + word.length + 1 <= 3500) {
        cutStringListUsers[parseInt(i, 10)] += `, ${word}`;
      } else {
        i += 1;
        cutStringListUsers[parseInt(i, 10)] = word;
      }
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
      await ctx.replyWithHTML(
        await userListMessage(
          element,
        ),
      );
    }

    await ctx.replyWithHTML(
      await afterSuccessMessage(
        ctx,
        rainRecord.id,
        amount,
        withoutBots.length,
        amountPerUser,
        'Rain',
        'rained',
      ),
    );

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
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`flood error: ${err}`);
    try {
      await ctx.replyWithHTML(
        await errorMessage(
          'Flood',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
