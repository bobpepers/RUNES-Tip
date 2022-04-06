/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { Transaction } from "sequelize";
import {
  notInDirectMessage,
  invalidTimeMessage,
  minimumTimeReactDropMessage,
  invalidEmojiMessage,
  matrixReactDropMessage,
  errorMessage,
  reactdropPressWrongEmojiMessage,
  reactdropCaptchaMessage,
  backToReactDropMessage,
  outOfTimeReactdropMessage,
  reactDropReturnInitiatorMessage,
  maxTimeReactdropMessage,
  userListMessage,
  afterReactDropSuccessMessage,
} from '../../messages/matrix';

import db from '../../models';
import emojiCompact from "../../config/emoji";
import logger from "../../helpers/logger";
import { generateCaptcha } from "../../helpers/generateCaptcha";
import { waterFaucet } from "../../helpers/waterFaucet";
import { validateAmount } from "../../helpers/client/matrix/validateAmount";
import { userWalletExist } from "../../helpers/client/matrix/userWalletExist";
import { waterFaucetSettings } from '../settings';
import { findUserDirectMessageRoom, inviteUserToDirectMessageRoom } from '../../helpers/client/matrix/directMessageRoom';

export const listenMatrixReactDrop = async (
  matrixClient,
  reactMessage,
  distance,
  reactDrop,
  io,
  queue,
) => {
  console.log(reactDrop);
  console.log('reactDrop');
  console.log(distance);
  console.log('distance');
  const reactDropRoomId = reactDrop.group.groupId.replace('matrix-', '');
  const backToReactDropLink = `https://matrix.to/#/${reactDropRoomId}/${reactDrop.messageId}`;

  let collector;
  const listenerFunction = async (
    confirmMessage,
    room,
  ) => {
    if (
      room.roomId === reactDropRoomId
      && confirmMessage.event.type === 'm.reaction'
      && confirmMessage.event.content
      && confirmMessage.event.content['m.relates_to']
      && confirmMessage.event.content['m.relates_to'].event_id
      && confirmMessage.event.content['m.relates_to'].key
      && confirmMessage.event.content['m.relates_to'].event_id === reactMessage
    ) {
      const findReactUser = await db.user.findOne({
        where: {
          user_id: `matrix-${confirmMessage.sender.userId}`,
        },
      });
      if (findReactUser) {
        let findReactTip = await db.reactdroptip.findOne({
          where: {
            userId: findReactUser.id,
            reactdropId: reactDrop.id,
          },
        });
        if (!findReactTip) {
          const [
            directUserMessageRoom,
            isCurrentRoomDirectMessage,
            userState,
          ] = await findUserDirectMessageRoom(
            matrixClient,
            confirmMessage.sender.userId,
            confirmMessage.sender.roomId,
          );

          const userDirectMessageRoomId = await inviteUserToDirectMessageRoom(
            matrixClient,
            directUserMessageRoom,
            userState,
            confirmMessage.sender.userId,
            confirmMessage.sender.name,
            confirmMessage.sender.roomId,
          );

          const [
            captchaImage,
            captchaText,
            captchaType,
          ] = await generateCaptcha();

          findReactTip = await db.reactdroptip.create({
            status: 'waiting',
            captchaType,
            solution: captchaText,
            userId: findReactUser.id,
            reactdropId: reactDrop.id,
          });

          if (reactDrop.emoji !== confirmMessage.event.content['m.relates_to'].key) {
            try {
              await matrixClient.sendEvent(
                userDirectMessageRoomId,
                "m.room.message",
                reactdropPressWrongEmojiMessage(),
              );
            } catch (e) {
              console.log(e);
            }
            await findReactTip.update({
              status: 'failed',
            });
          } else {
            // const captchaPngFixed = captchaImage;
            const uploadResponse = await matrixClient.uploadContent(captchaImage, { rawResponse: false, type: 'image/png' });
            const matrixUrl = uploadResponse.content_uri;
            await matrixClient.sendEvent(
              userDirectMessageRoomId,
              "m.room.message",
              {
                msgtype: "m.image",
                url: matrixUrl,
                // info: `321`,
                body: `captchaImage`,
              },
            );
            await matrixClient.sendEvent(
              userDirectMessageRoomId,
              "m.room.message",
              reactdropCaptchaMessage(
                confirmMessage,
              ),
            );

            const listenerFunctionForUser = async (
              confirmUserMessage,
              room,
            ) => {
              if (room.roomId === userDirectMessageRoomId) {
                matrixClient.off('Room.timeline', listenerFunctionForUser);
                await db.sequelize.transaction({
                  isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
                }, async (t) => {
                  console.log(confirmUserMessage);
                  console.log('confirmUserMessage');
                  let tempBody = '';
                  if (confirmUserMessage.event.type === 'm.room.encrypted') {
                    const event = await matrixClient.crypto.decryptEvent(confirmUserMessage);
                    tempBody = event.clearEvent.content.body;
                  } else {
                    tempBody = confirmUserMessage.event.content.body;
                  }
                  if (tempBody === findReactTip.solution) {
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

                    await matrixClient.sendEvent(
                      userDirectMessageRoomId,
                      'm.reaction',
                      {
                        "m.relates_to": {
                          event_id: confirmUserMessage.event.event_id,
                          key: '✅',
                          rel_type: "m.annotation",
                        },
                      },
                    );

                    await matrixClient.sendEvent(
                      userDirectMessageRoomId,
                      "m.room.message",
                      backToReactDropMessage(
                        backToReactDropLink,
                      ),
                    );
                  } else if (tempBody !== findReactTip.solution) {
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
                    await matrixClient.sendEvent(
                      userDirectMessageRoomId,
                      'm.reaction',
                      {
                        "m.relates_to": {
                          event_id: confirmUserMessage.event.event_id,
                          key: '❌',
                          rel_type: "m.annotation",
                        },
                      },
                    );
                    await matrixClient.sendEvent(
                      userDirectMessageRoomId,
                      "m.room.message",
                      backToReactDropMessage(
                        backToReactDropLink,
                      ),
                    );
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
              }
            };
            matrixClient.on('Room.timeline', listenerFunctionForUser);

            const myTimeoutUserListener = setTimeout(async () => {
              // eslint-disable-next-line no-promise-executor-return
              await new Promise((r) => setTimeout(r, 200));
              matrixClient.off('Room.timeline', listenerFunctionForUser);
              await db.sequelize.transaction({
                isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
              }, async (t) => {
                const findReactUserTwo = await db.user.findOne({
                  where: {
                    user_id: `matrix-${confirmMessage.sender.userId}`,
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
                  await matrixClient.sendEvent(
                    userDirectMessageRoomId,
                    "m.room.message",
                    outOfTimeReactdropMessage(),
                  );
                  // collector.send('Out of time');
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
                  await matrixClient.sendEvent(
                    userDirectMessageRoomId,
                    "m.room.message",
                    errorMessage(),
                  );
                } catch (e) {
                  logger.error(`Error Discord: ${e}`);
                }
                console.log(err);
              });
              clearTimeout(myTimeoutUserListener);
            }, 60000);
          }
        }
      }
    }
  };
  matrixClient.on('Room.timeline', listenerFunction);

  const myTimeout = setTimeout(async () => {
    matrixClient.off('Room.timeline', listenerFunction); // turn off reactdrop listener
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
            await matrixClient.sendEvent(
              reactDropRoomId,
              "m.room.message",
              reactDropReturnInitiatorMessage(),
            );
          } else {
            // Get Faucet Settings
            const faucetSetting = await waterFaucetSettings(
              endReactDrop.group.id,
              null,
              t,
            );

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
                const userIdReceivedRain = receiver.user.user_id.replace('matrix-', '');
                listOfUsersRained.push(`<a href="https://matrix.to/#/${userIdReceivedRain}">${receiver.user.username}</a>`);
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
            const cutStringListUsers = newStringListUsers.match(/.{1,6999}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
            // eslint-disable-next-line no-await-in-loop
              await matrixClient.sendEvent(
                reactDropRoomId,
                "m.room.message",
                userListMessage(
                  element,
                ),
              );
              // await reactMessage.channel.send(element);
            }

            await matrixClient.sendEvent(
              reactDropRoomId,
              "m.room.message",
              afterReactDropSuccessMessage(
                endReactDrop,
                amountEach,
                endReactDrop.user,
              ),
            );
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
      if (activity.length > 0) {
        io.to('admin').emit('updateActivity', {
          activity,
        });
      }
    });
    clearTimeout(myTimeout);
  }, distance);
};

export const matrixReactDrop = async (
  matrixClient,
  message,
  filteredMessage,
  io,
  groupTask,
  setting,
  faucetSetting,
  queue,
  userDirectMessageRoomId,
  isCurrentRoomDirectMessage,
) => {
  const activity = [];
  const useEmojis = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (isCurrentRoomDirectMessage) {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        notInDirectMessage(
          message,
          'Flood',
        ),
      );
      return;
    }
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      matrixClient,
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      matrixClient,
      message,
      t,
      filteredMessage[2],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );
    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    // Convert Message time to MS
    let textTime = '5m';
    if (filteredMessage[3]) {
      // eslint-disable-next-line prefer-destructuring
      textTime = filteredMessage[3];
    }

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

      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        invalidTimeMessage(
          message,
          'Reactdrop',
        ),
      );
    } else if (cutLastTimeLetter === 's' && Number(cutNumberTime) < 60) {
      const timeFailActivity = await db.activity.create({
        type: 'reactdrop_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(timeFailActivity);

      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        minimumTimeReactDropMessage(
          message,
          'Reactdrop',
        ),
      );
    } else {
      const allEmojis = emojiCompact;

      if (!filteredMessage[4]) {
        // eslint-disable-next-line no-param-reassign
        filteredMessage[4] = _.sample(allEmojis);
      }

      if (!allEmojis.includes(filteredMessage[4])) {
        const failEmojiActivity = await db.activity.create({
          type: 'reactdrop_f',
          spenderId: user.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        activity.unshift(failEmojiActivity);

        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          invalidEmojiMessage(
            message,
            'Reactdrop',
          ),
        );
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
          await matrixClient.sendEvent(
            message.sender.roomId,
            "m.room.message",
            maxTimeReactdropMessage(),
          );
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

        const randomAmount = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < randomAmount; i += 1) {
          const randomX = Math.floor(Math.random() * allEmojis.length);
          useEmojis.push(allEmojis[parseInt(randomX, 10)]);
        }

        await useEmojis.push(filteredMessage[4]);
        const shuffeledEmojisArray = await _.shuffle(useEmojis);

        const findGroup = await db.group.findOne({
          where: {
            groupId: `matrix-${message.sender.roomId}`,
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
              groupId: `matrix-${message.sender.roomId}`,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);

          const newReactDrop = await db.reactdrop.create({
            feeAmount: Number(fee),
            amount,
            groupId: group.id,
            ends: dateObj,
            emoji: filteredMessage[4],
            messageId: 'notYetSpecified',
            userId: user.id,
            side: 'matrix',
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const findNotUpdatedReactDrop = await db.reactdrop.findOne({
            where: {
              id: newReactDrop.id,
            },
            include: [
              {
                model: db.group,
                as: 'group',
              },
              {
                model: db.user,
                as: 'user',
              },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,
          });

          const sendReactDropMessage = await matrixClient.sendEvent(
            message.sender.roomId,
            "m.room.message",
            matrixReactDropMessage(
              newReactDrop.id,
              distance,
              findNotUpdatedReactDrop.user,
              filteredMessage[4],
              amount,
            ),
          );

          const newUpdatedReactDrop = await newReactDrop.update({
            messageId: sendReactDropMessage.event_id,
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

          const findUpdatedReactDrop = await db.reactdrop.findOne({
            where: {
              id: newUpdatedReactDrop.id,
            },
            include: [
              {
                model: db.group,
                as: 'group',
              },
              {
                model: db.user,
                as: 'user',
              },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,
          });

          listenMatrixReactDrop(
            matrixClient,
            sendReactDropMessage.event_id,
            distance,
            findUpdatedReactDrop,
            io,
            queue,
          );

          // eslint-disable-next-line no-restricted-syntax
          for (const shufEmoji of shuffeledEmojisArray) {
            // await reactMessage.react(shufEmoji);
            // eslint-disable-next-line no-await-in-loop
            await matrixClient.sendEvent(
              message.sender.roomId,
              'm.reaction',
              {
                "m.relates_to": {
                  event_id: sendReactDropMessage.event_id,
                  key: shufEmoji,
                  rel_type: "m.annotation",
                },
              },
            );
          }

          const updateMessage = setInterval(async () => {
            now = new Date().getTime();
            console.log('listen');
            distance = countDownDate - now;
            const editedMessage = matrixReactDropMessage(
              newReactDrop.id,
              distance,
              findUpdatedReactDrop.user,
              filteredMessage[4],
              amount,
            );
            await matrixClient.sendEvent(
              message.sender.roomId,
              'm.room.message',
              {
                "m.relates_to": {
                  event_id: sendReactDropMessage.event_id,
                  rel_type: "m.replace",
                },
                body: editedMessage.body,
                "m.new_content": editedMessage,
              },
            );
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
        type: 'reactdrop',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    console.log(err);
    logger.error(`reactdrop error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Reactdrop',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
