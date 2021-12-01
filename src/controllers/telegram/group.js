/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';

export const updateGroup = async (ctx) => {
  let group;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (ctx.update.message.chat.id === ctx.update.message.from.id) {
      return;
    }
    group = await db.group.findOne(
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
  return group;
};
