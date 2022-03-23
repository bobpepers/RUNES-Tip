import {
  MessageActionRow,
  MessageButton,
} from "discord.js";
import _ from 'lodash';
import db from "../models";
import {
  reactDropMessage,
  triviaMessageDiscord,
} from "../messages/discord";
import { listenReactDrop } from "../controllers/discord/reactdrop";
import { listenTrivia } from "../controllers/discord/trivia";

export const recoverDiscordReactdrops = async (
  discordClient,
  io,
  queue,
) => {
  const allRunningReactDrops = await db.reactdrop.findAll({
    where: {
      ended: false,
    },
    include: [
      {
        model: db.group,
        as: 'group',
      },
      {
        model: db.channel,
        as: 'channel',
      },
      {
        model: db.user,
        as: 'user',
      },
    ],
  });
  // eslint-disable-next-line no-restricted-syntax
  for (const runningReactDrop of allRunningReactDrops) {
    const actualChannelId = runningReactDrop.channel.channelId.replace('discord-', '');
    const actualGroupId = runningReactDrop.group.groupId.replace('discord-', '');
    const actualUserId = runningReactDrop.user.user_id.replace('discord-', '');

    // eslint-disable-next-line no-await-in-loop
    const reactMessage = await discordClient.guilds.cache.get(actualGroupId)
      .channels.cache.get(actualChannelId)
      .messages.fetch(runningReactDrop.discordMessageId);
    // eslint-disable-next-line no-await-in-loop
    const countDownDate = await runningReactDrop.ends.getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    console.log('recover listenReactDrop');
    // eslint-disable-next-line no-await-in-loop
    await listenReactDrop(
      reactMessage,
      distance,
      runningReactDrop,
      io,
      queue,
    );
    // eslint-disable-next-line no-loop-func
    const updateMessage = setInterval(async () => {
      now = new Date().getTime();
      distance = countDownDate - now;
      await reactMessage.edit({
        embeds: [
          reactDropMessage(
            runningReactDrop.id,
            distance,
            actualUserId,
            runningReactDrop.emoji,
            runningReactDrop.amount,
          ),
        ],
      });
      if (distance < 0) {
        clearInterval(updateMessage);
      }
    }, 10000);
  }
  return true;
};

export const recoverDiscordTrivia = async (
  discordClient,
  io,
  queue,
) => {
  const allRunningTrivia = await db.trivia.findAll({
    where: {
      ended: false,
    },
    include: [
      {
        model: db.group,
        as: 'group',
      },
      {
        model: db.channel,
        as: 'channel',
      },
      {
        model: db.user,
        as: 'user',
      },
      {
        model: db.triviaquestion,
        as: 'triviaquestion',
        include: [
          {
            model: db.triviaanswer,
            as: 'triviaanswers',
          },
        ],
      },
    ],
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const runningTrivia of allRunningTrivia) {
    const actualChannelId = runningTrivia.channel.channelId.replace('discord-', '');
    const actualGroupId = runningTrivia.group.groupId.replace('discord-', '');
    const actualUserId = runningTrivia.user.user_id.replace('discord-', '');

    // eslint-disable-next-line no-await-in-loop
    const triviaMessage = await discordClient.guilds.cache.get(actualGroupId)
      .channels.cache.get(actualChannelId)
      .messages.fetch(runningTrivia.discordMessageId);

    // eslint-disable-next-line no-await-in-loop
    const countDownDate = await runningTrivia.ends.getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    const row = new MessageActionRow();
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const answers = _.shuffle(runningTrivia.triviaquestion.triviaanswers);
    let answerString = '';
    let positionAlphabet = 0;
    // console.log(answers);
    // eslint-disable-next-line no-restricted-syntax
    for (const answer of answers) {
      row.addComponents(
        new MessageButton()
          .setCustomId(answer.answer)
          .setLabel(alphabet[parseInt(positionAlphabet, 10)])
          .setStyle('PRIMARY'),
      );
      answerString += `${alphabet[parseInt(positionAlphabet, 10)]}. ${answer.answer}\n`;
      positionAlphabet += 1;
    }
    // eslint-disable-next-line no-await-in-loop
    await triviaMessage.edit({
      embeds: [
        triviaMessageDiscord(
          runningTrivia.id,
          distance,
          actualUserId,
          runningTrivia.triviaquestion.question,
          answerString,
          runningTrivia.amount,
          runningTrivia.userCount,
        ),
      ],
      components: [row],
    });
    // eslint-disable-next-line no-loop-func
    const updateMessage = setInterval(async () => {
      now = new Date().getTime();
      distance = countDownDate - now;
      await triviaMessage.edit({
        embeds: [
          triviaMessageDiscord(
            runningTrivia.id,
            distance,
            actualUserId,
            runningTrivia.triviaquestion.question,
            answerString,
            runningTrivia.amount,
            runningTrivia.userCount,
          ),
        ],
      });
      if (distance < 0) {
        clearInterval(updateMessage);
      }
    }, 10000);
    console.log('recover trivia');
    // eslint-disable-next-line no-await-in-loop
    listenTrivia(
      triviaMessage,
      distance,
      runningTrivia,
      io,
      queue,
      updateMessage,
      answerString,
    );
  }
  return true;
};
