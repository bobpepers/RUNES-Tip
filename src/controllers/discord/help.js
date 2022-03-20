/* eslint-disable import/prefer-default-export */
import {
  warnDirectMessage,
  helpMessageOne,
  helpMessageTwo,
} from '../../messages/discord';
import db from '../../models';

export const discordHelp = async (message, io) => {
  const withdraw = await db.features.findOne(
    {
      where: {
        type: 'global',
        name: 'withdraw',
      },
    },
  );

  if (message.channel.type === 'DM') {
    await message.author.send({ embeds: [helpMessageOne(withdraw)] }).catch((e) => {
      console.log(e);
    });
    await message.author.send({ embeds: [helpMessageTwo(withdraw)] }).catch((e) => {
      console.log(e);
    });
  }
  if (message.channel.type === 'GUILD_TEXT') {
    await message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Help')] });
    await message.author.send({ embeds: [helpMessageOne(withdraw)] }).catch((e) => {
      console.log(e);
    });
    await message.author.send({ embeds: [helpMessageTwo(withdraw)] }).catch((e) => {
      console.log(e);
    });
  }

  const activity = [];
  const user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
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
