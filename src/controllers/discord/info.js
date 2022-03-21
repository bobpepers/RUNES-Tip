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

export const discordCoinInfo = async (
  message,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const blockHeight = await db.block.findOne({
      order: [['id', 'DESC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const priceInfo = await db.priceInfo.findOne({
      order: [['id', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (message.channel.type === 'DM') {
      await message.author.send({ embeds: [coinInfoMessage(blockHeight.id, priceInfo)] });
    }
    if (message.channel.type === 'GUILD_TEXT') {
      await message.author.send({ embeds: [coinInfoMessage(blockHeight.id, priceInfo)] });
      await message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Coin Info')] });
    }
    const user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const preActivity = await db.activity.create({
      type: 'info',
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
      await message.channel.send({ embeds: [cannotSendMessageUser("Coin Info", message)] }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({ embeds: [discordErrorMessage("Coin Info")] }).catch((e) => {
        console.log(e);
      });
    }
  });

  io.to('admin').emit('updateActivity', {
    activity,
  });
};
