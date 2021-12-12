/* eslint-disable import/prefer-default-export */
import {
  featureDisabledServerMessage,
  featureDisabledGlobalMessage,
} from '../../messages/telegram';
import db from '../../models';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1); // Upper case first letter

export const telegramSettings = async (ctx, name, groupId = null) => {
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
    ctx.reply('settings not found');
    return false;
  }

  if (!setting.enabled && setting.groupId) {
    ctx.reply(featureDisabledServerMessage());
    return false;
  }
  if (!setting.enabled) {
    ctx.reply(featureDisabledGlobalMessage());
    return false;
  }
  // console.log(setting);
  return setting;
};
