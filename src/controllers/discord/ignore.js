/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ignoreMeMessage,
  unIngoreMeMessage,
  walletNotFoundMessage,
} from '../../messages/discord';
import db from '../../models';

export const setIgnoreMe = async (message, io) => {
  const activity = [];
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
      const activityA = await db.activity.create({
        type: 'ignoreme_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(activityA);
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
    const preActivity = await db.activity.create({
      type: 'ignoreme_s',
      earnerId: user.id,
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
    });
    activity.unshift(finalActivity);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
    message.channel.send('something went wrong');
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
