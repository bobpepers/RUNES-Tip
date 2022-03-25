// import BigNumber from "bignumber.js";
// import db from '../../models';
import {
  confirmAllAmoutMessageDiscord,
  timeOutAllAmoutMessageDiscord,
  canceledAllAmoutMessageDiscord,
} from '../../../messages/discord';

export const executeTipFunction = async (
  tipFunction,
  queue,
  amount,
  discordClient,
  message,
  filteredMessageDiscord,
  io,
  groupTask,
  channelTask,
  setting,
  faucetSetting,
) => {
  let operationName;
  let userBeingTipped;
  if (
    filteredMessageDiscord[1].startsWith('<@')
    && !filteredMessageDiscord[2].startsWith('<@')
  ) {
    operationName = 'tip';
    userBeingTipped = filteredMessageDiscord[1];
  } else if (
    filteredMessageDiscord[1].startsWith('<@')
    && filteredMessageDiscord[2].startsWith('<@')
  ) {
    operationName = 'tip';
    userBeingTipped = 'multiple users';
  } else {
    operationName = filteredMessageDiscord[1];
  }
  if (amount && amount.toLowerCase() === 'all') {
    await message.channel.send({
      embeds: [
        confirmAllAmoutMessageDiscord(
          message,
          operationName,
          userBeingTipped,
        ),
      ],
    }).catch((e) => {
      console.log('failed to send message');
      console.log(e);
    });

    const msgFilter = (m) => {
      const filtered = m.author.id === message.author.id
          && (
            m.content.toUpperCase() === 'YES'
            || m.content.toUpperCase() === 'Y'
            || m.content.toUpperCase() === 'NO'
            || m.content.toUpperCase() === 'N'
          );
      return filtered;
    };

    message.channel.awaitMessages({
      filter: msgFilter,
      max: 1,
      time: 30000,
      errors: ['time'],
    }).then(async (collected) => {
      const collectedMessage = collected.first();
      if (
        collectedMessage.content.toUpperCase() === 'YES'
          || collectedMessage.content.toUpperCase() === 'Y'
      ) {
        await queue.add(async () => {
          const task = await tipFunction(
            discordClient,
            message,
            filteredMessageDiscord,
            io,
            groupTask,
            channelTask,
            setting,
            faucetSetting,
            queue,
          );
        });
      } else if (
        collectedMessage.content.toUpperCase() === 'NO'
          || collectedMessage.content.toUpperCase() === 'N'
      ) {
        await message.channel.send({
          embeds: [
            canceledAllAmoutMessageDiscord(
              message,
              operationName,
              userBeingTipped,
            ),
          ],
        }).catch((e) => {
          console.log('failed to send cancel message');
          console.log(e);
        });
      }
    }).catch(async (collected) => {
      await message.channel.send({
        embeds: [
          timeOutAllAmoutMessageDiscord(
            message,
            operationName,
            userBeingTipped,
          ),
        ],
      }).catch((e) => {
        console.log('failed to send timeout message');
        console.log(e);
      });
    });
  } else {
    await queue.add(async () => {
      const task = await tipFunction(
        discordClient,
        message,
        filteredMessageDiscord,
        io,
        groupTask,
        channelTask,
        setting,
        faucetSetting,
        queue,
      );
    });
  }
};
