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
    settings,
    queue,
  );

  discordRouter(
    discordClient,
    queue,
    io,
    settings,
  );

  telegramRouter(
    telegramClient,
    queue,
    io,
    settings,
  );

  matrixRouter(
    matrixClient,
    queue,
    io,
    settings,
  );
};
