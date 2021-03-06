/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { config } from "dotenv";
import { executeTipFunction } from '../helpers/client/matrix/executeTips';
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
import { matrixFeeSchedule } from '../controllers/matrix/fees';
import { matrixCoinInfo } from '../controllers/matrix/info';
import { matrixReactDrop } from '../controllers/matrix/reactdrop';
import { updateMatrixGroup } from '../controllers/matrix/group';
import { matrixFeatureSettings } from '../controllers/matrix/settings';
import { waterFaucetSettings } from '../controllers/settings';
import { createUpdateMatrixUser, updateMatrixLastSeen } from '../controllers/matrix/user';
import { myRateLimiter } from '../helpers/rateLimit';
import { findUserDirectMessageRoom, inviteUserToDirectMessageRoom } from '../helpers/client/matrix/directMessageRoom';
import { decryptIncomingMessage } from '../helpers/client/matrix/decryptIncomingMessage';

import {
  matrixUserBannedMessage,
  matrixRoomBannedMessage,
} from '../messages/matrix';

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
            && room.currentState.invitedMemberCount === 0
        ) {
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

    const myBody = await decryptIncomingMessage(
      matrixClient,
      message,
    );
    // console.log(body);
    if (myBody) {
      if (!myBody.startsWith(settings.bot.command.matrix)) return;
      if (myBody.startsWith(settings.bot.command.matrix)) {
        const maintenance = await isMaintenanceOrDisabled(
          message,
          'matrix',
          matrixClient,
        );
        if (maintenance.maintenance || !maintenance.enabled) return;
        faucetSetting = await waterFaucetSettings(
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
        const messageReplaceBreaksWithSpaces = myBody.replace(/\n/g, " ");
        const regex = /\s*((?:[^\s<]*<\w[^>]*>[\s\S]*?<\/\w[^>]*>)+[^\s<]*)\s*/;
        const preFilteredMessageWithTags = messageReplaceBreaksWithSpaces.split(regex).filter(Boolean);
        const filteredMessageWithTags = preFilteredMessageWithTags.filter((el) => el !== '').filter(String);
        const preFilteredMessage = messageReplaceBreaksWithSpaces.split(' ');
        const filteredMessage = preFilteredMessage.filter((el) => el !== '');

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
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Help',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await matrixHelp(
              matrixClient,
              message,
              userDirectMessageRoomId,
              isCurrentRoomDirectMessage,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'help') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Help',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await matrixHelp(
              matrixClient,
              message,
              userDirectMessageRoomId,
              isCurrentRoomDirectMessage,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'info') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Info',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await matrixCoinInfo(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'balance') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Balance',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await matrixBalance(
              matrixClient,
              message,
              userDirectMessageRoomId,
              isCurrentRoomDirectMessage,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'ignoreme') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'IgnoreMe',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await setIgnoreMe(
              matrixClient,
              message,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'deposit') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Deposit',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await matrixWalletDepositAddress(
              matrixClient,
              message,
              userDirectMessageRoomId,
              isCurrentRoomDirectMessage,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'price') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Price',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await matrixPrice(
              matrixClient,
              message,
              io,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'fees') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Fees',
          );
          if (limited) return;
          await queue.add(async () => {
            const task = await matrixFeeSchedule(
              matrixClient,
              message,
              filteredMessage,
              io,
              groupTaskId,
            );
          });
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'withdraw') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Withdraw',
          );
          if (limited) return;

          const setting = await matrixFeatureSettings(
            matrixClient,
            message,
            'withdraw',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

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
            myBody,
          );
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'flood') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Flood',
          );
          if (limited) return;

          const setting = await matrixFeatureSettings(
            matrixClient,
            message,
            'flood',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

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
            myBody,
          );
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'sleet') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Sleet',
          );
          if (limited) return;

          const setting = await matrixFeatureSettings(
            matrixClient,
            message,
            'sleet',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

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
            myBody,
          );
        }

        if (filteredMessage[1] && filteredMessage[1].toLowerCase() === 'reactdrop') {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Reactdrop',
          );
          if (limited) return;

          const setting = await matrixFeatureSettings(
            matrixClient,
            message,
            'reactdrop',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

          await executeTipFunction(
            matrixReactDrop,
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
            myBody,
          );
        }

        if (
          filteredMessageWithTags.length > 1
          && filteredMessageWithTags[1]
          && filteredMessageWithTags[1].startsWith('<a')
        ) {
          const limited = await myRateLimiter(
            matrixClient,
            message,
            'matrix',
            'Tip',
          );
          if (limited) return;

          const setting = await matrixFeatureSettings(
            matrixClient,
            message,
            'tip',
            groupTaskId,
            channelTaskId,
          );
          if (!setting) return;

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
            myBody,
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
