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
  console.log(message.sender.roomId);
  console.log(userDirectMessageRoomId);
  if (message.sender.roomId === userDirectMessageRoomId) {
    await matrixClient.sendEvent(
      userDirectMessageRoomId,
      "m.room.message",
      helpMessage(),
    );
  } else {
    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      warnDirectMessage(message.sender.name, 'Help'),
    );
    await matrixClient.sendEvent(
      userDirectMessageRoomId,
      "m.room.message",
      helpMessage(),
    );
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
