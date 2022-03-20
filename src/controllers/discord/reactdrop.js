/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import { svg2png } from 'svg-png-converter';
import _ from 'lodash';
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
  ReactDropReturnInitiatorMessage,
  NotInDirectMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import emojiCompact from "../../config/emoji";
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/discord/validateAmount";
import { waterFaucet } from "../../helpers/waterFaucet";

const settings = getCoinSettings();

function shuffle(array) {
  let currentIndex = array.length; let
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    // currentIndex--;
    currentIndex -= 1;

    // And swap it with the current element.
    // eslint-disable-next-line no-param-reassign
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const listenReactDrop = async (
  reactMessage,
  distance,
  reactDrop,
  io,
  queue,
) => {
  const filter = () => true;
  const collector = reactMessage.createReactionCollector({ filter, time: distance });
  collector.on('collect', async (
    reaction,
    collector,
  ) => {
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
          // console.log(captcha);
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
              maxValue: 9,
              operandAmount: Math.floor((Math.random() * 2) + 1),
              operandTypes: ['+', '-'],
              mode: modes[Math.round(Math.random())],
              targetSymbol: '?',
            });
            // eslint-disable-next-line no-await-in-loop
            captcha = await preCaptcha.generateCaptcha();
          }

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
        let constructEmoji;
        if (reaction._emoji && reaction._emoji.animated) {
          constructEmoji = reaction._emoji.id ? `<a:${reaction._emoji.name}:${reaction._emoji.id}>` : reaction._emoji.name;
        } else if (reaction._emoji && !reaction._emoji.animated) {
          constructEmoji = reaction._emoji.id ? `<:${reaction._emoji.name}:${reaction._emoji.id}>` : reaction._emoji.name;
        }

        if (reactDrop.emoji !== constructEmoji) {
          await collector.send('Failed, pressed wrong emoji').catch((e) => {
            console.log(e);
          });
          await findReactTip.update({ status: 'failed' });
        } else {
          const captchaPngFixed = captchaPng.replace('data:image/png;base64,', '');
          const awaitCaptchaMessage = await collector.send({
            embeds: [ReactdropCaptchaMessage(collector.id)],
            files: [new MessageAttachment(Buffer.from(captchaPngFixed, 'base64'), 'captcha.png')],
          }).catch((e) => {
            console.log(e);
          });
          const Ccollector = await awaitCaptchaMessage.channel.createMessageCollector({ filter, time: 60000, max: 1 });
          await Ccollector.on('collect', async (m) => {
            await db.sequelize.transaction({
              isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
            }, async (t) => {
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
                await collector.send({ content: '\u200b', components: [row] }).catch((e) => {
                  console.log(e);
                });
              } else if (m.content !== findReactTip.solution) {
                // console.log('content');
                // console.log(m.content);
                // console.log(findReactTip.solution);
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
                await m.react('❌');
                await collector.send({
                  content: `Failed
Solution: **${findReactTip.solution}**`,
                  components: [row],
                }).catch((e) => {
                  console.log(e);
                });
              }
              t.afterCommit(() => {
                console.log('done');
              });
            }).catch(async (err) => {
              try {
                await db.error.create({
                  type: 'collectAnswerReactDrop',
                  error: `${err}`,
                });
              } catch (e) {
                logger.error(`Error Discord: ${e}`);
              }
              console.log('failed');
            });
          });

          await Ccollector.on('end', async (collected) => {
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((r) => setTimeout(r, 200));
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
                collector.send('Out of time').catch((e) => {
                  console.log(e);
                });
              }
              t.afterCommit(() => {
                console.log('done');
              });
            }).catch(async (err) => {
              try {
                await db.error.create({
                  type: 'endAnswerReactDrop',
                  error: `${err}`,
                });
              } catch (e) {
                logger.error(`Error Discord: ${e}`);
              }
              console.log(err);
              await collector.send('Something went wrong').catch((e) => {
                console.log(e);
              });
            });
            // await queue.add(() => endingCollectReactdrop);
          });
        }
      }
    }
  });
  collector.on('end', async () => {
    await queue.add(async () => {
      const activity = [];
      const endingReactdrop = await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        const endReactDrop = await db.reactdrop.findOne({
          where: {
            id: reactDrop.id,
            ended: false,
          },
          lock: t.LOCK.UPDATE,
          transaction: t,
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
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            const updatedWallet = await returnWallet.update({
              available: returnWallet.available + endReactDrop.amount,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            await endReactDrop.update({
              ended: true,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            await reactMessage.channel.send({ embeds: [ReactDropReturnInitiatorMessage()] });
          } else {
          // Get Faucet Settings
            let faucetSetting;
            faucetSetting = await db.features.findOne({
              where: {
                type: 'local',
                name: 'faucet',
                groupId: endReactDrop.group.id,
                channelId: endReactDrop.channel.id,
              },
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            if (!faucetSetting) {
              faucetSetting = await db.features.findOne({
                where: {
                  type: 'local',
                  name: 'faucet',
                  groupId: endReactDrop.group.id,
                  channelId: null,
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
            }
            if (!faucetSetting) {
              faucetSetting = await db.features.findOne({
                where: {
                  type: 'global',
                  name: 'faucet',
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
            }
            // water the faucet
            const faucetWatered = await waterFaucet(
              t,
              Number(endReactDrop.feeAmount),
              faucetSetting,
            );
            //
            const amountEach = ((Number(endReactDrop.amount) - Number(endReactDrop.feeAmount)) / Number(endReactDrop.reactdroptips.length)).toFixed(0);

            await endReactDrop.update({
              ended: true,
              userCount: Number(endReactDrop.reactdroptips.length),
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });

            const listOfUsersRained = [];
            const withoutBotsSorted = await _.sortBy(endReactDrop.reactdroptips, 'createdAt');
            // eslint-disable-next-line no-restricted-syntax
            for (const receiver of withoutBotsSorted) {
            // eslint-disable-next-line no-await-in-loop
              const earnerWallet = await receiver.user.wallet.update({
                available: receiver.user.wallet.available + Number(amountEach),
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
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
              activity.unshift(tipActivity);
            }
            const newStringListUsers = listOfUsersRained.join(", ");
            const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
            // eslint-disable-next-line no-await-in-loop
              await reactMessage.channel.send(element);
            }
            const initiator = endReactDrop.user.user_id.replace('discord-', '');
            await reactMessage.channel.send({ embeds: [AfterReactDropSuccessMessage(endReactDrop, amountEach, initiator)] });
          }
        }

        t.afterCommit(() => {
          console.log('done');
        });
      }).catch(async (err) => {
        try {
          await db.error.create({
            type: 'endReactDrop',
            error: `${err}`,
          });
        } catch (e) {
          logger.error(`Error Discord: ${e}`);
        }
        console.log(err);
        console.log('error');
      });
      io.to('admin').emit('updateActivity', {
        activity,
      });
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
  faucetSetting,
  queue,
) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Reactdrop')] }).catch((e) => {
      console.log(e);
    });
    return;
  }
  let activity = [];
  const useEmojis = [];
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
      const failActivity = await db.activity.create({
        type: 'reactdrop_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(failActivity);
      await message.channel.send({ embeds: [userNotFoundMessage(message, 'ReactDrop')] }).catch((e) => {
        console.log(e);
      });
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
      // eslint-disable-next-line prefer-destructuring
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
      const timeFailActivity = await db.activity.create({
        type: 'reactdrop_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(timeFailActivity);
      await message.channel.send({ embeds: [invalidTimeMessage(message, 'Reactdrop')] });
    } else if (cutLastTimeLetter === 's' && Number(cutNumberTime) < 60) {
      const timeFailActivity = await db.activity.create({
        type: 'reactdrop_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(timeFailActivity);
      await message.channel.send({ embeds: [minimumTimeReactDropMessage(message)] });
    } else {
      const allEmojis = emojiCompact;
      await message.guild.emojis.cache.forEach((customEmoji) => {
        if (customEmoji.animated) {
          allEmojis.push(`<a:${customEmoji.name}:${customEmoji.id}>`);
        } else {
          allEmojis.push(`<:${customEmoji.name}:${customEmoji.id}>`);
        }
      });
      if (!filteredMessage[4]) {
        // eslint-disable-next-line no-param-reassign
        filteredMessage[4] = _.sample(allEmojis);
      }
      console.log(filteredMessage[4]);

      if (!allEmojis.includes(filteredMessage[4])) {
        const failEmojiActivity = await db.activity.create({
          type: 'reactdrop_f',
          spenderId: user.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        activity.unshift(failEmojiActivity);
        await message.channel.send({ embeds: [invalidEmojiMessage(message, 'Reactdrop')] });
      } else {
        const timeDay = Number(cutNumberTime) * 24 * 60 * 60 * 1000;
        const timeHour = Number(cutNumberTime) * 60 * 60 * 1000;
        const timeMinute = Number(cutNumberTime) * 60 * 1000;
        const timeSecond = Number(cutNumberTime) * 1000;
        if (
          (cutLastTimeLetter === 'd' && timeDay > 172800000)
          || (cutLastTimeLetter === 'h' && timeHour > 172800000)
          || (cutLastTimeLetter === 'm' && timeMinute > 172800000)
          || (cutLastTimeLetter === 's' && timeSecond > 172800000)
        ) {
          await message.channel.send({ embeds: [maxTimeReactdropMessage(message)] });
          return;
        }
        let dateObj = await new Date().getTime();
        if (cutLastTimeLetter === 'd') {
          dateObj += timeDay;
        }
        if (cutLastTimeLetter === 'h') {
          dateObj += timeHour;
        }
        if (cutLastTimeLetter === 'm') {
          dateObj += timeMinute;
        }
        if (cutLastTimeLetter === 's') {
          dateObj += timeSecond;
        }
        dateObj = await new Date(dateObj);
        const countDownDate = await dateObj.getTime();
        let now = await new Date().getTime();
        let distance = countDownDate - now;

        const randomAmount = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < randomAmount; i += 1) {
          const randomX = Math.floor(Math.random() * allEmojis.length);
          useEmojis.push(allEmojis[randomX]);
        }
        await useEmojis.push(filteredMessage[4]);

        const shuffeledEmojisArray = await shuffle(useEmojis);

        // console.log(shuffeledEmojisArray);
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
            discordMessageId: 'notYetSpecified',
            userId: user.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const sendReactDropMessage = await message.channel.send({
            embeds: [
              reactDropMessage(
                newReactDrop.id,
                distance,
                message.author.id,
                filteredMessage[4],
                amount,
              ),
            ],
          });

          const newUpdatedReactDrop = await newReactDrop.update({
            discordMessageId: sendReactDropMessage.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const preActivity = await db.activity.create({
            amount,
            type: 'reactdrop_s',
            spenderId: user.id,
            reactdropId: newUpdatedReactDrop.id,
            spender_balance: wallet.available + wallet.locked,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          const finalActivity = await db.activity.findOne({
            where: {
              id: preActivity.id,
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
          activity.unshift(finalActivity);

          const reactMessage = await discordClient.guilds.cache.get(sendReactDropMessage.guildId)
            .channels.cache.get(sendReactDropMessage.channelId)
            .messages.fetch(sendReactDropMessage.id);

          listenReactDrop(
            reactMessage,
            distance,
            newUpdatedReactDrop,
            io,
            queue,
          );

          // eslint-disable-next-line no-restricted-syntax
          for (const shufEmoji of shuffeledEmojisArray) {
            // console.log(shufEmoji);
            // eslint-disable-next-line no-await-in-loop
            await reactMessage.react(shufEmoji);
          }

          const updateMessage = setInterval(async () => {
            now = new Date().getTime();
            console.log('listen');
            distance = countDownDate - now;
            await reactMessage.edit({
              embeds: [
                reactDropMessage(
                  newUpdatedReactDrop.id,
                  distance,
                  message.author.id,
                  filteredMessage[4],
                  amount,
                ),
              ],
            });
            if (distance < 0) {
              clearInterval(updateMessage);
            }
          }, 10000);
        }
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'reactDrop',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    console.log(useEmojis);
    logger.error(`reactdrop error: ${err}
Emojis used: ${useEmojis}`);
    await message.channel.send({ embeds: [discordErrorMessage("ReactDrop")] }).catch((e) => {
      console.log(e);
    });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
