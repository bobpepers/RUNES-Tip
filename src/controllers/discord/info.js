/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  coinInfoMessage,
  discordErrorMessage,
  cannotSendMessageUser,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { getInstance } from '../../services/rclient';

export const discordCoinInfo = async (
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
      'info',
    );

    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const walletInfo = await getInstance().getWalletInfo();

    const blockHeight = await db.block.findOne({
      order: [['id', 'DESC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const priceInfo = await db.currency.findOne({
      order: [['id', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const preActivity = await db.activity.create({
      type: 'info_s',
      earnerId: user.id,
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
          model: db.user,
          as: 'earner',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(finalActivity);

    if (message.channel.type === 'DM') {
      await message.author.send({
        embeds: [
          coinInfoMessage(
            blockHeight.id,
            priceInfo,
            walletInfo.walletversion,
          ),
        ],
      });
    }
    if (message.channel.type === 'GUILD_TEXT') {
      await message.author.send({
        embeds: [
          coinInfoMessage(
            blockHeight.id,
            priceInfo,
          ),
        ],
      });
      await message.channel.send({
        embeds: [
          warnDirectMessage(
            message.author.id,
            'Coin Info',
          ),
        ],
      });
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'info',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`info error: ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "Coin Info",
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
            "Coin Info",
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
