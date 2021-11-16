/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ignoreMeMessage,
  unIngoreMeMessage,
  walletNotFoundMessage,
} from '../../messages/discord';
import db from '../../models';

export const setIgnoreMe = async (message) => {
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
    if (user.ignoreMe) {
      await user.update({
        ignoreMe: false,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      message.channel.send({ embeds: [unIngoreMeMessage(message)] });
      return;
    }
    if (!user.ignoreMe) {
      await user.update({
        ignoreMe: true,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      message.channel.send({ embeds: [ignoreMeMessage(message)] });
      return;
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err.message);
  });
};
