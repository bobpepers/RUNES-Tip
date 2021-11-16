import { Transaction, Op } from "sequelize";
import db from '../../models';
import { welcomeMessage } from '../../messages/telegram';

import { getInstance } from "../../services/rclient";

export const createUpdateUser = async (ctx) => {
  if (!ctx.update.message.from.is_bot) {
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      let user = await db.user.findOne(
        {
          where: {
            user_id: `telegram-${ctx.update.message.from.id}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      console.log(user);
      if (!user) {
        user = await db.user.create({
          user_id: `telegram-${ctx.update.message.from.id}`,
          username: ctx.update.message.from.username,
          firstname: ctx.update.message.from.first_name,
          lastname: ctx.update.message.from.last_name,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (user) {
        if (user.firstname !== ctx.update.message.from.first_name) {
          user = await user.update(
            {
              firstname: ctx.update.message.from.first_name,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        if (user.lastname !== ctx.update.message.from.last_name) {
          user = await user.update(
            {
              lastname: ctx.update.message.from.last_name,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        if (user.username !== ctx.update.message.from.username) {
          user = await user.update(
            {
              username: ctx.update.message.from.username,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        let wallet = await db.wallet.findOne(
          {
            where: {
              userId: user.id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        if (!wallet) {
          wallet = await db.wallet.create({
            userId: user.id,
            available: 0,
            locked: 0,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        let address = await db.address.findOne(
          {
            where: {
              walletId: wallet.id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        if (!address) {
          const newAddress = await getInstance().getNewAddress();
          address = await db.address.create({
            address: newAddress,
            walletId: wallet.id,
            type: 'deposit',
            confirmed: true,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          ctx.reply(welcomeMessage(ctx));
        }
      }

      t.afterCommit(() => {
        console.log('done');
      });
    }).catch((err) => {
      console.log(err);
    });
  }
};

export const updateLastSeen = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne(
      {
        where: {
          user_id: `telegram-${ctx.update.message.from.id}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    const group = await db.group.findOne(
      {
        where: {
          groupId: `telegram-${ctx.update.message.chat.id}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    const active = await db.active.findOne(
      {
        where: {
          userId: user.id,
          groupId: group.id,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    if (group) {
      if (user) {
        if (active) {
          const updatedActive = await active.update(
            {
              lastSeen: new Date(Date.now()),
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        if (!active) {
          const updatedActive = await db.active.create(
            {
              groupId: group.id,
              userId: user.id,
              lastSeen: new Date(Date.now()),
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
      }
    }
    console.log(user);
    if (user) {
      const updatedUser = await user.update(
        {
          lastSeen: new Date(Date.now()),
        },
        {
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
  });
};
