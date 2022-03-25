import db from '../models';

import {
  matrixBotDisabledMessage,
  matrixBotMaintenanceMessage,
} from '../messages/matrix';

import {
  telegramBotDisabledMessage,
  telegramBotMaintenanceMessage,
} from '../messages/telegram';

import {
  discordBotMaintenanceMessage,
  discordBotDisabledMessage,
} from '../messages/discord';

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
      await message.reply({
        embeds: [discordBotDisabledMessage()],
      }).catch((e) => {
        console.log(e);
      });
    } else if (botSetting.maintenance) {
      await message.reply({
        embeds: [discordBotMaintenanceMessage()],
      }).catch((e) => {
        console.log(e);
      });
    }
  }

  if (side === 'telegram') {
    if (!botSetting.enabled) {
      try {
        await message.replyWithHTML(
          await telegramBotDisabledMessage(),
        );
      } catch (e) {
        console.log(e);
      }
    } else if (botSetting.maintenance) {
      try {
        await message.replyWithHTML(
          await telegramBotMaintenanceMessage(),
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  if (side === 'matrix') {
    if (!botSetting.enabled) {
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
    }
  }
  return botSetting;
};
