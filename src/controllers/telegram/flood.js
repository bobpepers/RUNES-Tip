/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
// import axios from 'axios';
// import { Api } from 'telegram';
import dotenv from 'dotenv';
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
// const { Api } = require('telegram');

dotenv.config();

export const telegramFlood = async (
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
  let user;
  let userActivity;
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (ctx.update.message.chat.id === ctx.update.message.from.id) {
      const notDirectActivity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(notDirectActivity);
      return;
    }

    const chatId = Math.abs(ctx.message.chat.id).toString();

    // const membersCount = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChatMembersCount?chat_id=${ctx.message.chat.id}`);
    // let i = 0;
    // let members = [];
    // while (i < membersCount.data.result) {
    //  const membersTemp = await telegramApiClient.getParticipants(chatId, {
    //    limit: 2,
    //    offset: i,
    //  });
    //  members = members.concat(membersTemp);
    //  i += 2;
    // }

    const members = await telegramApiClient.getParticipants(chatId, {
      limit: 200000,
    });

    const onlineMembers = members.filter((member) => {
      // console.log(member);
      console.log('-');
      return !member.bot;
    });

    [
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

    // console.log(onlineMembers);
    const withoutBots = await mapMembers(
      ctx,
      t,
      onlineMembers,
      setting,
    );

    console.log(withoutBots);

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

    if (withoutBots.length < 2) {
      const factivity = await db.activity.create({
        type: 'flood_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(factivity);

      await ctx.replyWithHTML(notEnoughUsers('Flood'));
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
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      const [
        userToMention,
        userId,
      ] = await getUserToMentionFromDatabaseRecord(floodee);

      if (floodee.ignoreMe) {
        listOfUsersRained.push(`${userToMention}`);
      } else {
        listOfUsersRained.push(`<a href="tg://user?id=${userId}">${userToMention}</a>`);
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
    const cutStringListUsers = newStringListUsers.match(/.{1,3500}(\s|$)/g);
    // eslint-disable-next-line no-restricted-syntax
    for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
      await ctx.replyWithHTML(
        userListMessage(
          element,
        ),
      );
    }

    await ctx.replyWithHTML(
      await afterSuccessMessage(
        ctx,
        floodRecord.id,
        amount,
        withoutBots,
        amountPerUser,
        'Flood',
        'flooded',
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
      await ctx.replyWithHTML(errorMessage(
        'Flood',
      ));
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
