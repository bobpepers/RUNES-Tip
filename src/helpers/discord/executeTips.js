import BigNumber from "bignumber.js";
import db from '../../models';
import {
  confirmAllAmoutMessageDiscord,
  timeOutAllAmoutMessageDiscord,
  canceledAllAmoutMessageDiscord,
} from '../../messages/discord';

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
  if (filteredMessageDiscord[1].startsWith('<@!')) {
    operationName = 'tip';
    userBeingTipped = filteredMessageDiscord[1];
  } else {
    operationName = filteredMessageDiscord[1];
  }
  if (amount && amount.toLowerCase() === 'all') {
    message.channel.send({ embeds: [confirmAllAmoutMessageDiscord(message, operationName, userBeingTipped)] }).then(async () => {
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
          await queue.add(() => task);
        } else if (
          collectedMessage.content.toUpperCase() === 'NO'
          || collectedMessage.content.toUpperCase() === 'N'
        ) {
          message.channel.send({ embeds: [canceledAllAmoutMessageDiscord(message, operationName, userBeingTipped)] });
        }
      }).catch((collected) => {
        message.channel.send({ embeds: [timeOutAllAmoutMessageDiscord(message, operationName, userBeingTipped)] });
      });
    });
  } else {
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
    await queue.add(() => task);
  }
};
