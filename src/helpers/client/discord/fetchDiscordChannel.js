import {
  InteractionType,
  ChannelType,
} from "discord.js";

export const fetchDiscordChannel = async (
  discordClient,
  message,
) => {
  let discordChannel;
  let discordUserDMChannel;

  if (message.channel.type === ChannelType.DM) {
    discordChannel = await discordClient.channels.cache.get(message.channelId);
    discordUserDMChannel = await discordClient.channels.cache.get(message.channelId);
  }
  if (message.channel.type === ChannelType.GuildText) {
    discordChannel = await discordClient.channels.cache.get(message.channelId);
    if (message.type && message.type === InteractionType.ApplicationCommand) {
      discordUserDMChannel = await discordClient.users.cache.get(message.user.id);
    } else {
      discordUserDMChannel = await discordClient.users.cache.get(message.author.id);
    }
  }

  return [
    discordChannel,
    discordUserDMChannel,
  ];
};
