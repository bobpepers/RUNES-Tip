import db from '../models';

export const isMaintenanceOrDisabled = async (message, side) => {
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
  return botSetting;
};
