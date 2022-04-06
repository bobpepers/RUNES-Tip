/* eslint-disable import/prefer-default-export */
import {
  featureDisabledChannelMessage,
  featureDisabledServerMessage,
  featureDisabledGlobalMessage,
  settingsNotFoundMessage,
} from '../../messages/matrix';
import db from '../../models';
import { capitalize } from '../../helpers/utils';

export const matrixFeatureSettings = async (
  matrixClient,
  message,
  name,
  groupId = null,
  channelId = null,
) => {
  console.log(message);
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
    await matrixClient.sendEvent(
      message.event.room_id,
      "m.room.message",
      settingsNotFoundMessage(capitalize(name)),
    );
    return false;
  }

  if (!setting.enabled && setting.channelId) {
    await matrixClient.sendEvent(
      message.event.room_id,
      "m.room.message",
      featureDisabledChannelMessage(capitalize(name)),
    );
    return false;
  }
  if (!setting.enabled && setting.groupId) {
    await matrixClient.sendEvent(
      message.event.room_id,
      "m.room.message",
      featureDisabledServerMessage(capitalize(name)),
    );
    return false;
  }
  if (!setting.enabled) {
    await matrixClient.sendEvent(
      message.event.room_id,
      "m.room.message",
      featureDisabledGlobalMessage(capitalize(name)),
    );
    return false;
  }
  console.log(setting);
  return setting;
};
