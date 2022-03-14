import { config } from "dotenv";
import { fetchWalletBalance } from '../controllers/telegram/balance';
import { fetchWalletDepositAddress } from '../controllers/telegram/deposit';
import { withdrawTelegramCreate } from '../controllers/telegram/withdraw';
import { tipRunesToUser } from '../controllers/telegram/tip';
import { rainRunesToUsers } from '../controllers/telegram/rain';

import {
  updateLastSeen,
  createUpdateUser,
} from '../controllers/telegram/user';

import {
  updateGroup,
} from '../controllers/telegram/group';

import {
  fetchHelp,
} from '../controllers/telegram/help';
import {
  telegramFaucetClaim,
} from '../controllers/telegram/faucet';

import {
  fetchReferralCount,
  createReferral,
  fetchReferralTopTen,
} from '../controllers/telegram/referral';

import fetchPriceInfo from '../controllers/telegram/price';

import {
  fetchInfo,
} from '../controllers/telegram/info';
import getCoinSettings from '../config/settings';
import { telegramSettings } from '../controllers/telegram/settings';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';

const settings = getCoinSettings();

// import logger from "../helpers/logger";

config();

const runesGroup = process.env.TELEGRAM_RUNES_GROUP;

export const telegramRouter = (
  telegramClient,
  queue,
  io,
  settings,
) => {
  telegramClient.command('help', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const task = await fetchHelp(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('price', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchPriceInfo(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Price', (ctx) => {
    console.log(ctx);
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const task = await fetchPriceInfo(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('faucet', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await telegramFaucetClaim(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('Faucet', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await telegramFaucetClaim(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('info', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchInfo(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Info', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchInfo(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('balance', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Balance', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('tip', async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    await queue.add(() => maintenance);
    if (maintenance.maintenance || !maintenance.enabled) return;
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('insufficient Arguments');
    }
    if (!filteredMessageTelegram[2]) {
      ctx.reply('insufficient Arguments');
    }
    if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const groupTaskId = groupTask && groupTask.id;
        const setting = await telegramSettings(ctx, 'tip', groupTaskId);
        await queue.add(() => setting);
        if (!setting) return;
        const tipAmount = filteredMessageTelegram[2];
        const tipTo = filteredMessageTelegram[1];
        if (groupTask) {
          const task = await tipRunesToUser(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, groupTask, setting);
          await queue.add(() => task);
        }
      })();
    }
  });

  telegramClient.command('rain', async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    await queue.add(() => maintenance);
    if (maintenance.maintenance || !maintenance.enabled) return;
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('invalid amount of arguments');
    }
    if (filteredMessageTelegram[1]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const groupTaskId = groupTask && groupTask.id;
        const setting = await telegramSettings(ctx, 'rain', groupTaskId);
        await queue.add(() => setting);
        if (!setting) return;
        console.log(setting);
        const rainAmount = filteredMessageTelegram[1];
        const task = await rainRunesToUsers(ctx, rainAmount, telegramClient, runesGroup, io, setting);
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.command('deposit', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Deposit', (ctx) => {
    (async () => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('withdraw', async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    await queue.add(() => maintenance);
    if (maintenance.maintenance || !maintenance.enabled) return;
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('insufficient Arguments');
      return;
    }
    if (!filteredMessageTelegram[2]) {
      ctx.reply('insufficient Arguments');
      return;
    }

    const groupTask = await updateGroup(ctx);
    await queue.add(() => groupTask);
    const groupTaskId = groupTask && groupTask.id;
    const setting = await telegramSettings(ctx, 'withdraw', groupTaskId);
    await queue.add(() => setting);
    if (!setting) return;
    const withdrawalAddress = filteredMessageTelegram[1];
    const withdrawalAmount = filteredMessageTelegram[2];
    console.log('before withdrawal create');
    const task = await withdrawTelegramCreate(
      ctx,
      withdrawalAddress,
      withdrawalAmount,
      io,
      setting,
    );
    await queue.add(() => task);
  });

  if (settings.coin.setting === 'Runebase') {
    telegramClient.command('referral', (ctx) => {
      (async () => {
        const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
        await queue.add(() => maintenance);
        if (maintenance.maintenance || !maintenance.enabled) return;
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    });

    telegramClient.action('Referral', (ctx) => {
      (async () => {
        const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
        await queue.add(() => maintenance);
        if (maintenance.maintenance || !maintenance.enabled) return;
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.callback_query.from.id;
        const telegramUserName = ctx.update.callback_query.from.username;
        const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    });

    telegramClient.command('top', (ctx) => {
      (async () => {
        const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
        await queue.add(() => maintenance);
        if (maintenance.maintenance || !maintenance.enabled) return;
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchReferralTopTen(ctx);
        await queue.add(() => task);
      })();
    });

    telegramClient.action('ReferralTop', (ctx) => {
      (async () => {
        const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
        await queue.add(() => maintenance);
        if (maintenance.maintenance || !maintenance.enabled) return;
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchReferralTopTen(ctx);
        await queue.add(() => task);
      })();
    });
  }

  telegramClient.on('new_chat_members', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
      if (settings.coin.setting === 'Runebase') {
        if (ctx.update.message.chat.id === Number(runesGroup)) {
          const taskReferred = await createReferral(ctx, telegramClient, runesGroup);
          await queue.add(() => taskReferred);
        }
      }
    })();
  });

  telegramClient.on('text', async (ctx) => {
    const groupTask = await updateGroup(ctx);
    await queue.add(() => groupTask);
    const task = await createUpdateUser(ctx);
    await queue.add(() => task);
    const lastSeenTask = await updateLastSeen(ctx);
    await queue.add(() => lastSeenTask);

    const preFilteredMessageTelegram = ctx.update.message.text.split(' ');
    const filteredMessageTelegram = preFilteredMessageTelegram.filter((el) => el !== '');
    const telegramUserId = ctx.update.message.from.id;
    const telegramUserName = ctx.update.message.from.username;
    // console.log(filteredMessageTelegram);
    if (filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram) {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      if (!filteredMessageTelegram[1]) {
        const task = await fetchHelp(ctx, io);
        await queue.add(() => task);
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'price') {
        const task = await fetchPriceInfo(ctx, io);
        await queue.add(() => task);
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'info') {
        const task = await fetchInfo(ctx);
        await queue.add(() => task);
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'help') {
        const task = await fetchHelp(ctx, io);
        await queue.add(() => task);
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'faucet') {
        const task = await telegramFaucetClaim(ctx, io);
        await queue.add(() => task);
      }
      if (settings.coin.setting === 'Runebase') {
        if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2]) {
          const task = await fetchReferralCount(
            ctx,
            telegramUserId,
            telegramUserName,
          );
          await queue.add(() => task);
        }
        if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top') {
          const task = await fetchReferralTopTen(ctx);
          await queue.add(() => task);
        }
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'balance') {
        const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName, io);
        await queue.add(() => task);
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'deposit') {
        const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName, io);
        await queue.add(() => task);
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'withdraw') {
        if (!filteredMessageTelegram[2]) {
          ctx.reply('insufficient Arguments');
          return;
        }
        if (!filteredMessageTelegram[3]) {
          ctx.reply('insufficient Arguments');
          return;
        }
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const groupTaskId = groupTask && groupTask.id;
        const setting = await telegramSettings(ctx, 'withdraw', groupTaskId);
        await queue.add(() => setting);
        if (!setting) return;
        const withdrawalAddress = filteredMessageTelegram[2];
        const withdrawalAmount = filteredMessageTelegram[3];
        const task = await withdrawTelegramCreate(
          ctx,
          withdrawalAddress,
          withdrawalAmount,
          io,
          setting,
        );
        await queue.add(() => task);
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'tip') {
        if (!filteredMessageTelegram[2]) {
          ctx.reply('insufficient Arguments');
          return;
        }
        if (!filteredMessageTelegram[3]) {
          ctx.reply('insufficient Arguments');
          return;
        }

        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const groupTaskId = groupTask && groupTask.id;
        const setting = await telegramSettings(ctx, 'tip', groupTaskId);
        await queue.add(() => setting);
        if (!setting) return;
        const tipAmount = filteredMessageTelegram[3];
        const tipTo = filteredMessageTelegram[2];
        if (groupTask) {
          const task = await tipRunesToUser(
            ctx,
            tipTo,
            tipAmount,
            telegramClient,
            runesGroup,
            io,
            groupTask,
            setting,
          );
          await queue.add(() => task);
        }
      }
      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'rain') {
        if (!filteredMessageTelegram[2]) {
          ctx.reply('invalid amount of arguments');
          return;
        }
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const groupTaskId = groupTask.id;
        const setting = await telegramSettings(ctx, 'rain', groupTaskId);
        await queue.add(() => setting);
        if (!setting) return;
        const rainAmount = filteredMessageTelegram[2];
        const task = await rainRunesToUsers(
          ctx,
          rainAmount,
          telegramClient,
          runesGroup,
          io,
          setting,
        );
        await queue.add(() => task);
      }
    }
  });

  telegramClient.on('message', async (ctx) => {
    const groupTask = await updateGroup(ctx);
    await queue.add(() => groupTask);
    const task = await createUpdateUser(ctx);
    await queue.add(() => task);
    const lastSeenTask = await updateLastSeen(ctx);
    await queue.add(() => lastSeenTask);
  });
};
