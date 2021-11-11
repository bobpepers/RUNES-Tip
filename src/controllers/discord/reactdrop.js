/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  reactDropMessage,
  invalidAmountMessage,
  minimumTipMessage,
  userNotFoundMessage,
  insufficientBalanceMessage,
  minimumTimeReactDropMessage,
  invalidTimeMessage,
} from '../../messages/discord';

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const emojiCompact = require('../../config/emoji.json');
const logger = require('../../helpers/logger');

function shuffle(array) {
  let currentIndex = array.length; let
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const discordReactDrop = async (client, message, filteredMessage) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      const tipper = await db.user.findOne({
        where: {
          user_id: `discord-${message.author.id}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            include: [
              {
                model: db.address,
                as: 'addresses',
              },
            ],
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (tipper) {
        amount = tipper.wallet.available;
      } else {
        amount = 0;
      }
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }
    if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'ReactDrop')] });
    } else if (amount < Number(process.env.MINMUM_REACTDROP)) {
      await message.channel.send({ embeds: [minimumTipMessage(message)] });
    } else if (amount >= Number(process.env.MINMUM_REACTDROP) && amount % 1 === 0) {
      const user = await db.user.findOne({
        where: {
          user_id: `discord-${message.author.id}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!user) {
        await message.channel.send({ embeds: [userNotFoundMessage(message, 'ReactDrop')] });
      }
      if (user) {
        if (amount > user.wallet.available) {
          await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Reactdrop')] });
        }
        if (amount <= user.wallet.available) {
          /// Reactdrop

          // Convert Message time to MS
          let textTime = '5m';
          if (filteredMessage[3]) {
            textTime = filteredMessage[3];
          }
          // const textTime = filteredMessage[3];
          const cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
          const cutNumberTime = textTime.substring(0, textTime.length - 1);
          const isnum = /^\d+$/.test(cutNumberTime);
          console.log('cut last letter');
          console.log(cutLastTimeLetter);
          if (
            !isnum
            // && Number(cutNumberTime) < 0
            || (
              cutLastTimeLetter !== 'd'
          && cutLastTimeLetter !== 'm'
          && cutLastTimeLetter !== 's')
          ) {
            await message.channel.send({ embeds: [invalidTimeMessage(message, 'Reactdrop')] });
          } else if (cutLastTimeLetter === 's' && Number(cutNumberTime) < 60) {
            await message.channel.send({ embeds: [minimumTimeReactDropMessage(message)] });
          } else {
            const allEmojis = emojiCompact;
            await message.guild.emojis.cache.forEach((customEmoji) => {
              allEmojis.push(`<:${customEmoji.name}:${customEmoji.id}>`);
            });
            console.log(allEmojis);
            if (!filteredMessage[4]) {
              filteredMessage[4] = '❤️';
            }

            if (!allEmojis.includes(filteredMessage[4])) {
              await message.channel.send({ embeds: [invalidTimeMessage(message, 'Reactdrop')] });
            } else {
              let dateObj = await new Date().getTime();
              if (cutLastTimeLetter === 'd') {
                dateObj += Number(cutNumberTime) * 24 * 60 * 1000;
              }
              if (cutLastTimeLetter === 'm') {
                dateObj += Number(cutNumberTime) * 60 * 1000;
              }
              if (cutLastTimeLetter === 's') {
                dateObj += Number(cutNumberTime) * 1000;
              }
              dateObj = await new Date(dateObj);
              const countDownDate = await dateObj.getTime();
              let now = await new Date().getTime();
              let distance = countDownDate - now;

              const randomAmount = Math.floor(Math.random() * 3) + 1;
              const useEmojis = [];
              for (let i = 0; i < randomAmount; i++) {
                const randomX = Math.floor(Math.random() * allEmojis.length);
                useEmojis.push(allEmojis[randomX]);
              }
              useEmojis.push(filteredMessage[4]);

              console.log('useEmojis');
              console.log(useEmojis);
              console.log(message.guildId);

              const shuffeledEmojisArray = await shuffle(useEmojis);

              console.log(shuffeledEmojisArray);
              const findGroup = await db.group.findOne({
                where: {
                  groupId: `discord-${message.guildId}`,
                },
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              if (!findGroup) {
                console.log('group not found');
              } else {
                console.log(message);
                const newReactDrop = await db.reactdrop.create({
                  amount,
                  groupId: findGroup.id,
                  ends: dateObj,
                  emoji: filteredMessage[4],
                  discordMessageId: message.id,
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
                const sendReactDropMessage = await message.channel.send({ embeds: [reactDropMessage(distance, message, filteredMessage[4])] });
                const reactMessage = await client.guilds.cache.get(sendReactDropMessage.guildId)
                  .channels.cache.get(sendReactDropMessage.channelId)
                  .messages.fetch(sendReactDropMessage.id);
                for (const shufEmoji of shuffeledEmojisArray) {
                  await reactMessage.react(shufEmoji);
                }
                const updateMessage = setInterval(async () => {
                  now = new Date().getTime();
                  distance = countDownDate - now;
                  await reactMessage.edit({ embeds: [reactDropMessage(distance, message, filteredMessage[4])] });
                  if (distance < 0) {
                    clearInterval(updateMessage);
                  }
                }, 5000);
                logger.info(`Success started reactdrop Requested by: ${user.user_id}-${user.username} with ${amount / 1e8} ${process.env.CURRENCY_SYMBOL}`);
              }

              // const wallet = await user.wallet.update({
              //  available: user.wallet.available - amount,
              // }, {
              //  transaction: t,
              //  lock: t.LOCK.UPDATE,
              // });

              // console.log('sendReactDropMessage');
              // console.log(sendReactDropMessage);

              // const guild = await client.guilds.cache.get(sendReactDropMessage.guildId);

              // console.log(guild.emojis.cache);
              // const emojiList = message.guild.emojis.cache.map((emoji) => emoji.toString());

              // console.log(reactMessage.guild.emojis.cache);
              // const charactersPerMessage = 2000;
              // we're going to go with 2000 instead of 2048 for breathing room
              // await message.guild.emojis.cache.get();
              // console.log(message.guild.emojis.cache);

              // await reactMessage.react(shuffeledEmojisArray[1]);
            }
          }
        }
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
    message.channel.send("Something went wrong.");
  });
};
