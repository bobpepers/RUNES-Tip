/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { Transaction } from "sequelize";
import {
  MessageActionRow,
  MessageButton,
} from "discord.js";
import {
  triviaMessageDiscord,
  userNotFoundMessage,
  minimumTimeReactDropMessage,
  invalidTimeMessage,
  AfterTriviaSuccessMessage,
  noTriviaQuestionFoundMessage,
  maxTimeTriviaMessage,
  triviaReturnInitiatorMessage,
  NotInDirectMessage,
  discordErrorMessage,
  invalidPeopleAmountMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/discord/validateAmount";
import { waterFaucet } from "../../helpers/discord/waterFaucet";

export const listenTrivia = async (
  triviaMessage,
  distance,
  triviaRecord,
  io,
  queue,
  updateMessage,
  answerString,
) => {
  const collector = triviaMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: distance });
  collector.on('collect', async (
    reaction,
  ) => {
    if (!reaction.user.bot) {
      await queue.add(async () => {
        await db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        }, async (t) => {
          const findAllCorrectUserTriviaAnswersStart = await db.triviatip.findAll({
            where: {
              triviaId: triviaRecord.id,
            },
            include: [
              {
                model: db.triviaanswer,
                as: 'triviaanswer',
                where: {
                  correct: true,
                },
              },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          if (Number(findAllCorrectUserTriviaAnswersStart.length) < Number(triviaRecord.userCount)) {
            const findTrivUser = await db.user.findOne({
              where: {
                user_id: `discord-${reaction.user.id}`,
              },
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            if (findTrivUser) {
              const findTriviaTip = await db.triviatip.findOne({
                where: {
                  userId: findTrivUser.id,
                  triviaId: triviaRecord.id,
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              if (findTriviaTip) {
                reaction.reply({
                  content: "We already received an answer from you",
                  ephemeral: true,
                });
              }
              if (!findTriviaTip) {
                const findTriviaAnswer = await db.triviaanswer.findOne({
                  where: {
                    answer: reaction.customId,
                    triviaquestionId: triviaRecord.triviaquestionId,
                  },
                  lock: t.LOCK.UPDATE,
                  transaction: t,
                });
                const insertTriviaTip = await db.triviatip.create({
                  userId: findTrivUser.id,
                  triviaId: triviaRecord.id,
                  triviaanswerId: findTriviaAnswer.id,
                  groupId: triviaRecord.groupId,
                  channelId: triviaRecord.channelId,
                }, {
                  lock: t.LOCK.UPDATE,
                  transaction: t,
                });
                const findAllCorrectUserTriviaAnswers = await db.triviatip.findAll({
                  where: {
                    triviaId: triviaRecord.id,
                  },
                  include: [
                    {
                      model: db.triviaanswer,
                      as: 'triviaanswer',
                      // required: false,
                      where: {
                        correct: true,
                      },
                    },
                  ],
                  lock: t.LOCK.UPDATE,
                  transaction: t,
                });

                if (Number(findAllCorrectUserTriviaAnswers.length) >= Number(triviaRecord.userCount)) {
                  collector.stop('Collector stopped manually');
                }
                reaction.reply({
                  content: `Thank you, we received your answer\nYou answered: ${reaction.customId}`,
                  ephemeral: true,
                });
              }
            }
          }

          t.afterCommit(() => {
            // reaction.deferUpdate();
            console.log('done');
          });
        }).catch(async (err) => {
          try {
            await db.error.create({
              type: 'answerTrivia',
              error: `${err}`,
            });
          } catch (e) {
            logger.error(`Error Discord: ${e}`);
          }
          console.log(err);
          logger.error(`trivia error: ${err}`);
        });
      });
    }
  });

  collector.on('end', async () => {
    console.log('end trivia drop');
    const activity = [];
    await queue.add(async () => {
      clearInterval(updateMessage);
      const actualUserId = triviaRecord.user.user_id.replace('discord-', '');
      await triviaMessage.edit({
        embeds: [
          triviaMessageDiscord(
            triviaRecord.id,
            -1,
            actualUserId,
            triviaRecord.triviaquestion.question,
            answerString,
            triviaRecord.amount,
            triviaRecord.userCount,
          )],
        components: [],
      });
      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        const correctAnswer = await db.triviaanswer.findOne({
          where: {
            triviaquestionId: triviaRecord.triviaquestionId,
            correct: true,
          },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        const endTriviaDrop = await db.trivia.findOne({
          where: {
            id: triviaRecord.id,
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
              model: db.triviatip,
              as: 'triviatips',
              required: false,
              where: {
                triviaanswerId: correctAnswer.id,
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
        if (endTriviaDrop) {
          if (endTriviaDrop.triviatips.length <= 0) {
            const returnWallet = await db.wallet.findOne({
              where: {
                userId: endTriviaDrop.userId,
              },
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            const updatedWallet = await returnWallet.update({
              available: returnWallet.available + endTriviaDrop.amount,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            await endTriviaDrop.update({
              ended: true,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            await triviaMessage.channel.send({ embeds: [triviaReturnInitiatorMessage()] });
          } else {
            // Get Faucet Settings
            let faucetSetting;
            faucetSetting = await db.features.findOne({
              where: {
                type: 'local',
                name: 'trivia',
                groupId: endTriviaDrop.group.id,
                channelId: endTriviaDrop.channel.id,
              },
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            if (!faucetSetting) {
              faucetSetting = await db.features.findOne({
                where: {
                  type: 'local',
                  name: 'trivia',
                  groupId: endTriviaDrop.group.id,
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
                  name: 'trivia',
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
            }
            // water the faucet
            const faucetWatered = await waterFaucet(
              t,
              Number(endTriviaDrop.feeAmount),
              faucetSetting,
            );
            //
            const amountEach = ((Number(endTriviaDrop.amount) - Number(endTriviaDrop.feeAmount)) / Number(endTriviaDrop.triviatips.length)).toFixed(0);

            await endTriviaDrop.update({
              ended: true,
              userCount: Number(endTriviaDrop.triviatips.length),
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });

            const listOfUsersRained = [];
            const withoutBotsSorted = await _.sortBy(endTriviaDrop.triviatips, 'createdAt');
            // eslint-disable-next-line no-restricted-syntax
            for (const receiver of withoutBotsSorted) {
              // eslint-disable-next-line no-await-in-loop
              const updateTriviaTip = await receiver.update({
                amount: Number(amountEach),
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });

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
                type: 'triviatip_s',
                spenderId: endTriviaDrop.user.id,
                earnerId: receiver.user.id,
                triviaId: endTriviaDrop.id,
                triviatipId: receiver.id,
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
                    model: db.trivia,
                    as: 'trivia',
                  },
                  {
                    model: db.triviatip,
                    as: 'triviatip',
                  },
                ],
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              activity.unshift(tipActivity);
            }
            const newStringListUsers = listOfUsersRained.join(", ");
            // console.log(newStringListUsers);
            const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              await triviaMessage.channel.send(element);
            }
            const initiator = endTriviaDrop.user.user_id.replace('discord-', '');
            await triviaMessage.channel.send({
              embeds: [
                AfterTriviaSuccessMessage(
                  endTriviaDrop,
                  amountEach,
                  initiator,
                ),
              ],
            });
          }
        }

        t.afterCommit(() => {
          console.log('done');
        });
      }).catch(async (err) => {
        try {
          await db.error.create({
            type: 'endTrivia',
            error: `${err}`,
          });
        } catch (e) {
          logger.error(`Error Discord: ${e}`);
        }
        console.log(err);
        logger.error(`trivia error: ${err}`);
      });
      io.to('admin').emit('updateActivity', {
        activity,
      });
    });
  });
};

export const discordTrivia = async (
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
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Trivia')] });
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
        type: 'trivia_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(failActivity);
      await message.channel.send({ embeds: [userNotFoundMessage(message, 'Trivia')] });
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
      'trivia',
    );
    if (activityValiateAmount) {
      activity = activityValiateAmount;
      return;
    }

    /// Trivia

    /// Amount of people to win trivia
    let totalPeople = 1;
    if (filteredMessage[3]) {
      // eslint-disable-next-line prefer-destructuring
      totalPeople = filteredMessage[3];
    }
    const isnumPeople = /^\d+$/.test(totalPeople);

    // Convert Message time to MS
    let textTime = '5m';
    if (filteredMessage[4]) {
      // eslint-disable-next-line prefer-destructuring
      textTime = filteredMessage[4];
    }
    // const textTime = filteredMessage[3];
    const cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
    const cutNumberTime = textTime.substring(0, textTime.length - 1);
    const isnum = /^\d+$/.test(cutNumberTime);

    if (
      !isnumPeople
      && totalPeople % 1 === 0
    ) {
      const amountPeopleFailActivity = await db.activity.create({
        type: 'trivia_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(amountPeopleFailActivity);
      await message.channel.send({ embeds: [invalidPeopleAmountMessage(message, 'Trivia')] });
    } else if (
      !isnum
      // && Number(cutNumberTime) < 0
      || (
        cutLastTimeLetter !== 'd'
        && cutLastTimeLetter !== 'h'
        && cutLastTimeLetter !== 'm'
        && cutLastTimeLetter !== 's')
    ) {
      const timeFailActivity = await db.activity.create({
        type: 'trivia_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(timeFailActivity);
      await message.channel.send({ embeds: [invalidTimeMessage(message, 'Trivia')] });
    } else if (cutLastTimeLetter === 's' && Number(cutNumberTime) < 30) {
      const timeFailActivity = await db.activity.create({
        type: 'trivia_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(timeFailActivity);
      await message.channel.send({ embeds: [minimumTimeReactDropMessage(message)] });
    } else {
      const randomQuestion = await db.triviaquestion.findOne({
        order: db.sequelize.random(),
        where: {
          enabled: true,
        },
        include: [
          {
            model: db.triviaanswer,
            as: 'triviaanswers',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!randomQuestion) {
        const failFindTriviaQuestion = await db.activity.create({
          type: 'trivia_f',
          spenderId: user.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        activity.unshift(failFindTriviaQuestion);
        await message.channel.send({ embeds: [noTriviaQuestionFoundMessage(message, 'Trivia')] });
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
          await message.channel.send({ embeds: [maxTimeTriviaMessage(message)] });
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

          const row = new MessageActionRow();
          const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
          const answers = _.shuffle(randomQuestion.triviaanswers);
          let answerString = '';
          let positionAlphabet = 0;
          // console.log(answers);

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

          const newTriviaCreate = await db.trivia.create({
            feeAmount: Number(fee),
            amount,
            userCount: totalPeople,
            groupId: group.id,
            channelId: channel.id,
            ends: dateObj,
            triviaquestionId: randomQuestion.id,
            discordMessageId: 'notYetSpecified',
            userId: user.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const sendTriviaMessage = await message.channel.send({
            embeds: [
              triviaMessageDiscord(
                newTriviaCreate.id,
                distance,
                message.author.id,
                randomQuestion.question,
                answerString,
                amount,
                totalPeople,
              ),
            ],
            components: [row],
          });

          const newUpdatedTriviaCreate = await newTriviaCreate.update({
            discordMessageId: sendTriviaMessage.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const newTrivia = await db.trivia.findOne({
            where: {
              id: newUpdatedTriviaCreate.id,
            },
            include: [
              {
                model: db.triviaquestion,
                as: 'triviaquestion',
              },
              {
                model: db.user,
                as: 'user',
              },
            ],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const preActivity = await db.activity.create({
            amount,
            type: 'trivia_s',
            spenderId: user.id,
            triviaId: newTrivia.id,
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
                model: db.trivia,
                as: 'trivia',
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

          const triviaMessage = await discordClient.guilds.cache.get(sendTriviaMessage.guildId)
            .channels.cache.get(sendTriviaMessage.channelId)
            .messages.fetch(sendTriviaMessage.id);

          const updateMessage = setInterval(async () => {
            now = new Date().getTime();
            console.log('listen trivia');
            distance = countDownDate - now;
            await triviaMessage.edit({
              embeds: [
                triviaMessageDiscord(
                  newTrivia.id,
                  distance,
                  message.author.id,
                  randomQuestion.question,
                  answerString,
                  amount,
                  totalPeople,
                )],
            });
            if (distance < 0) {
              clearInterval(updateMessage);
            }
          }, 10000);

          listenTrivia(
            triviaMessage,
            distance,
            newTrivia,
            io,
            queue,
            updateMessage,
            answerString,
          );
        }
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'trivia',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`trivia error: ${err}`);
    message.channel.send({ embeds: [discordErrorMessage("Trivia")] });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
