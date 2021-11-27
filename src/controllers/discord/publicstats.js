/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  disablePublicStatsMessage,
  enablePublicStatsMeMessage,
  walletNotFoundMessage,
} from '../../messages/discord';
import db from '../../models';

export const discordPublicStats = async (message, io) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!user) {
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Ignore me')] });
      return;
    }
    if (user.publicStats) {
      await user.update({
        publicStats: false,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      message.channel.send({ embeds: [disablePublicStatsMessage(message)] });
      return;
    }
    if (!user.publicStats) {
      await user.update({
        publicStats: true,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      message.channel.send({ embeds: [enablePublicStatsMeMessage(message)] });
      return;
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
  });
};
