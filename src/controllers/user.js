import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');
/**
 * Fetch Wallet
 */
export const createUpdateUser = async (ctx) => {
  console.log('32111');
  console.log(ctx);
  console.log(ctx.update.message.from);
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
          console.log('adress not found');
          const newAddress = await getInstance().getNewAddress();
          console.log(newAddress);
          address = await db.address.create({
            address: newAddress,
            walletId: wallet.id,
            type: 'deposit',
            confirmed: true,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          ctx.reply(`Welcome ${ctx.update.message.from.username}, we created a wallet for you.
Type "/runestip help" for usage info`);
        }
      }

      t.afterCommit(() => {
        console.log('done');
        //ctx.reply(`done`);
      });
    }).catch((err) => {
      console.log(err.message);
    });

    // Explicit usage

    //ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

    // Using context shortcut
    
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
    console.log(err.message);
  });
};

/**
 * Fetch Wallet
 */
export const dbsync = async (req, res, next) => {
  db.sequelize.sync().then(() => {
    res.status(201).json({ message: 'Tables Created' });
  });
};
