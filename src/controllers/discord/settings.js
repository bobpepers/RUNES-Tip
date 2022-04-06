/* eslint-disable import/prefer-default-export */
import {
  featureDisabledChannelMessage,
  featureDisabledServerMessage,
  featureDisabledGlobalMessage,
} from '../../messages/discord';
import db from '../../models';
import { capitalize } from '../../helpers/utils';

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
  return setting;
};

export const discordwaterFaucetSettings = async (
  groupId = null,
  channelId = null,
  t = null,
) => {
  let setting;
  setting = await db.features.findOne({
    where: {
      type: 'local',
      name: 'faucet',
      groupId,
      channelId,
    },
    ...(
      t && {
        lock: t.LOCK.UPDATE,
        transaction: t,
      }
    ),
  });
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'local',
        name: 'faucet',
        groupId,
        channelId: null,
      },
      ...(
        t && {
          lock: t.LOCK.UPDATE,
          transaction: t,
        }
      ),
    });
  }
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'global',
        name: 'faucet',
      },
      ...(
        t && {
          lock: t.LOCK.UPDATE,
          transaction: t,
        }
      ),
    });
  }

  return setting;
};
