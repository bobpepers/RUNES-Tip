/* eslint-disable import/prefer-default-export */
import {
  featureDisabledServerMessage,
  featureDisabledGlobalMessage,
} from '../../messages/telegram';
import db from '../../models';

export const telegramSettings = async (
  ctx,
  name,
  groupId = null,
) => {
  let setting;

  setting = await db.features.findOne({
    where: {
      type: 'local',
      name,
      groupId,
      channelId: null,
    },
  });

  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'global',
        name,
      },
    });
  }
  if (!setting) {
    try {
      await ctx.reply('settings not found');
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  if (!setting.enabled && setting.groupId) {
    try {
      await ctx.replyWithHTML(
        await featureDisabledServerMessage(),
      );
    } catch (e) {
      console.log(e);
    }
    return false;
  }
  if (!setting.enabled) {
    try {
      await ctx.replyWithHTML(
        await featureDisabledGlobalMessage(),
      );
    } catch (e) {
      console.log(e);
    }
    return false;
  }
  return setting;
};

export const telegramWaterFaucetSettings = async (
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
