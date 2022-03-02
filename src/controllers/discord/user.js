import { Transaction } from "sequelize";
import db from '../../models';

import { getInstance } from "../../services/rclient";
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

export const createUpdateDiscordUser = async (
  message,
  queue,
) => {
  await queue.add(async () => {
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
          const newAddress = await getInstance().getNewAddress();
          const addressAlreadyExist = await db.address.findOne(
            {
              where: {
                address: newAddress,
              },
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
          if (!addressAlreadyExist) {
            address = await db.address.create({
              address: newAddress,
              walletId: wallet.id,
              type: 'deposit',
              confirmed: true,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
          }
          message.author.send(`Welcome ${message.author.username}, we created a wallet for you.
Type "${settings.bot.command.discord} help" for usage info`);
        }
      }

      t.afterCommit(() => {
        console.log('done');
        // ctx.reply(`done`);
      });
    }).catch((err) => {
      console.log(err.message);
    });
    return true;
  });
};

export const updateDiscordLastSeen = async (client, message) => {
  let updatedUser;
  let guildId;
  if (message.guildId) {
    guildId = message.guildId;
  }
  if (guildId) {
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
            groupId: `discord-${guildId}`,
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
        updatedUser = await user.update(
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
  }

  return updatedUser;
};
