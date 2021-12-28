import { discordRouter } from './discord';
import { telegramRouter } from './telegram';
import { notifyRouter } from './notify';

export const router = (
  app,
  discordClient,
  telegramClient,
  io,
  settings,
  queue,
) => {
  notifyRouter(
    app,
    discordClient,
    telegramClient,
    settings,
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
};
