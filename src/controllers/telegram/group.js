/* eslint-disable import/prefer-default-export */
import db from '../../models';

import { Transaction } from "sequelize";

export const updateGroup = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let group = await db.group.findOne(
      {
        where: {
          groupId: `telegram-${ctx.update.message.chat.id}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    if (!group) {
      group = await db.group.create({
        groupId: `telegram-${ctx.update.message.chat.id}`,
        groupName: ctx.update.message.chat.title,
        lastActive: Date.now(),
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (group) {
      group = await group.update(
        {
          groupName: ctx.update.message.chat.title,
          lastActive: Date.now(),
        },
        {
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
    }

    t.afterCommit(() => {
      console.log('done');
      // ctx.reply(`done`);
    });
  }).catch((err) => {
    console.log(err.message);
  });
};
