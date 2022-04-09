import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  balanceMessage,
  discordErrorMessage,
  cannotSendMessageUser,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";

export const fetchDiscordWalletBalance = async (
  message,
  io,
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
      'balance',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const priceInfo = await db.currency.findOne({
      where: {
        iso: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const userId = user.user_id.replace('discord-', '');

    if (message.channel.type === 'DM') {
      await message.author.send({
        embeds: [
          balanceMessage(
            userId,
            user,
            priceInfo,
          ),
        ],
      });
    }

    if (message.channel.type === 'GUILD_TEXT') {
      await message.author.send({
        embeds: [
          balanceMessage(
            userId,
            user,
            priceInfo,
          ),
        ],
      });
      await message.channel.send({
        embeds: [
          warnDirectMessage(
            userId,
            'Balance',
          ),
        ],
      });
    }

    const createActivity = await db.activity.create({
      type: 'balance_s',
      earnerId: user.id,
      earner_balance: user.wallet.available + user.wallet.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const findActivity = await db.activity.findOne({
      where: {
        id: createActivity.id,
      },
      include: [
        {
          model: db.user,
          as: 'earner',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(findActivity);

    t.afterCommit(() => {
      console.log('done balance request');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'balance',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`Error Discord Balance Request: ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "Balance",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({
        embeds: [
          discordErrorMessage("Balance"),
        ],
      }).catch((e) => {
        console.log(e);
      });
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
