/* eslint-disable import/prefer-default-export */
import { warnDirectMessage, helpMessage } from '../../messages/discord';

export const discordHelp = (message) => {
  if (message.channel.type === 'DM') {
    message.author.send({ embeds: [helpMessage] });
  }
  if (message.channel.type === 'GUILD_TEXT') {
    message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Help')] });
    message.author.send({ embeds: [helpMessage] });
  }
  return true;
};
