import { discordRouter } from './discord';
import { telegramRouter } from './telegram';
import { matrixRouter } from './matrix';
import { notifyRouter } from './notify';

export const router = (
  app,
  discordClient,
  telegramClient,
  matrixClient,
  io,
  settings,
  queue,
) => {
  notifyRouter(
    app,
    discordClient,
    telegramClient,
    matrixClient,
    io,
    settings,
    queue,
  );

  if (settings.bot.enabled.discord) {
    discordRouter(
      discordClient,
      queue,
      io,
      settings,
    );
  }

  if (settings.bot.enabled.telegram) {
    telegramRouter(
      telegramClient,
      queue,
      io,
      settings,
    );
  }

  if (settings.bot.enabled.matrix) {
    matrixRouter(
      matrixClient,
      queue,
      io,
      settings,
    );
  }
};
