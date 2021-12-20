/* eslint-disable import/prefer-default-export */
import {
  featureDisabledChannelMessage,
  featureDisabledServerMessage,
  featureDisabledGlobalMessage,
} from '../../messages/discord';
import db from '../../models';

export const discordSettings = async (message, name, groupId = null, channelId = null) => {
  console.log(name);
  console.log(groupId);
  console.log(channelId);
  let setting;
  setting = await db.features.findOne({
    where: {
      type: 'local',
      name,
      groupId,
      channelId,
    },
  });
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'local',
        name,
        groupId,
        channelId: null,
      },
    });
  }
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'global',
        name,
      },
    });
  }
  if (!setting) {
    message.channel.send('settings not found');
    return false;
  }
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1); // Upper case first letter

  if (!setting.enabled && setting.channelId) {
    message.channel.send({ embeds: [featureDisabledChannelMessage(capitalize(name))] });
    return false;
  }
  if (!setting.enabled && setting.groupId) {
    message.channel.send({ embeds: [featureDisabledServerMessage(capitalize(name))] });
    return false;
  }
  if (!setting.enabled) {
    message.channel.send({ embeds: [featureDisabledGlobalMessage(capitalize(name))] });
    return false;
  }
  console.log(setting);
  return setting;
};

export const discordwaterFaucetSettings = async (
  groupId = null,
  channelId = null,
) => {
  let setting;
  setting = await db.features.findOne({
    where: {
      type: 'local',
      name: 'faucet',
      groupId,
      channelId,
    },
  });
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'local',
        name: 'faucet',
        groupId,
        channelId: null,
      },
    });
  }
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'global',
        name: 'faucet',
      },
    });
  }

  return setting;
};
