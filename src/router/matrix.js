/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { config } from "dotenv";

import { executeTipFunction } from '../helpers/matrix/executeTips';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';
import { matrixHelp } from '../controllers/matrix/help';
import { matrixBalance } from '../controllers/matrix/balance';
import { matrixWalletDepositAddress } from '../controllers/matrix/deposit';
import { withdrawMatrixCreate } from '../controllers/matrix/withdraw';
import { matrixFlood } from '../controllers/matrix/flood';
import { matrixSleet } from '../controllers/matrix/sleet';
import { setIgnoreMe } from '../controllers/matrix/ignore';
import { tipRunesToMatrixUser } from '../controllers/matrix/tip';
import { matrixPrice } from '../controllers/matrix/price';
import { fetchFeeSchedule } from '../controllers/matrix/fees';

import {
  findUserDirectMessageRoom,
  inviteUserToDirectMessageRoom,
} from '../helpers/matrix/directMessageRoom';

import {
  createUpdateMatrixUser,
  updateMatrixLastSeen,
} from '../controllers/matrix/user';

import { updateMatrixGroup } from '../controllers/matrix/group';

import {
  matrixSettings,
  matrixWaterFaucetSettings,
} from '../controllers/matrix/settings';

import {
  matrixUserBannedMessage,
  matrixRoomBannedMessage,
} from '../messages/matrix';

import { discordRain } from '../controllers/discord/rain';

import { discordCoinInfo } from '../controllers/discord/info';

import { discordSoak } from '../controllers/discord/soak';

import { discordThunder } from '../controllers/discord/thunder';

import { discordThunderStorm } from '../controllers/discord/thunderstorm';

import { discordHurricane } from '../controllers/discord/hurricane';

import { discordFaucetClaim } from '../controllers/discord/faucet';

import { discordPrice } from '../controllers/discord/price';

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

config();

export const matrixRouter = async (
  matrixClient,
  queue,
  io,
  settings,
) => {
  let prepared;
  // await matrixClient.clearStores();
  // await matrixClient.sessionStore.removeAllEndToEndSessions();
  // await matrixClient.sessionStore.removeEndToEndAccount();
  // await matrixClient.sessionStore.removeEndToEndDeviceData();
  const devices = await matrixClient.getDevices();
  for (const device of devices.devices) {
    if (device.device_id !== matrixClient.deviceId) {
      console.log(device.device_id);
      await matrixClient.deleteDevice(device.device_id);
    }
  }

  matrixClient.once('sync', async (
    state,
    prevState,
    res,
  ) => {
    if (state !== 'PREPARED') return;
    matrixClient.setGlobalErrorOnUnknownDevices(false);
    if (state === 'PREPARED') {
      const allRooms = await matrixClient.getRooms();
      // eslint-disable-next-line no-restricted-syntax
      for (const room of allRooms) {
        // console.log(room);
        if (room
            && room.currentState
            && room.currentState.joinedMemberCount === 1
            && room.currentState.invitedMemberCount === 0) {
          try {
            await matrixClient.leave(room.roomId);
            await matrixClient.forget(room.roomId, true);
          } catch (e) {
            console.log(e);
          }
        }
      }
      prepared = true;
    }
  });

  matrixClient.on("RoomMember.membership", async (
    event,
    member,
  ) => {
    if (!prepared) return;
    const [
      directUserMessageRoom,
      isCurrentRoomDirectMessage,
      userState,
    ] = await findUserDirectMessageRoom(
      matrixClient,
      member.userId,
      member.roomId,
    );
    if (!directUserMessageRoom && member.membership === "invite") {
      console.log('joined');
      try {
        await matrixClient.joinRoom(member.roomId).then(() => {
          console.log("Auto-joined %s", member.roomId);
        });
      } catch (e) {
        console.log(e);
        try {
          await matrixClient.leave(member.roomId).then(async () => {
            await matrixClient.forget(member.roomId, true);
            console.log("Auto-left %s", member.roomId);
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  matrixClient.on("User.presence", async (
    event,
    user,
  ) => {
    const newPresence = user.presence;
    console.log(event);
    console.log(user);
    console.log(newPresence);
    console.log('presence update matrix');
  });

  matrixClient.on('Room.timeline', async (
    message,
    room,
  ) => {
    if (!prepared) return;
    if (matrixClient.credentials.userId === message.event.sender) return;

    let lastSeenMatrixTask;
    let faucetSetting;
    let groupTask;
    let channelTask;
    let groupTaskId;
    let channelTaskId;
    let myBody;
    let formatted_body;

    const maintenance = await isMaintenanceOrDisabled(
      message,
      'matrix',
      matrixClient,
    );
    if (maintenance.maintenance || !maintenance.enabled) return;
    const walletExists = await createUpdateMatrixUser(
      message,
      matrixClient,
      queue,
    );
    const [
      directUserMessageRoom,
      isCurrentRoomDirectMessage,
      userState,
    ] = await findUserDirectMessageRoom(
      matrixClient,
      message.sender.userId,
      message.sender.roomId,
    );

    if (!isCurrentRoomDirectMessage) {
      groupTask = await updateMatrixGroup(
        matrixClient,
        message,
      );
      groupTaskId = groupTask && groupTask.id;
      lastSeenMatrixTask = await updateMatrixLastSeen(
        matrixClient,
        message,
      );
    }

    // console.log(message);
    try {
      if (message.event.type === 'm.room.encrypted') {
        // console.log(matrixClient);
        // const event = await matrixClient._crypto.decryptEvent(message);
        const event = await matrixClient.crypto.decryptEvent(message);
        if (event.clearEvent.content.formatted_body) {
          myBody = event.clearEvent.content.formatted_body;
        } else {
          myBody = event.clearEvent.content.body;
        }
      } else {
        if (message.event.content.formatted_body) {
          myBody = message.event.content.formatted_body;
        } else {
          myBody = message.event.content.body;
        }
        console.log(message.event.content);
      }
    } catch (error) {
      console.error('#### ', error);
    }
    // console.log(body);
    if (myBody) {
      // const space = await matrixClient.getRoomHierarchy(message.event.room_id, 100, 100, false);
      // const directories = await matrixClient.getRoomSummary(message.event.room_id);
      // console.log(space);
      // console.log(directories);

      if (!myBody.startsWith(settings.bot.command.matrix)) return;
      if (myBody.startsWith(settings.bot.command.matrix)) {
        faucetSetting = await matrixWaterFaucetSettings(
          groupTaskId,
          channelTaskId,
        );
        if (!faucetSetting) return;

        if (groupTask && groupTask.banned) {
          try {
            await matrixClient.sendEvent(
              message.event.room_id,
              "m.room.message",
              matrixRoomBannedMessage(groupTask),
            );
          } catch (e) {
            console.log(e);
          }
          return;
        }
        if (lastSeenMatrixTask && lastSeenMatrixTask.banned) {
          try {
            await matrixClient.sendEvent(
              message.event.room_id,
              "m.room.message",
              matrixUserBannedMessage(lastSeenMatrixTask),
            );
          } catch (e) {
            console.log(e);
          }
          return;
        }

        // let userDirectMessageRoomId;
        const regex = /\s*((?:[^\s<]*<\w[^>]*>[\s\S]*?<\/\w[^>]*>)+[^\s<]*)\s*/;
        const preFilteredMessageWithTags = myBody.split(regex).filter(Boolean);
        const filteredMessageWithTags = preFilteredMessageWithTags.filter((el) => el !== '').filter(String);
        const preFilteredMessage = myBody.split(' ');
        const filteredMessage = preFilteredMessage.filter((el) => el !== '');
        console.log(filteredMessageWithTags);
        console.log(filteredMessage);
        console.log("myBody");

        const userDirectMessageRoomId = await inviteUserToDirectMessageRoom(
          matrixClient,
          directUserMessageRoom,
          userState,
          message.sender.userId,
          message.sender.name,
          message.sender.roomId,
        );

        if (!directUserMessageRoom || !userDirectMessageRoomId) return;
        console.log(userDirectMessageRoomId);

        if (filteredMessage[1] === undefined) {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            const task = await matrixHelp(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'help') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            const task = await matrixHelp(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'balance') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            const task = await matrixBalance(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'ignoreme') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            const task = await setIgnoreMe(
              matrixClient,
              message,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'deposit') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            const task = await matrixWalletDepositAddress(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'price') {
          // const limited = await limitPrice(message);
          // if (limited) return;
          await queue.add(async () => {
            const task = await matrixPrice(
              matrixClient,
              message,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'fees') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            const task = await fetchFeeSchedule(
              matrixClient,
              message,
              filteredMessage,
              io,
              groupTaskId,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'withdraw') {
          const setting = await matrixSettings(
            matrixClient,
            message,
            'withdraw',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;
          console.log(settings);
          // const limited = await limitWithdraw(message);
          // if (limited) return;

          await executeTipFunction(
            withdrawMatrixCreate,
            queue,
            filteredMessage[3],
            matrixClient,
            message,
            filteredMessage,
            io,
            groupTask,
            setting,
            faucetSetting,
            userDirectMessageRoomId,
            isCurrentRoomDirectMessage,
          );
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'flood') {
          const setting = await matrixSettings(
            matrixClient,
            message,
            'flood',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;
          console.log(settings);
          // const limited = await limitWithdraw(message);
          // if (limited) return;

          await executeTipFunction(
            matrixFlood,
            queue,
            filteredMessage[2],
            matrixClient,
            message,
            filteredMessage,
            io,
            groupTask,
            setting,
            faucetSetting,
            userDirectMessageRoomId,
            isCurrentRoomDirectMessage,
          );
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'sleet') {
          const setting = await matrixSettings(
            matrixClient,
            message,
            'sleet',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;
          console.log(settings);
          // const limited = await limitWithdraw(message);
          // if (limited) return;

          await executeTipFunction(
            matrixSleet,
            queue,
            filteredMessage[2],
            matrixClient,
            message,
            filteredMessage,
            io,
            groupTask,
            setting,
            faucetSetting,
            userDirectMessageRoomId,
            isCurrentRoomDirectMessage,
          );
        }

        if (
          filteredMessageWithTags.length > 1
          && filteredMessageWithTags[1]
          && filteredMessageWithTags[1].startsWith('<a')
        ) {
          const setting = await matrixSettings(
            matrixClient,
            message,
            'tip',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;
          // const limited = await limitTip(message);
          // if (limited) return;

          let AmountPosition = 1;
          let AmountPositionEnded = false;
          while (!AmountPositionEnded) {
            AmountPosition += 1;
            if (!filteredMessageWithTags[parseInt(AmountPosition, 10)].startsWith('<a')) {
              AmountPositionEnded = true;
            }
          }

          const preSplitAfterTags = filteredMessageWithTags[parseInt(AmountPosition, 10)].split(' ');
          const splitAfterTags = preSplitAfterTags.filter((el) => el !== '');
          const filteredMessageWithTagsClean = filteredMessageWithTags.splice(0, AmountPosition);
          const finalFilteredTipsWithTags = filteredMessageWithTagsClean.concat(splitAfterTags);
          console.log(finalFilteredTipsWithTags);
          console.log("myBody");

          await executeTipFunction(
            tipRunesToMatrixUser,
            queue,
            finalFilteredTipsWithTags[parseInt(AmountPosition, 10)],
            matrixClient,
            message,
            finalFilteredTipsWithTags,
            io,
            groupTask,
            setting,
            faucetSetting,
            userDirectMessageRoomId,
            isCurrentRoomDirectMessage,
          );
        }
      }
    }
  });

  try {
    await matrixClient.initCrypto();
    await matrixClient.startClient({
      initialSyncLimit: 1,
      includeArchivedRooms: true,
    });
  } catch (e) {
    console.log(e);
  }
};
