/* eslint-disable import/prefer-default-export */
import {
  warnDirectMessage,
  helpMessage,
} from '../../messages/matrix';
import db from '../../models';

export const matrixHelp = async (
  matrixClient,
  message,
  userDirectMessageRoomId,
  io,
) => {
  const withdraw = await db.features.findOne(
    {
      where: {
        type: 'global',
        name: 'withdraw',
      },
    },
  );

  if (message.sender.roomId === userDirectMessageRoomId) {
    try {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        helpMessage(),
      );
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        warnDirectMessage(message.sender.name, 'Help'),
      );
    } catch (e) {
      console.log(e);
    }
    try {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        helpMessage(),
      );
    } catch (e) {
      console.log(e);
    }
  }

  const activity = [];
  const user = await db.user.findOne({
    where: {
      user_id: `matrix-${message.sender.userId}`,
    },
  });

  if (!user) {
    return;
  }

  const preActivity = await db.activity.create({
    type: 'help',
    earnerId: user.id,
  });

  const finalActivity = await db.activity.findOne({
    where: {
      id: preActivity.id,
    },
    include: [
      {
        model: db.user,
        as: 'earner',
      },
    ],
  });
  activity.unshift(finalActivity);
  io.to('admin').emit('updateActivity', {
    activity,
  });

  return true;
};
