/* eslint-disable no-underscore-dangle */
import { config } from "dotenv";

import { matrixBalance } from '../controllers/matrix/balance';
import { matrixWalletDepositAddress } from '../controllers/matrix/deposit';
import { withdrawDiscordCreate } from '../controllers/discord/withdraw';

import { discordVoiceRain } from '../controllers/discord/voicerain';
import { discordRain } from '../controllers/discord/rain';
import { discordSleet } from '../controllers/discord/sleet';
import { discordFlood } from '../controllers/discord/flood';
import {
  tipCoinsToDiscordFaucet,
  tipRunesToDiscordUser,
} from '../controllers/discord/tip';

import {
  createUpdateMatrixUser,
  updateMatrixLastSeen,
} from '../controllers/matrix/user';

import { fetchFeeSchedule } from '../controllers/discord/fees';

import { updateMatrixChannel } from '../controllers/matrix/channel';

import { updateDiscordGroup } from '../controllers/discord/group';

import { discordCoinInfo } from '../controllers/discord/info';

import { discordSoak } from '../controllers/discord/soak';

import { discordThunder } from '../controllers/discord/thunder';

import { discordThunderStorm } from '../controllers/discord/thunderstorm';

import { discordHurricane } from '../controllers/discord/hurricane';

import { discordFaucetClaim } from '../controllers/discord/faucet';

import { setIgnoreMe } from '../controllers/discord/ignore';

import { matrixHelp } from '../controllers/matrix/help';

import { discordPrice } from '../controllers/discord/price';

import { fetchDiscordListTransactions } from '../controllers/discord/listTransactions';

import {
  findUserDirectMessageRoom,
  inviteUserToDirectMessageRoom,
} from '../helpers/matrix/directMessageRoom';

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
import {
  discordUserBannedMessage,
  discordServerBannedMessage,
  discordChannelBannedMessage,
} from '../messages/discord';

import {
  testMessage,
} from '../messages/matrix';

import { discordStats } from '../controllers/discord/stats';
import { discordPublicStats } from '../controllers/discord/publicstats';
import { discordLeaderboard } from '../controllers/discord/leaderboard';
import {
  discordSettings,
  discordwaterFaucetSettings,
} from '../controllers/discord/settings';
import { executeTipFunction } from '../helpers/discord/executeTips';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';

config();

export const matrixRouter = async (
  matrixClient,
  queue,
  io,
  settings,
) => {
  let prepared;
  matrixClient.once('sync', (state, prevState, res) => {
    if (state !== 'PREPARED') return;
    matrixClient.setGlobalErrorOnUnknownDevices(false);
    if (state === 'PREPARED') {
      prepared = true;
    }
  });

  matrixClient.on("RoomMember.membership", async (
    event,
    member,
  ) => {
    // if (!prepared) return;
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
          await matrixClient.leave(member.roomId).then(() => {
            console.log("Auto-left %s", member.roomId);
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  matrixClient.on('Room.timeline', async (message, room) => {
    if (!prepared) return;
    if (matrixClient.credentials.userId === message.event.sender) return;
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

    let lastSeenMatrixTask;
    let faucetSetting;
    let body;
    // console.log(message);
    try {
      if (message.event.type === 'm.room.encrypted') {
        // console.log(matrixClient);
        // const event = await matrixClient._crypto.decryptEvent(message);
        const event = await matrixClient.crypto.decryptEvent(message);
        ({ body } = event.clearEvent.content);
      } else {
        ({ body } = message.event.content);
      }
    } catch (error) {
      console.error('#### ', error);
    }
    // console.log(body);
    if (body) {
      const room = await matrixClient.getRoom(message.event.room_id);
      const space = await matrixClient.getRoomHierarchy(message.event.room_id);
      // console.log(room);
      // console.log(message.event);
      // console.log(room.name);
      // console.log(room.events);
      // console.log(space);

      if (!body.startsWith(settings.bot.command.matrix)) return;
      if (body.startsWith(settings.bot.command.matrix)) {
        // let userDirectMessageRoomId;
        const preFilteredMessageDiscord = body.split(' ');
        const filteredMessageDiscord = preFilteredMessageDiscord.filter((el) => el !== '');
        console.log(filteredMessageDiscord);

        const [
          directUserMessageRoom,
          isCurrentRoomDirectMessage,
          userState,
        ] = await findUserDirectMessageRoom(
          matrixClient,
          message.sender.userId,
          message.sender.roomId,
        );
        // console.log(directUserMessageRoom);
        // console.log(userState);
        // console.log(isCurrentRoomDirectMessage);
        // console.log('iserDirect');
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
        // console.log(directUserMessageRoom);
        // console.log('directUserMessageRoom');

        if (filteredMessageDiscord[1] === undefined) {
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

        if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            // const task = await discordHelp(message, io);
            const task = await matrixHelp(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
        }

        if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'balance') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            // const task = await discordHelp(message, io);
            const task = await matrixBalance(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
        }

        if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'deposit') {
          // const limited = await limitHelp(message);
          // if (limited) return;
          await queue.add(async () => {
            // const task = await discordHelp(message, io);
            const task = await matrixWalletDepositAddress(
              matrixClient,
              message,
              userDirectMessageRoomId,
              io,
            );
          });
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
