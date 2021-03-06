/* eslint-disable import/prefer-default-export */
import {
  ChannelType,
} from 'discord.js';
import {
  warnDirectMessage,
  statsMessage,
} from '../../messages/discord';
import db from '../../models';

export const discordLeaderboard = async (
  message,
  io,
) => {
  const user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
    },
    include: [
      {
        model: db.reactdrop,
        as: 'reactdrops',
        required: false,
      },
      {
        model: db.flood,
        as: 'floods',
        required: false,
      },
    ],
  });
  console.log(user);
  if (!user) {
    return;
  }
  // const reactdrop = await db.reactdrop.find
  if (message.channel.type === ChannelType.DM) {
    message.author.send({ embeds: [statsMessage(message)] }).catch((e) => {
      console.log(e);
    });
  }
  if (message.channel.type === ChannelType.GuildText) {
    message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Help')] });
    message.author.send({ embeds: [statsMessage(message)] }).catch((e) => {
      console.log(e);
    });
  }

  let activity;

  // activity = await db.activity.create({
  //  type: 'help',
  //  earnerId: user.id,
  // });

  // activity = await db.activity.findOne({
  //  where: {
  // id: activity.id,
  // },
  //  include: [
  //  {
  //  model: db.user,
  //      as: 'earner',
  //     },
  //   ],
  // });
  // io.to('admin').emit('updateActivity', {
  //  activity,
  // });

  return true;
};
