import db from '../models';

import {
  matrixBotDisabledMessage,
  matrixBotMaintenanceMessage,
} from '../messages/matrix';

export const isMaintenanceOrDisabled = async (
  message,
  side,
  matrixClient = null,
) => {
  const botSetting = await db.bots.findOne({
    where: {
      name: side,
    },
  });

  if (side === 'discord') {
    if (!botSetting.enabled) {
      message.reply('Discord tipbot disabled');
    } else if (botSetting.maintenance) {
      message.reply('Discord tipbot maintenance');
    }
  }

  if (side === 'telegram') {
    if (!botSetting.enabled) {
      message.reply('Telegram tipbot disabled');
    } else if (botSetting.maintenance) {
      message.reply('Telegram tipbot maintenance');
    }
  }

  if (side === 'matrix') {
    if (!botSetting.enabled) {
      // message.reply('Telegram tipbot disabled');
      await matrixClient.sendEvent(
        message.event.room_id,
        "m.room.message",
        matrixBotDisabledMessage(),
        "123",
      );
    } else if (botSetting.maintenance) {
      await matrixClient.sendEvent(
        message.event.room_id,
        "m.room.message",
        matrixBotMaintenanceMessage(),
        "123",
      );
      // message.reply('Telegram tipbot maintenance');
    }
  }
  return botSetting;
};
