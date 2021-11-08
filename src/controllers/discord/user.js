import db from '../../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../../services/rclient');
/**
 * Fetch Wallet
 */
export const createUpdateDiscordUser = async (message) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let user = await db.user.findOne(
      {
        where: {
          user_id: `discord-${message.author.id}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    if (!user) {
      user = await db.user.create({
        user_id: `discord-${message.author.id}`,
        username: `${message.author.username}#${message.author.discriminator}`,
        firstname: '',
        lastname: '',
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (user) {
      if (user.username !== `${message.author.username}#${message.author.discriminator}`) {
        user = await user.update(
          {
            username: `${message.author.username}#${message.author.discriminator}`,
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
        message.author.send(`Welcome ${message.author.username}, we created a wallet for you.
Type "${process.env.DISCORD_BOT_COMMAND} help" for usage info`);
        // ctx.reply(``);
      }
    }

    t.afterCommit(() => {
      console.log('done');
      // ctx.reply(`done`);
    });
  }).catch((err) => {
    console.log(err.message);
  });
};

export const updateDiscordLastSeen = async (client, message) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne(
      {
        where: {
          user_id: `discord-${message.author.id}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    const group = await db.group.findOne(
      {
        where: {
          groupId: `discord-${message.guildId}`,
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
