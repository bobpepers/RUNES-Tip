import {
  telegramDepositConfirmedMessage,
  telegramWithdrawalConfirmedMessage,
  telegramIncomingDepositMessage,
} from '../messages/telegram';
import {
  discordDepositConfirmedMessage,
  discordWithdrawalConfirmedMessage,
  discordIncomingDepositMessage,
} from '../messages/discord';
import {
  matrixDepositConfirmedMessage,
  matrixWithdrawalConfirmedMessage,
  matrixIncomingDepositMessage,
} from '../messages/matrix';

import { findUserDirectMessageRoom } from './client/matrix/directMessageRoom';

export const isDepositOrWithdrawalCompleteMessageHandler = async (
  isDepositComplete,
  isWithdrawalComplete,
  discordClient,
  telegramClient,
  matrixClient,
  userToMessage,
  trans,
  amount,
) => {
  try {
    let userClientId;
    if (isDepositComplete) {
      if (userToMessage.user_id.startsWith('discord')) {
        userClientId = userToMessage.user_id.replace('discord-', '');
        const myClient = await discordClient.users.fetch(userClientId, false);
        await myClient.send({
          embeds: [
            discordDepositConfirmedMessage(
              amount,
              trans,
            ),
          ],
        });
      }

      if (userToMessage.user_id.startsWith('telegram')) {
        userClientId = userToMessage.user_id.replace('telegram-', '');
        await telegramClient.telegram.sendMessage(
          userClientId,
          await telegramDepositConfirmedMessage(
            amount,
            trans,
          ),
          {
            parse_mode: 'HTML',
          },
        );
      }

      if (userToMessage.user_id.startsWith('matrix')) {
        userClientId = userToMessage.user_id.replace('matrix-', '');
        const [
          directUserMessageRoom,
          isCurrentRoomDirectMessage,
          userState,
        ] = await findUserDirectMessageRoom(
          matrixClient,
          userClientId,
          // message.sender.roomId,
        );
        if (directUserMessageRoom) {
          await matrixClient.sendEvent(
            directUserMessageRoom.roomId,
            "m.room.message",
            matrixDepositConfirmedMessage(
              amount,
              trans,
            ),
          );
        }
      }
    }

    if (isWithdrawalComplete) {
      if (userToMessage.user_id.startsWith('discord')) {
        userClientId = userToMessage.user_id.replace('discord-', '');
        const myClient = await discordClient.users.fetch(userClientId, false);
        await myClient.send({
          embeds: [
            discordWithdrawalConfirmedMessage(
              userClientId,
              trans,
            ),
          ],
        });
      }

      if (userToMessage.user_id.startsWith('telegram')) {
        userClientId = userToMessage.user_id.replace('telegram-', '');
        await telegramClient.telegram.sendMessage(
          userClientId,
          await telegramWithdrawalConfirmedMessage(
            userToMessage,
            trans,
          ),
          {
            parse_mode: 'HTML',
          },
        );
      }

      if (userToMessage.user_id.startsWith('matrix')) {
        userClientId = userToMessage.user_id.replace('matrix-', '');
        const [
          directUserMessageRoom,
          isCurrentRoomDirectMessage,
          userState,
        ] = await findUserDirectMessageRoom(
          matrixClient,
          userClientId,
        );
        if (directUserMessageRoom) {
          await matrixClient.sendEvent(
            directUserMessageRoom.roomId,
            "m.room.message",
            matrixWithdrawalConfirmedMessage(
              userClientId,
              trans,
            ),
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const incomingDepositMessageHandler = async (
  discordClient,
  telegramClient,
  matrixClient,
  detail,
) => {
  try {
    if (detail.platform === 'telegram') {
      await telegramClient.telegram.sendMessage(
        detail.userId,
        await telegramIncomingDepositMessage(detail),
        {
          parse_mode: 'HTML',
        },
      );
    }
    if (detail.platform === 'discord') {
      const myClient = await discordClient.users.fetch(detail.userId, false);
      await myClient.send({
        embeds: [
          discordIncomingDepositMessage(detail),
        ],
      });
    }
    if (detail.platform === 'matrix') {
      const [
        directUserMessageRoom,
        isCurrentRoomDirectMessage,
        userState,
      ] = await findUserDirectMessageRoom(
        matrixClient,
        detail.userId,
      );
      if (directUserMessageRoom) {
        await matrixClient.sendEvent(
          directUserMessageRoom.roomId,
          "m.room.message",
          matrixIncomingDepositMessage(detail),
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};
