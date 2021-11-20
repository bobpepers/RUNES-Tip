/* eslint-disable import/prefer-default-export */
import {
  warnDirectMessage,
  helpMessage,
} from '../../messages/discord';
import db from '../../models';

export const discordHelp = async (message, io) => {
  if (message.channel.type === 'DM') {
    message.author.send({ embeds: [helpMessage] });
  }
  if (message.channel.type === 'GUILD_TEXT') {
    message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Help')] });
    message.author.send({ embeds: [helpMessage] });
  }

  let activity;
  const user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
    },
  });

  if (!user) {
    return;
  }

  activity = await db.activity.create({
    type: 'help',
    earnerId: user.id,
  });

  activity = await db.activity.findOne({
    where: {
      id: activity.id,
    },
    include: [
      {
        model: db.user,
        as: 'earner',
      },
    ],
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });

  return true;
};
