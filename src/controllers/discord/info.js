/* eslint-disable import/prefer-default-export */
import {
  warnDirectMessage,
  coinInfoMessage,
} from '../../messages/discord';
import db from '../../models';

export const discordCoinInfo = async (
  message,
  io,
) => {
  const blockHeight = await db.block.findOne({
    order: [['id', 'DESC']],
  });
  const priceInfo = await db.priceInfo.findOne({
    order: [['id', 'ASC']],
  });
  if (message.channel.type === 'DM') {
    message.author.send({ embeds: [coinInfoMessage(blockHeight.id, priceInfo)] }).catch((e) => {
      console.log(e);
    });
  }
  if (message.channel.type === 'GUILD_TEXT') {
    message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Coin Info')] });
    message.author.send({ embeds: [coinInfoMessage(blockHeight.id, priceInfo)] }).catch((e) => {
      console.log(e);
    });
  }
  const activity = [];
  const user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
    },
  });
  const preActivity = await db.activity.create({
    type: 'info',
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
