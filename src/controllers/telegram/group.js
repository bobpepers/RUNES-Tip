/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';

export const updateGroup = async (ctx) => {
  let group;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let chatId;
    let chatTitle = '';
    if (
      ctx
      && ctx.update
      && ctx.update.callback_query
      && ctx.update.callback_query.from
      && ctx.update.callback_query.message
      && ctx.update.callback_query.message.chat
      && ctx.update.callback_query.from.id
      && ctx.update.callback_query.message.chat.id
      && ctx.update.callback_query.from.id === ctx.update.callback_query.message.chat.id
    ) {
      return;
    }

    if (
      ctx
      && ctx.update
      && ctx.update.message
      && ctx.update.message.from
      && ctx.update.message.chat
      && ctx.update.message.chat.id === ctx.update.message.from.id
    ) {
      return;
    }

    if (
      ctx
        && ctx.update
        && ctx.update.message
        && ctx.update.message.chat
        && ctx.update.message.chat.id
    ) {
      chatId = ctx.update.message.chat.id;
      chatTitle = ctx.update.message.chat.title;
    } else if (
      ctx
        && ctx.update
        && ctx.update.callback_query
        && ctx.update.callback_query.message
        && ctx.update.callback_query.message.chat
        && ctx.update.callback_query.message.chat.id
    ) {
      chatId = ctx.update.callback_query.message.chat.id;
      chatTitle = ctx.update.callback_query.message.chat.title;
    }

    if (chatId) {
      group = await db.group.findOne(
        {
          where: {
            groupId: `telegram-${chatId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!group) {
        group = await db.group.create({
          groupId: `telegram-${chatId}`,
          groupName: chatTitle,
          lastActive: Date.now(),
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (group) {
        group = await group.update(
          {
            groupName: chatTitle,
            lastActive: Date.now(),
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err.message);
  });
  return group;
};
