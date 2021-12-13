/* eslint-disable import/prefer-default-export */
import { svg2png } from 'svg-png-converter';

import svgCaptcha from "svg-captcha";
import { Transaction } from "sequelize";
import {
  MessageAttachment,
  // MessageCollector,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { AlgebraicCaptcha } from "algebraic-captcha";
import getCoinSettings from '../../config/settings';
import {
  reactDropMessage,
  userNotFoundMessage,
  minimumTimeReactDropMessage,
  invalidTimeMessage,
  ReactdropCaptchaMessage,
  AfterReactDropSuccessMessage,
  invalidEmojiMessage,
  maxTimeReactdropMessage,
} from '../../messages/discord';
import db from '../../models';
import emojiCompact from "../../config/emoji";
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/discord/validateAmount";

const settings = getCoinSettings();

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

export const listenReactDrop = async (reactMessage, distance, reactDrop, io) => {
  const filter = () => true;
  const collector = reactMessage.createReactionCollector({ filter, time: distance });
  collector.on('collect', async (reaction, collector) => {
    if (!collector.bot) {
      const findReactUser = await db.user.findOne({
        where: {
          user_id: `discord-${collector.id}`,
        },
      });
      const findReactTip = await db.reactdroptip.findOne({
        where: {
          userId: findReactUser.id,
          reactdropId: reactDrop.id,
        },
      });
      if (!findReactTip) {
        let captcha;
        let captchaPng;
        let findReactTip;
        const backgroundArray = [
          '#cc9966',
          '#ffffff',
          "#FF5733",
          "#33FFE6",
          "#272F92 ",
          "#882792",
          "#922759",
        ];
        const captchaTypeArray = [
          'svg',
          'algebraic',
        ];
        const randomFunc = captchaTypeArray[Math.floor(Math.random() * captchaTypeArray.length)];
        const randomBackground = backgroundArray[Math.floor(Math.random() * backgroundArray.length)];
        if (randomFunc === 'svg') {
          while (!captcha || Number(captcha.text) < 0) {
            captcha = svgCaptcha.createMathExpr({
              mathMin: 0,
              mathMax: 9,
              mathOperator: '+-',
              background: randomBackground,
              noise: 15,
              color: true,
            });
          }

          console.log(captcha);
          captchaPng = await svg2png({
            input: `${captcha.data}`.trim(),
            encoding: 'dataURL',
            format: 'png',
            width: 150,
            height: 50,
            multiplier: 3,
            quality: 1,
          });
          findReactTip = await db.reactdroptip.create({
            status: 'waiting',
            captchaType: 'svg',
            solution: captcha.text,
            userId: findReactUser.id,
            reactdropId: reactDrop.id,
          });
        }
        if (randomFunc === 'algebraic') {
          const modes = [
            'formula',
            'equation',
          ];
          while (!captcha || Number(captcha.answer) < 0) {
            const preCaptcha = new AlgebraicCaptcha({
              width: 150,
              height: 50,
              background: randomBackground,
              noise: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
              minValue: 1,
              maxValue: 20,
              operandAmount: Math.floor((Math.random() * 2) + 1),
              operandTypes: ['+', '-'],
              mode: modes[Math.round(Math.random())],
              targetSymbol: '?',
            });
            // eslint-disable-next-line no-await-in-loop
            captcha = await preCaptcha.generateCaptcha();
          }

          console.log(captcha);
          captchaPng = await svg2png({
            input: `${captcha.image}`.trim(),
            encoding: 'dataURL',
            format: 'png',
            width: 150,
            height: 50,
            multiplier: 3,
            quality: 1,
          });
          findReactTip = await db.reactdroptip.create({
            status: 'waiting',
            captchaType: 'algebraic',
            solution: captcha.answer.toString(),
            userId: findReactUser.id,
            reactdropId: reactDrop.id,
          });
        }

        // eslint-disable-next-line no-underscore-dangle
        const constructEmoji = reaction._emoji.id ? `<:${reaction._emoji.name}:${reaction._emoji.id}>` : reaction._emoji.name;
        if (reactDrop.emoji !== constructEmoji) {
          collector.send('Failed, pressed wrong emoji');
          await findReactTip.update({ status: 'failed' });
        } else {
          const captchaPngFixed = captchaPng.replace('data:image/png;base64,', '');
          const awaitCaptchaMessage = await collector.send({
            embeds: [ReactdropCaptchaMessage(collector.id)],
            files: [new MessageAttachment(Buffer.from(captchaPngFixed, 'base64'), 'captcha.png')],
          });
          const Ccollector = await awaitCaptchaMessage.channel.createMessageCollector({ filter, time: 60000, max: 1 });
          Ccollector.on('collect', async (m) => {
            await db.sequelize.transaction({
              isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
            }, async (t) => {
              console.log(m.content);
              console.log(findReactTip.solution);
              if (m.content === findReactTip.solution) {
                await findReactTip.update(
                  {
                    status: 'success',
                  },
                  {
                    lock: t.LOCK.UPDATE,
                    transaction: t,
                  },
                );
                const reactDropRecord = await db.reactdrop.findOne({
                  where: {
                    id: findReactTip.reactdropId,
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
                  ],
                  lock: t.LOCK.UPDATE,
                  transaction: t,
                });

                const row = new MessageActionRow().addComponents(
                  new MessageButton()
                    .setLabel('Back to ReactDrop')
                    .setStyle('LINK')
                    .setURL(`https://discord.com/channels/${reactDropRecord.group.groupId.replace("discord-", "")}/${reactDropRecord.channel.channelId.replace("discord-", "")}/${reactDropRecord.discordMessageId}`),
                );

                await m.react('✅');
                await collector.send({ content: '\u200b', components: [row] });
              } else {
                await findReactTip.update({
                  status: 'failed',
                }, {
                  lock: t.LOCK.UPDATE,
                  transaction: t,
                });
                const reactDropRecord = await db.reactdrop.findOne({
                  where: {
                    id: findReactTip.reactdropId,
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
                  ],
                  lock: t.LOCK.UPDATE,
                  transaction: t,
                });
                const row = new MessageActionRow().addComponents(
                  new MessageButton()
                    .setLabel('Back to ReactDrop')
                    .setStyle('LINK')
                    .setURL(`https://discord.com/channels/${reactDropRecord.group.groupId.replace("discord-", "")}/${reactDropRecord.channel.channelId.replace("discord-", "")}/${reactDropRecord.discordMessageId}`),
                );
                m.react('❌');
                await collector.send({ content: '\u200b', components: [row] });
              }
              t.afterCommit(() => {
                console.log('done');
              });
            }).catch((err) => {
              console.log('failed');
            });
          });
          Ccollector.on('end', async (collected) => {
            await db.sequelize.transaction({
              isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
            }, async (t) => {
              const findReactUserTwo = await db.user.findOne({
                where: {
                  user_id: `discord-${collector.id}`,
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              const findReactTipTwo = await db.reactdroptip.findOne({
                where: {
                  userId: findReactUserTwo.id,
                  reactdropId: reactDrop.id,
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              if (findReactTipTwo.status === 'waiting') {
                await findReactTipTwo.update({
                  status: 'failed',
                }, {
                  lock: t.LOCK.UPDATE,
                  transaction: t,
                });
                collector.send('Out of time');
              }
              t.afterCommit(() => {
                console.log('done');
                // collector.send('Out of time');
              });
            }).catch((err) => {
              console.log(err);
              collector.send('Something went wrong');
            });
          });
        }
      }
    }
  });
  collector.on('end', async () => {
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      const endReactDrop = await db.reactdrop.findOne({
        where: {
          id: reactDrop.id,
        },
        include: [
          {
            model: db.reactdroptip,
            as: 'reactdroptips',
            required: false,
            where: {
              status: 'success',
            },
            include: [
              {
                model: db.user,
                as: 'user',
                include: [
                  {
                    model: db.wallet,
                    as: 'wallet',
                  },
                ],
              },
            ],
          },
          {
            model: db.user,
            as: 'user',
          },
        ],
      });
      if (endReactDrop) {
        if (endReactDrop.reactdroptips.length <= 0) {
          const returnWallet = await db.wallet.findOne({
            where: {
              userId: endReactDrop.userId,
            },
          });
          const updatedWallet = await returnWallet.update({
            available: returnWallet.available + endReactDrop.amount,
          });
          await endReactDrop.update({
            ended: true,
          });
          reactMessage.channel.send('Nobody claimed, returning funds to reactdrop initiator');
        } else {
          const amountEach = ((Number(endReactDrop.amount) - Number(endReactDrop.feeAmount)) / Number(endReactDrop.reactdroptips.length)).toFixed(0);

          console.log("amountEach");
          console.log(amountEach);
          await endReactDrop.update({
            ended: true,
            userCount: Number(endReactDrop.reactdroptips.length),
          });

          const listOfUsersRained = [];
          // eslint-disable-next-line no-restricted-syntax
          for (const receiver of endReactDrop.reactdroptips) {
            // eslint-disable-next-line no-await-in-loop
            const earnerWallet = await receiver.user.wallet.update({
              available: receiver.user.wallet.available + Number(amountEach),
            });

            if (receiver.user.ignoreMe) {
              listOfUsersRained.push(`${receiver.user.username}`);
            } else {
              const userIdReceivedRain = receiver.user.user_id.replace('discord-', '');
              listOfUsersRained.push(`<@${userIdReceivedRain}>`);
            }
            let tipActivity;
            // eslint-disable-next-line no-await-in-loop
            tipActivity = await db.activity.create({
              amount: Number(amountEach),
              type: 'reactdroptip_s',
              spenderId: endReactDrop.user.id,
              earnerId: receiver.user.id,
              reactdropId: endReactDrop.id,
              reactdroptipId: receiver.id,
              earner_balance: earnerWallet.available + earnerWallet.locked,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            // eslint-disable-next-line no-await-in-loop
            tipActivity = await db.activity.findOne({
              where: {
                id: tipActivity.id,
              },
              include: [
                {
                  model: db.user,
                  as: 'earner',
                },
                {
                  model: db.user,
                  as: 'spender',
                },
                {
                  model: db.reactdrop,
                  as: 'reactdrop',
                },
                {
                  model: db.reactdroptip,
                  as: 'reactdroptip',
                },
              ],
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            console.log(tipActivity);
            io.to('admin').emit('updateActivity', {
              activity: tipActivity,
            });
          }
          const newStringListUsers = listOfUsersRained.join(", ");
          // console.log(newStringListUsers);
          const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
          // eslint-disable-next-line no-restricted-syntax
          for (const element of cutStringListUsers) {
            // eslint-disable-next-line no-await-in-loop
            await reactMessage.channel.send(element);
          }
          const initiator = endReactDrop.user.user_id.replace('discord-', '');
          reactMessage.channel.send({ embeds: [AfterReactDropSuccessMessage(endReactDrop, amountEach, initiator)] });
          // reactMessage.channel.send(`${endReactDrop.reactdroptips.length} user(s) will share ${endReactDrop.amount / 1e8} ${process.env.CURRENCY_SYMBOL} (${amountEach / 1e8} each)`);
        }
      }

      t.afterCommit(() => {
        console.log('done');
      });
    }).catch((err) => {
      console.log('error');
    });
  });
};

export const discordReactDrop = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
) => {
  let activity;
  let user;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    user = await db.user.findOne({
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
      activity = await db.activity.create({
        type: 'reactdrop_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [userNotFoundMessage(message, 'ReactDrop')] });
      return;
    }

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[2],
      user,
      setting,
      'reactdrop',
    );
    if (activityValiateAmount) {
      activity = activityValiateAmount;
      return;
    }

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

    if (
      !isnum
      // && Number(cutNumberTime) < 0
      || (
        cutLastTimeLetter !== 'd'
        && cutLastTimeLetter !== 'h'
        && cutLastTimeLetter !== 'm'
        && cutLastTimeLetter !== 's')
    ) {
      activity = await db.activity.create({
        type: 'reactdrop_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [invalidTimeMessage(message, 'Reactdrop')] });
    } else if (cutLastTimeLetter === 's' && Number(cutNumberTime) < 60) {
      activity = await db.activity.create({
        type: 'reactdrop_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [minimumTimeReactDropMessage(message)] });
    } else {
      const allEmojis = emojiCompact;
      await message.guild.emojis.cache.forEach((customEmoji) => {
        allEmojis.push(`<:${customEmoji.name}:${customEmoji.id}>`);
      });
      if (!filteredMessage[4]) {
        filteredMessage[4] = '❤️';
      }

      if (!allEmojis.includes(filteredMessage[4])) {
        activity = await db.activity.create({
          type: 'reactdrop_f',
          spenderId: user.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        await message.channel.send({ embeds: [invalidEmojiMessage(message, 'Reactdrop')] });
      } else {
        if (Number(cutNumberTime) * 24 * 60 * 60 * 1000 > 172800000) {
          await message.channel.send({ embeds: [maxTimeReactdropMessage(message)] });
          return;
        }
        let dateObj = await new Date().getTime();
        if (cutLastTimeLetter === 'd') {
          dateObj += Number(cutNumberTime) * 24 * 60 * 60 * 1000;
        }
        if (cutLastTimeLetter === 'h') {
          dateObj += Number(cutNumberTime) * 60 * 60 * 1000;
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
        await useEmojis.push(filteredMessage[4]);

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
          const wallet = await user.wallet.update({
            available: user.wallet.available - amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          console.log(distance);
          console.log('distance');
          const sendReactDropMessage = await message.channel.send({ embeds: [reactDropMessage(distance, message.author.id, filteredMessage[4], amount)] });
          const group = await db.group.findOne({
            where: {
              groupId: `discord-${message.guildId}`,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const channel = await db.channel.findOne({
            where: {
              channelId: `discord-${message.channelId}`,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
          const newReactDrop = await db.reactdrop.create({
            feeAmount: Number(fee),
            amount,
            groupId: group.id,
            channelId: channel.id,
            ends: dateObj,
            emoji: filteredMessage[4],
            discordMessageId: sendReactDropMessage.id,
            userId: user.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          activity = await db.activity.create({
            amount,
            type: 'reactdrop_s',
            spenderId: user.id,
            reactdropId: newReactDrop.id,
            spender_balance: wallet.available + wallet.locked,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          activity = await db.activity.findOne({
            where: {
              id: activity.id,
            },
            include: [
              {
                model: db.reactdrop,
                as: 'reactdrop',
              },
              {
                model: db.user,
                as: 'spender',
              },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,

          });

          const reactMessage = await discordClient.guilds.cache.get(sendReactDropMessage.guildId)
            .channels.cache.get(sendReactDropMessage.channelId)
            .messages.fetch(sendReactDropMessage.id);

          listenReactDrop(reactMessage, distance, newReactDrop, io);

          // eslint-disable-next-line no-restricted-syntax
          for (const shufEmoji of shuffeledEmojisArray) {
            // eslint-disable-next-line no-await-in-loop
            await reactMessage.react(shufEmoji);
          }

          const updateMessage = setInterval(async () => {
            now = new Date().getTime();
            console.log('listen');
            distance = countDownDate - now;
            await reactMessage.edit({ embeds: [reactDropMessage(distance, message.author.id, filteredMessage[4], amount)] });
            if (distance < 0) {
              clearInterval(updateMessage);
            }
          }, 5000);
          logger.info(`Success started reactdrop Requested by: ${user.user_id}-${user.username} with ${amount / 1e8} ${settings.coin.ticker}`);
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
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
