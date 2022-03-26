/* eslint-disable import/prefer-default-export */
import {
  featureDisabledChannelMessage,
  featureDisabledServerMessage,
  featureDisabledGlobalMessage,
} from '../../messages/discord';
import db from '../../models';

export const discordSettings = async (
  message,
  name,
  groupId = null,
  channelId = null,
) => {
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
    await message.channel.send('settings not found').catch((e) => {
      console.log(e);
    });
    return false;
  }
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1); // Upper case first letter

  if (!setting.enabled && setting.channelId) {
    await message.channel.send({
      embeds: [
        featureDisabledChannelMessage(
          capitalize(name),
        ),
      ],
    }).catch((e) => {
      console.log(e);
    });
    return false;
  }
  if (!setting.enabled && setting.groupId) {
    await message.channel.send({
      embeds: [
        featureDisabledServerMessage(
          capitalize(name),
        ),
      ],
    }).catch((e) => {
      console.log(e);
    });
    return false;
  }
  if (!setting.enabled) {
    await message.channel.send({
      embeds: [
        featureDisabledGlobalMessage(
          capitalize(name),
        ),
      ],
    }).catch((e) => {
      console.log(e);
    });
    return false;
  }
  // console.log(setting);
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
