import { config } from "dotenv";

import { fetchDiscordWalletBalance } from '../controllers/discord/balance';
import { fetchDiscordWalletDepositAddress } from '../controllers/discord/deposit';
import { withdrawDiscordCreate } from '../controllers/discord/withdraw';

import { discordVoiceRain } from '../controllers/discord/voicerain';
import { discordRain } from '../controllers/discord/rain';
import { discordSleet } from '../controllers/discord/sleet';
import { discordFlood } from '../controllers/discord/flood';
import {
  tipCoinsToDiscordFaucet,
  tipRunesToDiscordUser,
} from '../controllers/discord/tip';

import {
  createUpdateDiscordUser,
  updateDiscordLastSeen,
} from '../controllers/discord/user';

import { fetchFeeSchedule } from '../controllers/discord/fees';

import { updateDiscordChannel } from '../controllers/discord/channel';

import { updateDiscordGroup } from '../controllers/discord/group';

import { discordCoinInfo } from '../controllers/discord/info';

import { discordSoak } from '../controllers/discord/soak';

import { discordThunder } from '../controllers/discord/thunder';

import { discordThunderStorm } from '../controllers/discord/thunderstorm';

import { discordHurricane } from '../controllers/discord/hurricane';

import { discordFaucetClaim } from '../controllers/discord/faucet';

import { setIgnoreMe } from '../controllers/discord/ignore';

import { discordHelp } from '../controllers/discord/help';

import { discordPrice } from '../controllers/discord/price';

import { fetchDiscordListTransactions } from '../controllers/discord/listTransactions';

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
  limitPrice,
  limitTrivia,
  limitListTransactions,
} from '../helpers/rateLimit';

import { discordTrivia } from '../controllers/discord/trivia';
import { discordReactDrop } from '../controllers/discord/reactdrop';
import db from '../models';
import {
  discordUserBannedMessage,
  discordServerBannedMessage,
  discordChannelBannedMessage,
} from '../messages/discord';

import { discordStats } from '../controllers/discord/stats';
import { discordPublicStats } from '../controllers/discord/publicstats';
import { discordLeaderboard } from '../controllers/discord/leaderboard';
import {
  discordSettings,
  discordwaterFaucetSettings,
} from '../controllers/discord/settings';
import { executeTipFunction } from '../helpers/client/discord/executeTips';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';

config();

export const discordRouter = (
  discordClient,
  queue,
  io,
  settings,
) => {
  // discordClient.on('ready', async () => {
  let counter = 0;
  const interval = setInterval(async () => {
    if (counter % 2 === 0) {
      const priceInfo = await db.priceInfo.findOne({
        where: {
          currency: 'USD',
        },
      });
      discordClient.user.setPresence({
        activities: [{
          name: `$${priceInfo.price}/${settings.coin.ticker}`,
          type: "WATCHING",
        }],
      });
    } else {
      discordClient.user.setPresence({
        activities: [{
          name: `${settings.bot.command.discord}`,
          type: "PLAYING",
        }],
      });
    }
    counter += 1;
  }, 40000);
  console.log(`Logged in as ${discordClient.user.tag}!`);
  // });

  discordClient.on("presenceUpdate", (oldMember, newMember) => {
    // const { username } = newMember.user;
    console.log('presenceUpdate');
  });

  discordClient.on('voiceStateUpdate', async (oldMember, newMember) => {
    await queue.add(async () => {
      const groupTask = await updateDiscordGroup(discordClient, newMember);
      const channelTask = await updateDiscordChannel(discordClient, newMember, groupTask);
    });
  });

  discordClient.on("messageCreate", async (message) => {
    // await queue.add(async () => {
    let groupTask;
    let groupTaskId;
    let channelTask;
    let channelTaskId;
    let lastSeenDiscordTask;
    let faucetSetting;
    if (!message.author.bot) {
      const maintenance = await isMaintenanceOrDisabled(message, 'discord');
      // await queue.add(() => maintenance);
      if (maintenance.maintenance || !maintenance.enabled) return;
      const walletExists = await createUpdateDiscordUser(message, queue);
      // await queue.add(() => walletExists);
      groupTask = await updateDiscordGroup(discordClient, message);
      await queue.add(() => groupTask);
      groupTaskId = groupTask && groupTask.id;
      channelTask = await updateDiscordChannel(discordClient, message, groupTask);
      await queue.add(() => channelTask);
      channelTaskId = channelTask && channelTask.id;
      lastSeenDiscordTask = await updateDiscordLastSeen(discordClient, message);
      await queue.add(() => lastSeenDiscordTask);
      faucetSetting = await discordwaterFaucetSettings(
        groupTaskId,
        channelTaskId,
      );
      if (!faucetSetting) return;
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
    if (filteredMessageDiscord[1] === undefined) {
      const limited = await limitHelp(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await discordHelp(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help') {
      const limited = await limitHelp(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await discordHelp(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'fees') {
      const limited = await limitHelp(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchFeeSchedule(message, io, groupTaskId, channelTaskId);
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'stats') {
      const limited = await limitStats(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await discordStats(
          message,
          filteredMessageDiscord,
          io,
          groupTask,
          channelTask,
        );
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard') {
      const limited = await limitLeaderboard(message);
      if (limited) return;
      await queue.add(async () => {
        console.log('unavailable');
        // const task = await discordLeaderboard(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'publicstats') {
      const limited = await limitPublicStats(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await discordPublicStats(message, io);
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'info') {
      const limited = await limitInfo(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await discordCoinInfo(message, io);
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ignoreme') {
      const limited = await limitIgnoreMe(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await setIgnoreMe(message, io);
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'balance') {
      const limited = await limitBalance(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchDiscordWalletBalance(message, io);
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'listtransactions') {
      const limited = await limitListTransactions(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchDiscordListTransactions(message, io);
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'price') {
      const limited = await limitPrice(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await discordPrice(message, io);
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'faucet') {
      const setting = await discordSettings(
        message,
        'faucet',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;
      const limited = await limitFaucet(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await discordFaucetClaim(
          message,
          filteredMessageDiscord,
          io,
        );
      });
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'deposit') {
      const limited = await limitDeposit(message);
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchDiscordWalletDepositAddress(message, io);
      });
      // await queue.add(() => task);
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'withdraw') {
      const setting = await discordSettings(
        message,
        'withdraw',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;
      const limited = await limitWithdraw(message);
      if (limited) return;

      await executeTipFunction(
        withdrawDiscordCreate,
        queue,
        filteredMessageDiscord[3],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (
      filteredMessageDiscord.length > 1
      && filteredMessageDiscord[1]
      && filteredMessageDiscord[1].startsWith('<@')
    ) {
      const setting = await discordSettings(
        message,
        'tip',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;
      const limited = await limitTip(message);
      if (limited) return;

      if (
        filteredMessageDiscord[1].substr(3).slice(0, -1) === discordClient.user.id
      ) {
        await executeTipFunction(
          tipCoinsToDiscordFaucet,
          queue,
          filteredMessageDiscord[2],
          discordClient,
          message,
          filteredMessageDiscord,
          io,
          groupTask,
          channelTask,
          setting,
          faucetSetting,
        );
      } else {
        let AmountPosition = 1;
        let AmountPositionEnded = false;
        while (!AmountPositionEnded) {
          AmountPosition += 1;
          if (!filteredMessageDiscord[AmountPosition].startsWith('<@')) {
            AmountPositionEnded = true;
          }
        }

        await executeTipFunction(
          tipRunesToDiscordUser,
          queue,
          filteredMessageDiscord[AmountPosition],
          discordClient,
          message,
          filteredMessageDiscord,
          io,
          groupTask,
          channelTask,
          setting,
          faucetSetting,
        );
      }
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'voicerain') {
      const setting = await discordSettings(message, 'voicerain', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitRain(message);
      if (limited) return;

      await executeTipFunction(
        discordVoiceRain,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'rain') {
      const setting = await discordSettings(message, 'rain', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitRain(message);
      if (limited) return;

      await executeTipFunction(
        discordRain,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'flood') {
      const setting = await discordSettings(message, 'flood', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitFlood(message);
      if (limited) return;

      await executeTipFunction(
        discordFlood,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunder') {
      const setting = await discordSettings(message, 'thunder', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitThunder(message);
      if (limited) return;

      await executeTipFunction(
        discordThunder,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunderstorm') {
      const setting = await discordSettings(message, 'thunderstorm', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitThunderStorm(message);
      if (limited) return;

      await executeTipFunction(
        discordThunderStorm,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'hurricane') {
      const setting = await discordSettings(message, 'hurricane', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitHurricane(message);
      if (limited) return;

      await executeTipFunction(
        discordHurricane,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'soak') {
      const setting = await discordSettings(message, 'soak', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitSoak(message);
      if (limited) return;

      await executeTipFunction(
        discordSoak,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'sleet') {
      const setting = await discordSettings(message, 'sleet', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitSleet(message);
      if (limited) return;

      await executeTipFunction(
        discordSleet,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }
    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'reactdrop') {
      const setting = await discordSettings(message, 'reactdrop', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitReactDrop(message);
      if (limited) return;

      await executeTipFunction(
        discordReactDrop,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'trivia') {
      const setting = await discordSettings(message, 'trivia', groupTaskId, channelTaskId);
      if (!setting) return;
      const limited = await limitTrivia(message);
      if (limited) return;

      await executeTipFunction(
        discordTrivia,
        queue,
        filteredMessageDiscord[2],
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
      );
    }
  });
};
