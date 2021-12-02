import { config } from "dotenv";
import PQueue from 'p-queue';
import { fetchDiscordWalletBalance } from '../controllers/discord/balance';
import { fetchDiscordWalletDepositAddress } from '../controllers/discord/deposit';
import { withdrawDiscordCreate } from '../controllers/discord/withdraw';
import { discordRain } from '../controllers/discord/rain';
import { discordSleet } from '../controllers/discord/sleet';
import { discordFlood } from '../controllers/discord/flood';
import { tipRunesToDiscordUser } from '../controllers/discord/tip';

import {
  createUpdateDiscordUser,
  updateDiscordLastSeen,
} from '../controllers/discord/user';

import { updateDiscordChannel } from '../controllers/discord/channel';

import {
  updateDiscordGroup,
} from '../controllers/discord/group';

import {
  discordCoinInfo,
} from '../controllers/discord/info';

import {
  discordSoak,
} from '../controllers/discord/soak';

import {
  discordThunder,
} from '../controllers/discord/thunder';

import {
  discordThunderStorm,
} from '../controllers/discord/thunderstorm';

import {
  discordHurricane,
} from '../controllers/discord/hurricane';

import {
  discordFaucetClaim,
} from '../controllers/discord/faucet';

import {
  setIgnoreMe,
} from '../controllers/discord/ignore';

import {
  discordHelp,
} from '../controllers/discord/help';

import {
  limitReactDrop,
  limitTip,
  limitWithdraw,
  limitHelp,
  limitInfo,
  limitRain,
  limitSoak,
  limitFlood,
  limitHurricane,
  limitIgnoreMe,
  limitSleet,
  limitBalance,
  limitFaucet,
  limitDeposit,
  limitStats,
  limitLeaderboard,
  limitPublicStats,
  limitThunder,
  limitThunderStorm,
} from '../helpers/rateLimit';

import {
  discordReactDrop,
} from '../controllers/discord/reactdrop';

import {
  discordUserBannedMessage,
  discordServerBannedMessage,
  discordChannelBannedMessage,
} from '../messages/discord';

import { discordStats } from '../controllers/discord/stats';
import { discordPublicStats } from '../controllers/discord/publicstats';
import { discordLeaderboard } from '../controllers/discord/leaderboard';
import settings from '../config/settings';

config();

const queue = new PQueue({ concurrency: 1 });

export const discordRouter = (discordClient, io) => {
  discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
  });

  discordClient.on("messageCreate", async (message) => {
    let groupTask;
    let channelTask;
    let lastSeenDiscordTask;
    if (!message.author.bot) {
      const walletExists = await createUpdateDiscordUser(message);
      await queue.add(() => walletExists);
      groupTask = await updateDiscordGroup(discordClient, message);
      await queue.add(() => groupTask);
      channelTask = await updateDiscordChannel(discordClient, message, groupTask);
      await queue.add(() => channelTask);
      lastSeenDiscordTask = await updateDiscordLastSeen(discordClient, message);
      await queue.add(() => lastSeenDiscordTask);
    }
    if (!message.content.startsWith(settings.bot.command.discord) || message.author.bot) return;
    if (message.content.startsWith(settings.bot.command.discord)) {
      if (groupTask && groupTask.banned) {
        await message.channel.send({ embeds: [discordServerBannedMessage(groupTask)] });
        return;
      }
      if (channelTask && channelTask.banned) {
        await message.channel.send({ embeds: [discordChannelBannedMessage(channelTask)] });
        return;
      }
      if (lastSeenDiscordTask && lastSeenDiscordTask.banned) {
        await message.channel.send({ embeds: [discordUserBannedMessage(lastSeenDiscordTask)] });
        return;
      }
    }

    const preFilteredMessageDiscord = message.content.split(' ');
    const filteredMessageDiscord = preFilteredMessageDiscord.filter((el) => el !== '');

    if (filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@!')) {
      const limited = await limitTip(message);
      // await queue.add(() => limited);
      const userToTipId = filteredMessageDiscord[1].substring(0, filteredMessageDiscord[1].length - 1).substring(3);
      const task = await tipRunesToDiscordUser(message, filteredMessageDiscord, userToTipId, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1] === undefined) {
      const limited = await limitHelp(message);
      // await queue.add(() => limited);
      const task = await discordHelp(message, io);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'help') {
      const limited = await limitHelp(message);
      // await queue.add(() => limited);
      const task = await discordHelp(message, io);
      await queue.add(() => task);
    }
    if (filteredMessageDiscord[1].toLowerCase() === 'stats') {
      const limited = await limitStats(message);
      await queue.add(() => limited);
      const task = await discordStats(message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }
    if (filteredMessageDiscord[1].toLowerCase() === 'leaderboard') {
      const limited = await limitLeaderboard(message);
      // await queue.add(() => limited);
      const task = await discordLeaderboard(message, io);
      await queue.add(() => task);
    }
    if (filteredMessageDiscord[1].toLowerCase() === 'publicstats') {
      const limited = await limitPublicStats(message);
      // await queue.add(() => limited);
      const task = await discordPublicStats(message, io);
      await queue.add(() => task);
    }
    if (filteredMessageDiscord[1].toLowerCase() === 'info') {
      const limited = await limitInfo(message);
      // await queue.add(() => limited);
      const task = await discordCoinInfo(message, io);
      await queue.add(() => task);
    }
    if (filteredMessageDiscord[1].toLowerCase() === 'ignoreme') {
      const limited = await limitIgnoreMe(message);
      // await queue.add(() => limited);
      const task = await setIgnoreMe(message, io);
      await queue.add(() => task);
    }
    // console.log(filteredMessageDiscord);
    if (filteredMessageDiscord[1].toLowerCase() === 'balance') {
      const limited = await limitBalance(message);
      // await queue.add(() => limited);
      const task = await fetchDiscordWalletBalance(message, io);
      await queue.add(() => task);
    }
    if (filteredMessageDiscord[1].toLowerCase() === 'faucet') {
      const limited = await limitFaucet(message);
      // await queue.add(() => limited);
      const task = await discordFaucetClaim(message, io, groupTask, channelTask);
      await queue.add(() => task);
    }
    if (filteredMessageDiscord[1].toLowerCase() === 'deposit') {
      const limited = await limitDeposit(message);
      // await queue.add(() => limited);
      const task = await fetchDiscordWalletDepositAddress(message, io);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'withdraw') {
      const limited = await limitWithdraw(message);
      // await queue.add(() => limited);
      const task = await withdrawDiscordCreate(message, filteredMessageDiscord, io);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'rain') {
      const limited = await limitRain(message);
      // await queue.add(() => limited);
      const task = await discordRain(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'flood') {
      const limited = await limitFlood(message);
      // await queue.add(() => limited);
      const task = await discordFlood(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'thunder') {
      const limited = await limitThunder(message);
      // await queue.add(() => limited);
      const task = await discordThunder(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'thunderstorm') {
      const limited = await limitThunderStorm(message);
      // await queue.add(() => limited);
      const task = await discordThunderStorm(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'hurricane') {
      const limited = await limitHurricane(message);
      // await queue.add(() => limited);
      const task = await discordHurricane(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'soak') {
      const limited = await limitSoak(message);
      // await queue.add(() => limited);
      const task = await discordSoak(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'sleet') {
      const limited = await limitSleet(message);
      // await queue.add(() => limited);
      const task = await discordSleet(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask);
      await queue.add(() => task);
    }

    if (filteredMessageDiscord[1].toLowerCase() === 'reactdrop') {
      const limited = await limitReactDrop(message);
      // await queue.add(() => limited);
      if (!limited) {
        const task = await discordReactDrop(discordClient, message, filteredMessageDiscord, io);
        await queue.add(() => task);
      }
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
};
