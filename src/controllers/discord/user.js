import { Transaction } from "sequelize";
import db from '../../models';
import logger from "../../helpers/logger";

import { getInstance } from "../../services/rclient";
import getCoinSettings from '../../config/settings';

import {
  discordWelcomeMessage,
} from '../../messages/discord';

const settings = getCoinSettings();

export const createUpdateDiscordUser = async (
  discordClient,
  userInfo,
  queue,
) => {
  await queue.add(async () => {
    let newAccount = false;
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      let user = await db.user.findOne(
        {
          where: {
            user_id: `discord-${userInfo.id}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!user) {
        user = await db.user.create({
          user_id: `discord-${userInfo.id}`,
          username: `${userInfo.username}#${userInfo.discriminator}`,
          firstname: '',
          lastname: '',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (user) {
        if (user.username !== `${userInfo.username}#${userInfo.discriminator}`) {
          user = await user.update(
            {
              username: `${userInfo.username}#${userInfo.discriminator}`,
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
          newAccount = true;
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
        }
      }

      t.afterCommit(async () => {
        if (newAccount) {
          const userClient = await discordClient.users.fetch(userInfo.id).catch((e) => {
            console.log(e);
          });
          if (userClient) {
            await userClient.send({
              embeds: [discordWelcomeMessage(userInfo)],
            }).catch((e) => {
              console.log(e);
            });
          }
        }
      });
    }).catch(async (err) => {
      try {
        await db.error.create({
          type: 'createUser',
          error: `${err}`,
        });
      } catch (e) {
        logger.error(`Error Discord: ${e}`);
      }
      console.log(err.message);
    });
    return true;
  });
};

export const updateDiscordLastSeen = async (
  message,
  userInfo,
) => {
  let updatedUser;
  let guildId;

  if (message.guild && message.guild.id) {
    guildId = message.guild.id;
  } else if (message.guildId) {
    guildId = message.guildId;
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne(
      {
        where: {
          user_id: `discord-${userInfo.id}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    if (guildId) {
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
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'updateUser',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err.message);
  });

  return updatedUser;
};
