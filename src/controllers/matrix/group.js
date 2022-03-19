/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import logger from "../../helpers/logger";

export const updateMatrixGroup = async (
  matrixClient,
  message,
) => {
  let currentRoom;
  let group;

  try {
    currentRoom = await matrixClient.getRoom(message.event.room_id);
  } catch (e) {
    console.log(e);
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (currentRoom) {
      group = await db.group.findOne(
        {
          where: {
            groupId: `matrix-${currentRoom.roomId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!group) {
        group = await db.group.create({
          groupId: `matrix-${currentRoom.roomId}`,
          groupName: currentRoom && currentRoom.name ? currentRoom.name : '',
          lastActive: Date.now(),
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (group) {
        group = await group.update(
          {
            groupName: currentRoom && currentRoom.name ? currentRoom.name : '',
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
      console.log('Update Group transaction done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'group',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error matrix: ${e}`);
    }
    logger.error(`matrix error: ${err}`);
    console.log(err.message);
  });
  return group;
};
