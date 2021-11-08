import db from '../../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../../services/rclient');
/**
 * Fetch Wallet
 */
export const updateGroup = async (ctx) => {
  console.log('updateGroup');
  console.log(ctx);
  console.log(ctx.update.message.from);
  console.log(ctx.update.message.chat);
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('find group');
    let group = await db.group.findOne(
      {
        where: {
          groupId: `telegram-${ctx.update.message.chat.id}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    console.log(group);
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

  // Explicit usage

  // ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

  // Using context shortcut
};

/**
 * Fetch Wallet
 */
export const dbsync = async (req, res, next) => {
  db.sequelize.sync().then(() => {
    res.status(201).json({ message: 'Tables Created' });
  });
};
