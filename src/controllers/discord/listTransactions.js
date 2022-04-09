import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  listTransactionsMessage,
  discordErrorMessage,
  cannotSendMessageUser,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";

export const fetchDiscordListTransactions = async (
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
      'listtransactions',
    );

    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const userId = user.user_id.replace('discord-', '');

    const transactions = await db.transaction.findAll({
      where: {
        userId: user.id,
      },
      order: [
        [
          'id',
          'DESC',
        ],
      ],
      limit: 10,
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const createActivity = await db.activity.create({
      type: 'listtransactions_s',
      earnerId: user.id,
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
    if (message.channel.type === 'DM') {
      await message.author.send({
        embeds: [
          listTransactionsMessage(
            userId,
            user,
            transactions,
          ),
        ],
      });
    }

    if (message.channel.type === 'GUILD_TEXT') {
      await message.author.send({
        embeds: [
          listTransactionsMessage(
            userId,
            user,
            transactions,
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

    t.afterCommit(() => {
      console.log('done list transactions request');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'listTransactions',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`Error Discord List Transactions Requested by: ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "List transactions",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({
        embeds: [
          discordErrorMessage(
            "List transactions",
          ),
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
