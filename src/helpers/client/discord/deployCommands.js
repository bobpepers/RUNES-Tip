import { config } from "dotenv";
import {
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import getCoinSettings from '../../../config/settings';

config();

const settings = getCoinSettings();

const mainTipBotCommand = new SlashCommandBuilder().setName(`${settings.bot.command.discord.slash}`).setDescription(`'Use ${settings.bot.name}`);

mainTipBotCommand
  .addSubcommand(
    (subcommand) => subcommand
      .setName('help')
      .setDescription('Usage info'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('balance')
      .setDescription('Show your balance'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('deposit')
      .setDescription('Show your deposit address'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('faucet')
      .setDescription('Claim the faucet'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('info')
      .setDescription('Show info about the coin'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('ignoreme')
      .setDescription('Toggle ignoreme'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('price')
      .setDescription('Show the current price'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('fees')
      .setDescription('Show the current fee scheduele'),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('listtransactions')
      .setDescription(`Shows the user's last 10 deposits and withdrawal`),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('publicstats')
      .setDescription(`Toggle Public Stats`),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('stats')
      .setDescription(`Show the user's stats`)
      .addStringOption((option) => option.setName('time').setDescription('choose how far in time we have to look back (example: 7d)')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('reactdrop')
      .setDescription('initiate a reactdrop')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addStringOption((option) => option.setName('time').setDescription('Choose a time (examples: 60s, 2m, 1h, 1d) (min: 60s) (max: 2d)'))
      .addStringOption((option) => option.setName('emoji').setDescription('Choose an emoji to use')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('flood')
      .setDescription('initiate a flood')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('rain')
      .setDescription('initiate a rain')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('soak')
      .setDescription('initiate a soak')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('thunder')
      .setDescription('initiate a thunder')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('thunderstorm')
      .setDescription('initiate a thunderstorm')
      .addStringOption((option) => option.setName('people').setDescription('Enter an amount of people to receive thunderstorm').setRequired(true))
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('hurricane')
      .setDescription('initiate a hurricane')
      .addStringOption((option) => option.setName('people').setDescription('Enter an amount of people to receive thunderstorm').setRequired(true))
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('trivia')
      .setDescription('initiate a trivia question')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addStringOption((option) => option.setName('people').setDescription('Enter an amount of people to receive trivia'))
      .addStringOption((option) => option.setName('time').setDescription('Choose a time (examples: 60s, 2m, 1h, 1d) (min: 60s) (max: 2d)')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('voicerain')
      .setDescription('initiate a voicerain')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addChannelOption((option) => option.setName('channel').setDescription('Enter a voice-channel').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('tip')
      .setDescription('initiate a tipping')
      .addStringOption((option) => option.setName('users').setDescription('Tag the users you want to tip').setRequired(true))
      .addStringOption((option) => option.setName('amount').setDescription('Enter the amount you want to tip').setRequired(true))
      .addStringOption((option) => option.setName('type')
        .setDescription('Each (Tip each user the amount) or Split (Split the amount between the users)')
        .addChoices(
          { name: 'Each', value: 'each' },
          { name: 'Split', value: 'split' },
        )),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('sleet')
      .setDescription('initiate a sleet')
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
      .addStringOption((option) => option.setName('time').setDescription('Choose a time (examples: 60s, 2m, 1h, 1d)'))
      .addRoleOption((option) => option.setName('role').setDescription('Optional role')),
  );

if (settings.coin.name === 'Pirate') {
  mainTipBotCommand
    .addSubcommand(
      (subcommand) => subcommand
        .setName('mining')
        .setDescription(`Get Mining info`),
    )
    .addSubcommand(
      (subcommand) => subcommand
        .setName('halving')
        .setDescription(`Get halving info`),
    ).addSubcommand(
      (subcommand) => subcommand
        .setName('withdraw')
        .setDescription('initiate a withdrawal')
        .addStringOption((option) => option.setName('address').setDescription('Enter a address').setRequired(true))
        .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true))
        .addStringOption((option) => option.setName('memo').setDescription('an optional memo')),
    );
} else {
  mainTipBotCommand.addSubcommand(
    (subcommand) => subcommand
      .setName('withdraw')
      .setDescription('initiate a withdrawal')
      .addStringOption((option) => option.setName('address').setDescription('Enter a address').setRequired(true))
      .addStringOption((option) => option.setName('amount').setDescription('Enter an amount').setRequired(true)),
  );
}

const commands = [
  mainTipBotCommand,
].map((command) => command.toJSON());

export const deployCommands = async (
  botToken,
  clientId,
) => {
  const rest = new REST({ version: '10' }).setToken(botToken);

  rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
};
