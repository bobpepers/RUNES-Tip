import {
  ActivityType,
  InteractionType,
} from "discord.js";
import { config } from "dotenv";
import db from '../models';
import { fetchDiscordWalletBalance } from '../controllers/discord/balance';
import { fetchDiscordWalletDepositAddress } from '../controllers/discord/deposit';
import { withdrawDiscordCreate } from '../controllers/discord/withdraw';
import { discordVoiceRain } from '../controllers/discord/voicerain';
import { discordRain } from '../controllers/discord/rain';
import { discordSleet } from '../controllers/discord/sleet';
import { discordFlood } from '../controllers/discord/flood';
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
import { discordTrivia } from '../controllers/discord/trivia';
import { discordReactDrop } from '../controllers/discord/reactdrop';
import { discordStats } from '../controllers/discord/stats';
import { discordPublicStats } from '../controllers/discord/publicstats';
import { discordHalving } from '../controllers/discord/halving';
import { discordMining } from '../controllers/discord/mining';
// import { discordLeaderboard } from '../controllers/discord/leaderboard';
import { tipCoinsToDiscordFaucet, tipRunesToDiscordUser } from '../controllers/discord/tip';
import { createUpdateDiscordUser, updateDiscordLastSeen } from '../controllers/discord/user';
import { myRateLimiter } from '../helpers/rateLimit';
import { disallowDirectMessage } from '../helpers/client/discord/disallowDirectMessage';
import { executeTipFunction } from '../helpers/client/discord/executeTips';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';

import { discordFeatureSettings } from '../controllers/discord/settings';
import { waterFaucetSettings } from '../controllers/settings';

import {
  discordUserBannedMessage,
  discordServerBannedMessage,
  discordChannelBannedMessage,
} from '../messages/discord';

// import getCoinSettings from '../config/settings';
// const settings = getCoinSettings();

config();

export const discordRouter = (
  discordClient,
  queue,
  io,
  settings,
) => {
  let counter = 0;
  const interval = setInterval(async () => {
    try {
      if (counter % 2 === 0) {
        const priceInfo = await db.currency.findOne({
          where: {
            iso: 'USD',
          },
        });
        discordClient.user.setPresence({
          activities: [{
            name: `$${priceInfo.price}/${settings.coin.ticker}`,
            type: ActivityType.Watching,
          }],
        });
      } else {
        discordClient.user.setPresence({
          activities: [{
            name: `/${settings.bot.command.discord.slash}`,
            type: ActivityType.Playing,
          }],
        });
      }
    } catch (e) {
      console.log(e);
    }
    counter += 1;
  }, 40000);

  discordClient.on("presenceUpdate", (oldMember, newMember) => {
    // const { username } = newMember.user;
    // console.log('presenceUpdate');
  });

  discordClient.on('voiceStateUpdate', async (oldMember, newMember) => {
    await queue.add(async () => {
      const groupTask = await updateDiscordGroup(discordClient, newMember);
      const channelTask = await updateDiscordChannel(newMember, groupTask);
    });
  });

  discordClient.on("interactionCreate", async (interaction) => {
    // if (!interaction.isButton()) return;
    if (!interaction.user.bot) {
      if (interaction.type === InteractionType.ApplicationCommand) {
        // Defer the interaction
        await interaction.deferReply().catch((e) => {
          console.log(e);
        });
      }
      // console.log(interaction);
      let groupTask;
      let groupTaskId;
      let channelTask;
      let channelTaskId;
      let lastSeenDiscordTask;
      let disallow;

      const maintenance = await isMaintenanceOrDisabled(
        interaction,
        'discord',
      );
      if (maintenance.maintenance || !maintenance.enabled) return;
      const walletExists = await createUpdateDiscordUser(
        discordClient,
        interaction.user,
        queue,
      );
      await queue.add(async () => {
        groupTask = await updateDiscordGroup(discordClient, interaction);
        channelTask = await updateDiscordChannel(interaction, groupTask);
        lastSeenDiscordTask = await updateDiscordLastSeen(
          interaction,
          interaction.user,
        );
        groupTaskId = groupTask && groupTask.id;
        channelTaskId = channelTask && channelTask.id;
      });
      // If the Interaction is a command
      if (interaction.type === InteractionType.ApplicationCommand) {
        console.log(interaction);
        const faucetSetting = await waterFaucetSettings(
          groupTaskId,
          channelTaskId,
        );
        if (!faucetSetting) return;

        // Help Message
        if (interaction.options.getSubcommand() === 'help') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Help',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await discordHelp(
              discordClient,
              interaction,
              io,
            );
          });
        }
        // Balance Message
        if (interaction.options.getSubcommand() === 'balance') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Balance',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await fetchDiscordWalletBalance(
              discordClient,
              interaction,
              io,
            );
          });
        }
        // Deposit Message
        if (interaction.options.getSubcommand() === 'deposit') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Deposit',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await fetchDiscordWalletDepositAddress(
              discordClient,
              interaction,
              io,
            );
          });
        }
        // Claim Faucet
        if (interaction.options.getSubcommand() === 'faucet') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Faucet',
          );
          if (limited) return;
          const setting = await discordFeatureSettings(
            interaction,
            'faucet',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

          await queue.add(async () => {
            const task = await discordFaucetClaim(
              discordClient,
              interaction,
              io,
            );
          });
        }
        // Show current fee schedule
        if (interaction.options.getSubcommand() === 'fees') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Fees',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await fetchFeeSchedule(
              interaction,
              io,
              groupTaskId,
              channelTaskId,
            );
          });
        }
        // Show coin info
        if (interaction.options.getSubcommand() === 'info') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Info',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await discordCoinInfo(
              discordClient,
              interaction,
              io,
            );
          });
        }
        // Show current price
        if (interaction.options.getSubcommand() === 'price') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Price',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await discordPrice(
              interaction,
              io,
            );
          });
        }
        // Show your stats
        if (interaction.options.getSubcommand() === 'stats') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Stats',
          );
          if (limited) return;
          const filteredMessageDiscord = [];
          filteredMessageDiscord[0] = settings.bot.command.discord.normal;
          filteredMessageDiscord[1] = 'stats';
          filteredMessageDiscord[2] = interaction.options.getString('time');
          await queue.add(async () => {
            const task = await discordStats(
              discordClient,
              interaction,
              filteredMessageDiscord,
              io,
              groupTask,
              channelTask,
            );
          });
        }
        // Lists the user's transactions
        if (interaction.options.getSubcommand() === 'listtransactions') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'ListTransactions',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await fetchDiscordListTransactions(
              discordClient,
              interaction,
              io,
            );
          });
        }
        // Toggle ignoreme
        if (interaction.options.getSubcommand() === 'ignoreme') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'IgnoreMe',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await setIgnoreMe(
              interaction,
              io,
            );
          });
        }
        // Toggle public stats
        if (interaction.options.getSubcommand() === 'publicstats') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'PublicStats',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await discordPublicStats(interaction, io);
          });
        }

        // Initiate Flood
        if (interaction.options.getSubcommand() === 'flood') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Flood',
          );
          if (limited) return;

          await queue.add(async () => {
            disallow = await disallowDirectMessage(
              interaction,
              lastSeenDiscordTask,
              'flood',
              io,
            );
          });
          if (disallow) return;

          const setting = await discordFeatureSettings(
            interaction,
            'flood',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

          const filteredMessageDiscord = [];
          filteredMessageDiscord[0] = settings.bot.command.discord.normal;
          filteredMessageDiscord[1] = 'flood';
          filteredMessageDiscord[2] = interaction.options.getString('amount');
          filteredMessageDiscord[3] = interaction.options.getString('role');
          await executeTipFunction(
            discordFlood,
            queue,
            filteredMessageDiscord[2],
            discordClient,
            interaction,
            filteredMessageDiscord,
            io,
            groupTask,
            channelTask,
            setting,
            faucetSetting,
          );
        }

        if (interaction.options.getSubcommand() === 'rain') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Rain',
          );
          if (limited) return;

          await queue.add(async () => {
            disallow = await disallowDirectMessage(
              interaction,
              lastSeenDiscordTask,
              'rain',
              io,
            );
          });
          if (disallow) return;

          const setting = await discordFeatureSettings(
            interaction,
            'rain',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

          const filteredMessageDiscord = [];
          filteredMessageDiscord[0] = settings.bot.command.discord.normal;
          filteredMessageDiscord[1] = 'rain';
          filteredMessageDiscord[2] = interaction.options.getString('amount');
          filteredMessageDiscord[3] = interaction.options.getString('role');

          await executeTipFunction(
            discordRain,
            queue,
            filteredMessageDiscord[2],
            discordClient,
            interaction,
            filteredMessageDiscord,
            io,
            groupTask,
            channelTask,
            setting,
            faucetSetting,
          );
        }

        if (interaction.options.getSubcommand() === 'soak') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Soak',
          );
          if (limited) return;

          await queue.add(async () => {
            disallow = await disallowDirectMessage(
              interaction,
              lastSeenDiscordTask,
              'soak',
              io,
            );
          });
          if (disallow) return;

          const setting = await discordFeatureSettings(
            interaction,
            'soak',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

          const filteredMessageDiscord = [];
          filteredMessageDiscord[0] = settings.bot.command.discord.normal;
          filteredMessageDiscord[1] = 'soak';
          filteredMessageDiscord[2] = interaction.options.getString('amount');
          filteredMessageDiscord[3] = interaction.options.getString('role');

          await executeTipFunction(
            discordSoak,
            queue,
            filteredMessageDiscord[2],
            discordClient,
            interaction,
            filteredMessageDiscord,
            io,
            groupTask,
            channelTask,
            setting,
            faucetSetting,
          );
        }
        if (interaction.options.getSubcommand() === 'thunder') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Thunder',
          );
          if (limited) return;

          await queue.add(async () => {
            disallow = await disallowDirectMessage(
              interaction,
              lastSeenDiscordTask,
              'thunder',
              io,
            );
          });
          if (disallow) return;

          const setting = await discordFeatureSettings(
            interaction,
            'thunder',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

          const filteredMessageDiscord = [];
          filteredMessageDiscord[0] = settings.bot.command.discord.normal;
          filteredMessageDiscord[1] = 'thunder';
          filteredMessageDiscord[2] = interaction.options.getString('amount');
          filteredMessageDiscord[3] = interaction.options.getString('role');

          await executeTipFunction(
            discordThunder,
            queue,
            filteredMessageDiscord[2],
            discordClient,
            interaction,
            filteredMessageDiscord,
            io,
            groupTask,
            channelTask,
            setting,
            faucetSetting,
          );
        }
        if (interaction.options.getSubcommand() === 'sleet') {
        }

        // Complete command edit message
        await interaction.editReply('Success').catch((e) => {
          console.log(e);
        });
      }

      // If the interaction is a button
      if (interaction.isButton()) {
        // if the button is a faucetClaim
        if (interaction.customId === 'claimFaucet') {
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'discord',
            'Faucet',
          );
          if (limited) return;
          const setting = await discordFeatureSettings(
            interaction,
            'faucet',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

          await queue.add(async () => {
            const task = await discordFaucetClaim(
              discordClient,
              interaction,
              io,
            );
          });
          await interaction.deferUpdate().catch((e) => {
            console.log(e);
          });
        }
      }
      // End Button interactions
    }
  });

  discordClient.on("messageCreate", async (message) => {
    let groupTask;
    let groupTaskId;
    let channelTask;
    let channelTaskId;
    let lastSeenDiscordTask;
    let disallow;
    if (!message.author.bot) {
      const walletExists = await createUpdateDiscordUser(
        discordClient,
        message.author,
        queue,
      );
      await queue.add(async () => {
        groupTask = await updateDiscordGroup(discordClient, message);
        channelTask = await updateDiscordChannel(message, groupTask);
        lastSeenDiscordTask = await updateDiscordLastSeen(
          message,
          message.author,
        );
      });
      groupTaskId = groupTask && groupTask.id;
      channelTaskId = channelTask && channelTask.id;
    }
    if (!message.content.startsWith(settings.bot.command.discord.normal) || message.author.bot) return;
    const maintenance = await isMaintenanceOrDisabled(message, 'discord');
    if (maintenance.maintenance || !maintenance.enabled) return;
    if (groupTask && groupTask.banned) {
      await message.channel.send({
        embeds: [
          discordServerBannedMessage(
            groupTask,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    if (channelTask && channelTask.banned) {
      await message.channel.send({
        embeds: [
          discordChannelBannedMessage(
            channelTask,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    if (lastSeenDiscordTask && lastSeenDiscordTask.banned) {
      await message.channel.send({
        embeds: [
          discordUserBannedMessage(
            lastSeenDiscordTask,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    const faucetSetting = await waterFaucetSettings(
      groupTaskId,
      channelTaskId,
    );
    if (!faucetSetting) return;

    const messageReplaceBreaksWithSpaces = message.content.replace(/\n/g, " ");
    const preFilteredMessageDiscord = messageReplaceBreaksWithSpaces.split(' ');
    const filteredMessageDiscord = preFilteredMessageDiscord.filter((el) => el !== '');

    if (filteredMessageDiscord[1] === undefined) {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Help',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordHelp(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Help',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordHelp(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'fees') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Fees',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchFeeSchedule(
          message,
          io,
          groupTaskId,
          channelTaskId,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'stats') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Stats',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordStats(
          discordClient,
          message,
          filteredMessageDiscord,
          io,
          groupTask,
          channelTask,
        );
      });
    }

    if (settings.coin.halving.enabled) {
      if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'halving') {
        const limited = await myRateLimiter(
          discordClient,
          message,
          'discord',
          'Halving',
        );
        if (limited) return;
        await queue.add(async () => {
          const task = await discordHalving(
            message,
            settings.coin.halving,
            io,
          );
        });
      }
    }

    if (settings.coin.name === 'Pirate') {
      if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'mining') {
        const limited = await myRateLimiter(
          discordClient,
          message,
          'discord',
          'Mining',
        );
        if (limited) return;
        await queue.add(async () => {
          const task = await discordMining(
            message,
            settings.coin.halving,
            io,
          );
        });
      }
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Leaderboard',
      );
      if (limited) return;
      await queue.add(async () => {
        console.log('unavailable');
        // const task = await discordLeaderboard(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'publicstats') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'PublicStats',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordPublicStats(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'info') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Info',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordCoinInfo(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ignoreme') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'IgnoreMe',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await setIgnoreMe(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'balance') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Balance',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchDiscordWalletBalance(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'listtransactions') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'ListTransactions',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchDiscordListTransactions(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'price') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Price',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordPrice(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'faucet') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Faucet',
      );
      if (limited) return;
      const setting = await discordFeatureSettings(
        message,
        'faucet',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

      await queue.add(async () => {
        const task = await discordFaucetClaim(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'deposit') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Deposit',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await fetchDiscordWalletDepositAddress(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'withdraw') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Withdraw',
      );
      if (limited) return;
      const setting = await discordFeatureSettings(
        message,
        'withdraw',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Tip',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'tip',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'tip',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

      if (
        filteredMessageDiscord[1].substr(2).slice(0, -1) === discordClient.user.id
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
          if (
            !filteredMessageDiscord[parseInt(AmountPosition, 10)]
            || !filteredMessageDiscord[parseInt(AmountPosition, 10)].startsWith('<@')
          ) {
            AmountPositionEnded = true;
          }
        }

        await executeTipFunction(
          tipRunesToDiscordUser,
          queue,
          filteredMessageDiscord[parseInt(AmountPosition, 10)],
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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'VoiceRain',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'voicerain',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'voicerain',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Rain',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'rain',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'rain',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Flood',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'flood',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'flood',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Thunder',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'thunder',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'thunder',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'ThunderStorm',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'thunderstorm',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'thunderstorm',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Hurricane',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'hurricane',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'hurricane',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Soak',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'soak',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'soak',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Sleet',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'sleet',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'sleet',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'ReactDrop',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'reactdrop',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'reactdrop',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
      const limited = await myRateLimiter(
        discordClient,
        message,
        'discord',
        'Trivia',
      );
      if (limited) return;

      await queue.add(async () => {
        disallow = await disallowDirectMessage(
          message,
          lastSeenDiscordTask,
          'trivia',
          io,
        );
      });
      if (disallow) return;

      const setting = await discordFeatureSettings(
        message,
        'trivia',
        groupTaskId,
        channelTaskId,
      );
      if (!setting) return;

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
  console.log(`Logged in as ${discordClient.user.tag}!`);
};
