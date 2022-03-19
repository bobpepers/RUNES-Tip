import { Transaction } from "sequelize";
import db from '../../models';
import logger from "../../helpers/logger";

import { getInstance } from "../../services/rclient";
import getCoinSettings from '../../config/settings';
import { matrixWelcomeMessage } from '../../messages/matrix';

const settings = getCoinSettings();

export const createUpdateMatrixUser = async (
  message,
  matrixClient,
  queue,
) => {
  await queue.add(async () => {
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      let user = await db.user.findOne(
        {
          where: {
            user_id: `matrix-${message.sender.userId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!user) {
        user = await db.user.create({
          user_id: `matrix-${message.sender.userId}`,
          username: `${message.sender.name}`,
          firstname: '',
          lastname: '',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (user) {
        if (user.username !== `${message.sender.name}`) {
          user = await user.update(
            {
              username: `${message.sender.name}`,
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
          console.log("created wallet");
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
          console.log('created address');
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
            console.log("added address");
          }
          await matrixClient.sendEvent(
            message.event.room_id,
            "m.room.message",
            matrixWelcomeMessage(user.username),
          );
        }
      }

      t.afterCommit(() => {
        console.log('done');
        // ctx.reply(`done`);
      });
    }).catch(async (err) => {
      try {
        await db.error.create({
          type: 'createUser',
          error: `${err}`,
        });
      } catch (e) {
        logger.error(`Error Matrix: ${e}`);
      }
      console.log(err.message);
    });
    return true;
  });
};

export const updateMatrixLastSeen = async (
  matrixClient,
  message,
) => {
  let updatedUser;
  let currentRoom;
  let guildId;

  console.log(message.sender);
  console.log('senderrrrr');

  try {
    currentRoom = await matrixClient.getRoom(message.event.room_id);
  } catch (e) {
    console.log(e);
  }

  if (currentRoom) {
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      const user = await db.user.findOne(
        {
          where: {
            user_id: `matrix-${message.sender.userId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      const group = await db.group.findOne(
        {
          where: {
            groupId: `matrix-${currentRoom.roomId}`,
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
    }).catch(async (err) => {
      try {
        await db.error.create({
          type: 'updateUser',
          error: `${err}`,
        });
      } catch (e) {
        logger.error(`Error Matrix: ${e}`);
      }
      console.log(err.message);
    });
  }

  return updatedUser;
};
