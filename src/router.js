import PQueue from 'p-queue';
// import { filter } from 'lodash';
import walletNotify from './controllers/walletNotify';
// import updatePrice from './helpers/updatePrice';

import {
  withdrawTelegramAdminFetch,
  withdrawTelegramAdminAccept,
  withdrawTelegramAdminDecline,
} from './controllers/admin';

import {
  fetchWalletBalance,
  fetchWalletDepositAddress,
  withdrawTelegramCreate,
  tipRunesToUser,
  rainRunesToUsers,
} from './controllers/telegram/wallet';

import {
  fetchDiscordWalletBalance,
  fetchDiscordWalletDepositAddress,
  tipRunesToDiscordUser,
  discordRain,
  discordFlood,
  discordSleet,
  withdrawDiscordCreate,
} from './controllers/discord/wallet';

import {
  updateLastSeen,
  createUpdateUser,
} from './controllers/telegram/user';

import {
  createUpdateDiscordUser,
  updateDiscordLastSeen,
} from './controllers/discord/user';

import {
  updateGroup,
} from './controllers/telegram/group';

import {
  updateDiscordGroup,
} from './controllers/discord/group';

import {
  fetchHelp,
} from './controllers/telegram/help';

import {
  discordHelp,
} from './controllers/discord/help';

import {
  fetchReferralCount,
  createReferral,
  fetchReferralTopTen,
} from './controllers/telegram/referral';

import fetchPriceInfo from './controllers/telegram/price';

import {
  fetchExchangeList,
} from './controllers/telegram/exchanges';

require('dotenv').config();

// const PQueue = require('p-queue');
const logger = require('./helpers/logger');

const queue = new PQueue({ concurrency: 1 });
const schedule = require('node-schedule');

const appRoot = process.env.PWD;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const runesGroup = process.env.TELEGRAM_RUNES_GROUP;
const adminTelegramId = 672239325;

const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { startSync } = require('./services/sync');

// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 10000,
  limit: 4,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded - please wait 10 seconds'),
};

const telegramClient = new Telegraf(telegramBotToken);

const {
  Client,
  Intents,
  MessageEmbed,
  GuildMemberManager,
} = require('discord.js');

const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ['MESSAGE', 'CHANNEL'],
});

const router = (app) => {
  discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
  });

  discordClient.on("messageCreate", async (message) => {
    console.log(message);
    if (!message.author.bot) {
      const walletExists = await createUpdateDiscordUser(message);
      await queue.add(() => walletExists);
      const groupTask = await updateDiscordGroup(discordClient, message);
      await queue.add(() => groupTask);
      const lastSeenDiscordTask = await updateDiscordLastSeen(discordClient, message);
      await queue.add(() => lastSeenDiscordTask);
    }

    if (!message.content.startsWith(process.env.DISCORD_BOT_COMMAND) || message.author.bot) return;
    const filteredMessageTelegram = message.content.split(' ');
    const filteredMessageDiscord = filteredMessageTelegram.filter((el) => el !== '');

    if (filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@!')) {
      const userToTipId = filteredMessageDiscord[1].substring(0, filteredMessageDiscord[1].length - 1).substring(3);
      const task = await tipRunesToDiscordUser(message, filteredMessageDiscord, userToTipId);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1] === undefined) {
      const task = await discordHelp(message);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'help') {
      const task = await discordHelp(message);
      await queue.add(() => task);
    }
    console.log(filteredMessageDiscord);
    if (filteredMessageDiscord[1].toLowerCase() === 'balance') {
      const task = await fetchDiscordWalletBalance(message);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'deposit') {
      const task = await fetchDiscordWalletDepositAddress(message);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'withdraw') {
      const task = await withdrawDiscordCreate(message, filteredMessageDiscord);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'rain') {
      const task = await discordRain(discordClient, message, filteredMessageDiscord);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'flood') {
      const task = await discordFlood(discordClient, message, filteredMessageDiscord);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'sleet') {
      const task = await discordSleet(discordClient, message, filteredMessageDiscord);
      await queue.add(() => task);
    }

    //    if (message.content.startsWith(`${prefix}`)) {
    //      message.channel.send(`filtered message:
    // filterMessage[0] = ${filteredMessageDiscord[0]}
    // filterMessage[1] = ${filteredMessageDiscord[1]}
    // filterMessage[2] = ${filteredMessageDiscord[2]}
    // filterMessage[3] = ${filteredMessageDiscord[3]}
    // filterMessage[4] = ${filteredMessageDiscord[4]}
    // filterMessage[5] = ${filteredMessageDiscord[5]}
    //      `);
    //    }
  });

  app.post('/api/chaininfo/block',
    (req, res) => {
      console.log('new block found');
      startSync();
    });

  app.post('/api/rpc/walletnotify',
    walletNotify,
    (req, res) => {
      console.log('afterWalletNotify');
      if (res.locals.error) {
        console.log('walletnotify...');
        console.log(res.locals.error);
      } else if (!res.locals.error && res.locals.transaction) {
        console.log('walletnotify...');

        console.log(res.locals.transaction);
        console.log(runesGroup);

        telegramClient.telegram.sendMessage(runesGroup, `incoming deposit detected
Balance will be reflected on the user wallet in 5 confirmations
https://explorer.runebase.io/tx/${res.locals.transaction[0].txid} 
        `);
      }
    });

  telegramClient.hears('adminwithdrawals', (ctx) => {
    if (ctx.update.message.from.id === adminTelegramId) {
      // console.log(ctx.from)
      (async () => {
        const task = await withdrawTelegramAdminFetch(telegramClient, ctx, adminTelegramId);
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.action(/acceptWithdrawal-+/, (ctx) => {
    const withdrawalId = ctx.match.input.substring(17);
    console.log(ctx);
    console.log(adminTelegramId);
    console.log(ctx.update.callback_query.from.id);
    if (ctx.update.callback_query.from.id === adminTelegramId) {
      // console.log(ctx.from)
      (async () => {
        const task = await withdrawTelegramAdminAccept(telegramClient, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient);
        await queue.add(() => task);
      })();
    }
  });

  // method that returns image of a cat

  telegramClient.action(/declineWithdrawal-+/, (ctx) => {
    console.log(ctx);
    const withdrawalId = ctx.match.input.substring(18);
    if (ctx.update.callback_query.from.id === adminTelegramId) {
      // console.log(ctx.from)
      (async () => {
        const task = await withdrawTelegramAdminDecline(telegramClient, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient);
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.command('help', (ctx) => {
    (async () => {
      const task = await fetchHelp(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('price', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchPriceInfo(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Price', (ctx) => {
    console.log(ctx);
    (async () => {
      const task = await fetchPriceInfo(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('exchanges', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchExchangeList(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Exchanges', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchExchangeList(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('balance', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Balance', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('tip', (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    console.log(filteredMessageTelegram);
    console.log(ctx.update.message.chat);
    // if (ctx.update.message.chat.id !== Number(runesGroup)) {
    //  ctx.reply('can only tip command in RUNES telegram group');
    // }
    // if (ctx.update.message.chat.id === Number(runesGroup)) {
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
        const tipAmount = filteredMessageTelegram[2];
        const tipTo = filteredMessageTelegram[1];
        const task = await tipRunesToUser(ctx, tipTo, tipAmount, telegramClient, runesGroup);
        await queue.add(() => task);
      })();
    }
    // }
  });

  telegramClient.command('rain', (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    console.log(filteredMessageTelegram);
    // if (ctx.update.message.chat.id !== Number(runesGroup)) {
    //  ctx.reply('can only rain command in RUNES telegram group');
    // }
    // if (ctx.update.message.chat.id === Number(runesGroup)) {
    if (!filteredMessageTelegram[1]) {
      ctx.reply('invalid amount of arguments');
    }
    if (filteredMessageTelegram[1]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const rainAmount = filteredMessageTelegram[1];
        const task = await rainRunesToUsers(ctx, rainAmount, telegramClient, runesGroup);
        await queue.add(() => task);
      })();
    }
    // }
  });

  telegramClient.command('deposit', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Deposit', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('withdraw', (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    console.log(filteredMessageTelegram);

    // if (ctx.update.message.chat.type !== 'private' && ctx.update.message.chat.id !== Number(runesGroup)) {
    //  ctx.reply('can only request withdrawal in private or RUNES group');
    // }
    // if (ctx.update.message.chat.type === 'private' || ctx.update.message.chat.id === Number(runesGroup)) {
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
        const withdrawalAddress = filteredMessageTelegram[1];
        const withdrawalAmount = filteredMessageTelegram[2];
        const task = await withdrawTelegramCreate(ctx, withdrawalAddress, withdrawalAmount);
        await queue.add(() => task);
      })();
    }
    // }
  });

  telegramClient.command('referral', (ctx) => {
    (async () => {
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
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('ReferralTop', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.command(process.env.TELEGRAM_BOT_COMMAND, (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    console.log(filteredMessageTelegram);

    if (!filteredMessageTelegram[1]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchHelp(ctx);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'price') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchPriceInfo(ctx);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'exchanges') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchExchangeList(ctx);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'help') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchHelp(ctx);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchReferralTopTen(ctx);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'balance') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'deposit') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'withdraw') {
      // if (ctx.update.message.chat.type !== 'private' && ctx.update.message.chat.id !== Number(runesGroup)) {
      //  ctx.reply('can only request withdrawal in private or RUNES group');
      // }
      // if (ctx.update.message.chat.type === 'private' || ctx.update.message.chat.id === Number(runesGroup)) {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('insufficient Arguments');
      }
      if (!filteredMessageTelegram[3]) {
        ctx.reply('insufficient Arguments');
      }
      if (filteredMessageTelegram[2] && filteredMessageTelegram[3]) {
        (async () => {
          const groupTask = await updateGroup(ctx);
          await queue.add(() => groupTask);
          const withdrawalAddress = filteredMessageTelegram[2];
          const withdrawalAmount = filteredMessageTelegram[3];
          const task = await withdrawTelegramCreate(ctx, withdrawalAddress, withdrawalAmount);
          await queue.add(() => task);
        })();
      }
      // }
    }
    if (filteredMessageTelegram[1] === 'tip') {
      console.log(ctx.update.message.chat);
      // if (ctx.update.message.chat.id !== Number(runesGroup)) {
      //  ctx.reply('can only tip command in RUNES telegram group');
      // }
      // if (ctx.update.message.chat.id === Number(runesGroup)) {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('insufficient Arguments');
      }
      if (!filteredMessageTelegram[3]) {
        ctx.reply('insufficient Arguments');
      }
      if (filteredMessageTelegram[2] && filteredMessageTelegram[3]) {
        (async () => {
          const groupTask = await updateGroup(ctx);
          await queue.add(() => groupTask);
          const tipAmount = filteredMessageTelegram[3];
          const tipTo = filteredMessageTelegram[2];
          const task = await tipRunesToUser(ctx, tipTo, tipAmount, telegramClient, runesGroup);
          await queue.add(() => task);
        })();
      }
      // }
    }
    if (filteredMessageTelegram[1] === 'rain') {
      // if (ctx.update.message.chat.id !== Number(runesGroup)) {
      //  ctx.reply('can only rain command in RUNES telegram group');
      // }
      // if (ctx.update.message.chat.id === Number(runesGroup)) {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('invalid amount of arguments');
      }
      if (filteredMessageTelegram[2]) {
        (async () => {
          const groupTask = await updateGroup(ctx);
          await queue.add(() => groupTask);
          const rainAmount = filteredMessageTelegram[2];
          const task = await rainRunesToUsers(ctx, rainAmount, telegramClient, runesGroup);
          await queue.add(() => task);
        })();
      }
      // }
    }
    if (filteredMessageTelegram[1] === 'hodlrain') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchWalletBalance(ctx);
        await queue.add(() => task);
      })();
    }
    console.log(ctx);
    console.log(ctx.update.message.entities);
    console.log(filteredMessageTelegram);
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.on('new_chat_members', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      console.log(ctx);
      console.log(ctx.update.message.chat.id);
      console.log(Number(runesGroup));
      if (ctx.update.message.chat.id === Number(runesGroup)) {
        console.log('test add');
        console.log(ctx.message);
        const task = await createUpdateUser(ctx);
        await queue.add(() => task);
        const taskReferred = await createReferral(ctx, telegramClient, runesGroup);
        await queue.add(() => taskReferred);
      }
    })();
  });

  telegramClient.on('text', (ctx) => {
    console.log('found text');
    console.log(ctx.update);
    console.log(ctx.update.message);
    console.log(ctx.update.message.from);
    console.log(ctx.update.message.text);
    console.log(ctx.update.message.from.username);
    logger.info(`Chat - ${ctx.update.message.chat.id}: ${ctx.update.message.chat.title} : ${ctx.update.message.from.username}: ${ctx.update.message.text}`);
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
      console.log(ctx.update.message.chat.id);
      console.log(Number(runesGroup));
      // if (ctx.update.message.chat.id === Number(runesGroup)) {
      const lastSeenTask = await updateLastSeen(ctx);
      await queue.add(() => lastSeenTask);
      // }
    })();
  });
  telegramClient.on('message', (ctx) => {
    console.log('found message');
    console.log(ctx.update);
    console.log(ctx.update.message);
    console.log(ctx.update.message.from);
    console.log(ctx.update.message.text);
    console.log(ctx.update.message.from.username);
    logger.info(`Chat - ${ctx.update.message.chat.id}: ${ctx.update.message.chat.title} : ${ctx.update.message.from.username}: ${ctx.update.message.text}`);
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
      console.log(ctx.update.message.chat.id);
      console.log(Number(runesGroup));
      // if (ctx.update.message.chat.id === Number(runesGroup)) {
      const lastSeenTask = await updateLastSeen(ctx);
      await queue.add(() => lastSeenTask);
      // }
    })();
  });
  telegramClient.launch();
  discordClient.login(process.env.CLIENT_TOKEN);
};

export default router;
