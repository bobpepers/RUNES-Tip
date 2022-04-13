import { config } from "dotenv";
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { fetchHelp } from '../controllers/telegram/help';
import { fetchInfo } from '../controllers/telegram/info';
import { telegramFaucetClaim } from '../controllers/telegram/faucet';
import { telegramBalance } from '../controllers/telegram/balance';
import { fetchWalletDepositAddress } from '../controllers/telegram/deposit';
import { withdrawTelegramCreate } from '../controllers/telegram/withdraw';
import { tipToTelegramUser } from '../controllers/telegram/tip';
import { telegramRain } from '../controllers/telegram/rain';
import { telegramFlood } from '../controllers/telegram/flood';
import { telegramSleet } from '../controllers/telegram/sleet';
import { telegramPrice } from '../controllers/telegram/price';
import { telegramFeeSchedule } from '../controllers/telegram/fees';
import { updateLastSeen, createUpdateUser } from '../controllers/telegram/user';
import { executeTipFunction } from '../helpers/client/telegram/executeTips';
import { disallowDirectMessage } from '../helpers/client/telegram/disallowDirectMessage';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';
import { myRateLimiter } from '../helpers/rateLimit';
import { updateGroup } from '../controllers/telegram/group';
import { telegramFeatureSettings } from '../controllers/telegram/settings';
import { waterFaucetSettings } from '../controllers/settings';
import {
  telegramUserBannedMessage,
  telegramServerBannedMessage,
} from '../messages/telegram';

// import {
//   fetchReferralCount,
//   // createReferral,
//   fetchReferralTopTen,
// } from '../controllers/telegram/referral';

// import getCoinSettings from '../config/settings';

// const settings = getCoinSettings();

config();

const storeSession = new StoreSession("telegram_session");

const telegramApiClient = new TelegramClient(
  storeSession,
  Number(process.env.TELEGRAM_API_ID),
  process.env.TELEGRAM_API_HASH,
  {
    connectionRetries: 5,
  },
);

// const runesGroup = process.env.TELEGRAM_RUNES_GROUP;

export const telegramRouter = async (
  telegramClient,
  queue,
  io,
  settings,
) => {
  await telegramApiClient.start({
    botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
    onError: (err) => console.log(err),
  });
  await telegramApiClient.session.save();
  await telegramApiClient.connect();

  telegramClient.command('help', async (ctx) => {
    let groupTask;
    let lastSeen;
    const maintenance = await isMaintenanceOrDisabled(
      ctx,
      'telegram',
    );
    if (maintenance.maintenance || !maintenance.enabled) return;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      lastSeen = await updateLastSeen(ctx);
      groupTask = await updateGroup(ctx);
    });
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Help',
    );
    if (limited) return;
    if (groupTask && groupTask.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramServerBannedMessage(
            groupTask,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }

    if (lastSeen && lastSeen.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramUserBannedMessage(
            lastSeen,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }
    await queue.add(async () => {
      const task = await fetchHelp(ctx, io);
    });
  });

  const priceCallBack = async (ctx) => {
    let groupTask;
    let lastSeen;
    const maintenance = await isMaintenanceOrDisabled(
      ctx,
      'telegram',
    );
    if (maintenance.maintenance || !maintenance.enabled) return;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      lastSeen = await updateLastSeen(ctx);
      groupTask = await updateGroup(ctx);
    });
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Price',
    );
    if (limited) return;
    if (groupTask && groupTask.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramServerBannedMessage(
            groupTask,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }

    if (lastSeen && lastSeen.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramUserBannedMessage(
            lastSeen,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }
    await queue.add(async () => {
      const task = await telegramPrice(ctx, io);
    });
  };

  const faucetCallBack = async (ctx) => {
    let groupTask;
    let lastSeen;
    const maintenance = await isMaintenanceOrDisabled(
      ctx,
      'telegram',
    );
    if (maintenance.maintenance || !maintenance.enabled) return;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      lastSeen = await updateLastSeen(ctx);
      groupTask = await updateGroup(ctx);
    });
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Faucet',
    );
    if (limited) return;
    if (groupTask && groupTask.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramServerBannedMessage(
            groupTask,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }

    if (lastSeen && lastSeen.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramUserBannedMessage(
            lastSeen,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }
    await queue.add(async () => {
      const task = await telegramFaucetClaim(ctx, io);
    });
  };

  const balanceCallBack = async (ctx) => {
    let groupTask;
    let lastSeen;
    const maintenance = await isMaintenanceOrDisabled(
      ctx,
      'telegram',
    );
    if (maintenance.maintenance || !maintenance.enabled) return;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      lastSeen = await updateLastSeen(ctx);
      groupTask = await updateGroup(ctx);
    });
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Balance',
    );
    if (limited) return;
    if (groupTask && groupTask.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramServerBannedMessage(
            groupTask,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }

    if (lastSeen && lastSeen.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramUserBannedMessage(
            lastSeen,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }
    await queue.add(async () => {
      const task = await telegramBalance(
        ctx,
        io,
      );
    });
  };

  const infoCallBack = async (ctx) => {
    let groupTask;
    let lastSeen;
    const maintenance = await isMaintenanceOrDisabled(
      ctx,
      'telegram',
    );
    if (maintenance.maintenance || !maintenance.enabled) return;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      lastSeen = await updateLastSeen(ctx);
      groupTask = await updateGroup(ctx);
    });
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Info',
    );
    if (limited) return;
    if (groupTask && groupTask.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramServerBannedMessage(
            groupTask,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }

    if (lastSeen && lastSeen.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramUserBannedMessage(
            lastSeen,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }
    await queue.add(async () => {
      const task = await fetchInfo(
        ctx,
        io,
      );
    });
  };

  const depositCallBack = async (ctx) => {
    let groupTask;
    let lastSeen;
    const maintenance = await isMaintenanceOrDisabled(
      ctx,
      'telegram',
    );
    if (maintenance.maintenance || !maintenance.enabled) return;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      lastSeen = await updateLastSeen(ctx);
      groupTask = await updateGroup(ctx);
    });
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Deposit',
    );
    if (limited) return;
    if (groupTask && groupTask.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramServerBannedMessage(
            groupTask,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }

    if (lastSeen && lastSeen.banned) {
      try {
        await ctx.replyWithHTML(
          await telegramUserBannedMessage(
            lastSeen,
          ),
        );
      } catch (e) {
        console.log(e);
      }
      return;
    }
    await queue.add(async () => {
      const task = await fetchWalletDepositAddress(
        ctx,
        io,
      );
    });
  };

  telegramClient.command('balance', balanceCallBack);
  telegramClient.action('balance', balanceCallBack);
  telegramClient.command('info', infoCallBack);
  telegramClient.action('info', infoCallBack);
  telegramClient.command('faucet', faucetCallBack);
  telegramClient.action('faucet', faucetCallBack);
  telegramClient.command('price', priceCallBack);
  telegramClient.action('price', priceCallBack);
  telegramClient.action('deposit', depositCallBack);
  telegramClient.command('deposit', depositCallBack);

  // if (settings.coin.setting === 'Runebase') {
  //   telegramClient.command('referral', async (ctx) => {
  //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
  //     if (maintenance.maintenance || !maintenance.enabled) return;
  //     await queue.add(async () => {
  //       const groupTask = await updateGroup(ctx);
  //       const telegramUserId = ctx.update.message.from.id;
  //       const telegramUserName = ctx.update.message.from.username;
  //       const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
  //     });
  //   });

  //   telegramClient.action('referral', async (ctx) => {
  //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
  //     if (maintenance.maintenance || !maintenance.enabled) return;
  //     await queue.add(async () => {
  //       const groupTask = await updateGroup(ctx);
  //       const telegramUserId = ctx.update.callback_query.from.id;
  //       const telegramUserName = ctx.update.callback_query.from.username;
  //       const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
  //     });
  //   });

  //   telegramClient.command('top', async (ctx) => {
  //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
  //     if (maintenance.maintenance || !maintenance.enabled) return;
  //     await queue.add(async () => {
  //       const groupTask = await updateGroup(ctx);
  //       const task = await fetchReferralTopTen(ctx);
  //     });
  //   });

  //   telegramClient.action('top', async (ctx) => {
  //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
  //     if (maintenance.maintenance || !maintenance.enabled) return;
  //     await queue.add(async () => {
  //       const groupTask = await updateGroup(ctx);
  //       const task = await fetchReferralTopTen(ctx);
  //     });
  //   });
  // }

  telegramClient.on('new_chat_members', async (ctx) => {
    await queue.add(async () => {
      const groupTask = await updateGroup(ctx);
      const task = await createUpdateUser(ctx);
    });
    // if (settings.coin.setting === 'Runebase') {
    //   if (ctx.update.message.chat.id === Number(runesGroup)) {
    //     await queue.add(async () => {
    //       const task = await createReferral(
    //         ctx,
    //         telegramClient,
    //         runesGroup,
    //       );
    //     });
    //   }
    // }
  });

  telegramClient.on('text', async (ctx) => {
    let lastSeen;
    let groupTask;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      groupTask = await updateGroup(ctx);
      lastSeen = await updateLastSeen(ctx);
    });

    const messageReplaceBreaksWithSpaces = ctx.update.message.text.replace(/\n/g, " ");
    const preFilteredMessageTelegram = messageReplaceBreaksWithSpaces.split(' ');
    const filteredMessageTelegram = preFilteredMessageTelegram.filter((el) => el !== '');
    // const telegramUserId = ctx.update.message.from.id;
    // const telegramUserName = ctx.update.message.from.username;

    if (filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram) {
      let disallow;
      const maintenance = await isMaintenanceOrDisabled(
        ctx,
        'telegram',
      );
      if (maintenance.maintenance || !maintenance.enabled) return;
      if (groupTask && groupTask.banned) {
        try {
          await ctx.replyWithHTML(
            await telegramServerBannedMessage(
              groupTask,
            ),
          );
        } catch (e) {
          console.log(e);
        }
        return;
      }

      if (lastSeen && lastSeen.banned) {
        try {
          await ctx.replyWithHTML(
            await telegramUserBannedMessage(
              lastSeen,
            ),
          );
        } catch (e) {
          console.log(e);
        }
        return;
      }
      const groupTaskId = groupTask && groupTask.id;

      const faucetSetting = await waterFaucetSettings(
        groupTaskId,
      );
      if (!faucetSetting) return;

      if (!filteredMessageTelegram[1]) {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Help',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchHelp(ctx, io);
        });
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'help') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Help',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchHelp(ctx, io);
        });
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'price') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Price',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await telegramPrice(ctx, io);
        });
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'fees') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Fees',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await telegramFeeSchedule(
            ctx,
            io,
            groupTaskId,
          );
        });
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'info') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Info',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchInfo(
            ctx,
            io,
          );
        });
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'faucet') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Faucet',
        );
        if (limited) return;
        await queue.add(async () => {
          const task = await telegramFaucetClaim(
            ctx,
            io,
          );
        });
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'balance') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Balance',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await telegramBalance(
            ctx,
            io,
          );
        });
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'deposit') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Deposit',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchWalletDepositAddress(
            ctx,
            io,
          );
        });
        return;
      }

      // if (settings.coin.setting === 'Runebase') {
      //   if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2]) {
      //     await queue.add(async () => {
      //       const task = await fetchReferralCount(
      //         ctx,
      //         telegramUserId,
      //         telegramUserName,
      //       );
      //     });
      //   }
      //   if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top') {
      //     await queue.add(async () => {
      //       const task = await fetchReferralTopTen(ctx);
      //     });
      //   }
      // }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'flood') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Flood',
        );
        if (limited) return;
        await queue.add(async () => {
          disallow = await disallowDirectMessage(
            ctx,
            lastSeen,
            'flood',
            io,
          );
        });
        if (disallow) return;

        const setting = await telegramFeatureSettings(
          ctx,
          'flood',
          groupTaskId,
        );
        if (!setting) return;

        await executeTipFunction(
          telegramFlood,
          queue,
          filteredMessageTelegram[2],
          telegramClient,
          telegramApiClient,
          ctx,
          filteredMessageTelegram,
          io,
          groupTask,
          setting,
          faucetSetting,
        );
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'sleet') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Sleet',
        );
        if (limited) return;
        await queue.add(async () => {
          disallow = await disallowDirectMessage(
            ctx,
            lastSeen,
            'sleet',
            io,
          );
        });
        if (disallow) return;

        const setting = await telegramFeatureSettings(
          ctx,
          'sleet',
          groupTaskId,
        );
        if (!setting) return;

        await executeTipFunction(
          telegramSleet,
          queue,
          filteredMessageTelegram[2],
          telegramClient,
          telegramApiClient,
          ctx,
          filteredMessageTelegram,
          io,
          groupTask,
          setting,
          faucetSetting,
        );
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'rain') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Rain',
        );
        if (limited) return;
        await queue.add(async () => {
          disallow = await disallowDirectMessage(
            ctx,
            lastSeen,
            'rain',
            io,
          );
        });
        if (disallow) return;

        const setting = await telegramFeatureSettings(
          ctx,
          'rain',
          groupTaskId,
        );
        if (!setting) return;

        await executeTipFunction(
          telegramRain,
          queue,
          filteredMessageTelegram[2],
          telegramClient,
          telegramApiClient,
          ctx,
          filteredMessageTelegram,
          io,
          groupTask,
          setting,
          faucetSetting,
        );
        return;
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'withdraw') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Withdraw',
        );
        if (limited) return;
        const setting = await telegramFeatureSettings(
          ctx,
          'withdraw',
          groupTaskId,
        );
        if (!setting) return;

        await executeTipFunction(
          withdrawTelegramCreate,
          queue,
          filteredMessageTelegram[3],
          telegramClient,
          telegramApiClient,
          ctx,
          filteredMessageTelegram,
          io,
          groupTask,
          setting,
          faucetSetting,
        );
        return;
      }

      if (
        filteredMessageTelegram[1]
        && ctx.update
        && ctx.update.message
        && ctx.update.message.entities
        && ctx.update.message.entities.length > 0
      ) {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Tip',
        );
        if (limited) return;

        await queue.add(async () => {
          disallow = await disallowDirectMessage(
            ctx,
            lastSeen,
            'tip',
            io,
          );
        });
        if (disallow) return;

        const setting = await telegramFeatureSettings(
          ctx,
          'tip',
          groupTaskId,
        );
        if (!setting) return;

        await executeTipFunction(
          tipToTelegramUser,
          queue,
          filteredMessageTelegram[ctx.update.message.entities.length + 1],
          telegramClient,
          telegramApiClient,
          ctx,
          filteredMessageTelegram,
          io,
          groupTask,
          setting,
          faucetSetting,
        );
      }
    }
  });
};
