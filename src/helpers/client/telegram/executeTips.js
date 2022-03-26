import { NewMessage } from 'telegram/events';
import {
  confirmAllAmoutMessage,
  canceledAllAmoutMessage,
  timeOutAllAmoutMessage,
} from '../../../messages/telegram';
// const { NewMessage } = require('telegram/events');

export const executeTipFunction = async (
  tipFunction,
  queue,
  amount,
  telegramClient,
  telegramApiClient,
  ctx,
  filteredMessage,
  io,
  groupTask,
  setting,
  faucetSetting,
) => {
  let operationName;
  let userBeingTipped;
  let chatId;
  if (
    ctx
    && ctx.update
    && ctx.update.message
    && ctx.update.message.chat
  ) {
    chatId = ctx.update.message.chat.id;
  } else if (
    ctx
    && ctx.message
    && ctx.message.chat
  ) {
    chatId = ctx.message.chat.id;
  }

  if (
    ctx
    && ctx.update
    && ctx.update.message
    && ctx.update.message.entities
    && ctx.update.message.entities.length === 1
  ) {
    operationName = 'tip';
    userBeingTipped = filteredMessage[1];
  } else if (
    ctx
    && ctx.update
    && ctx.update.message
    && ctx.update.message.entities
    && ctx.update.message.entities.length > 1
  ) {
    operationName = 'tip';
    userBeingTipped = 'multiple users';
  } else {
    operationName = filteredMessage[1];
  }
  if (amount && amount.toLowerCase() === 'all') {
    try {
      await ctx.replyWithHTML(
        confirmAllAmoutMessage(
          ctx,
          operationName,
          userBeingTipped,
        ),
      );
    } catch (e) {
      console.log(e);
    }

    let isRunning = true;
    const listenerFunction = async (event) => {
      const tempBody = event.message.message;
      if (
        (
          event.message
          && event.message.fromId
          && ctx.update.message.from.id === Number(event.message.fromId.userId)
        )
        || (
          chatId === ctx.update.message.from.id
        )
      ) {
        if (tempBody.toUpperCase() === 'YES'
            || tempBody.toUpperCase() === 'Y') {
          isRunning = false;
          await telegramApiClient.removeEventHandler(
            listenerFunction,
            new NewMessage({
              chats: [
                chatId,
              ],
            }),
          );
          await queue.add(async () => {
            const task = await tipFunction(
              telegramClient,
              telegramApiClient,
              ctx,
              filteredMessage,
              io,
              groupTask,
              setting,
              faucetSetting,
              queue,
            );
          });
        } else if (tempBody.toUpperCase() === 'NO'
            || tempBody.toUpperCase() === 'N') {
          isRunning = false;
          await telegramApiClient.removeEventHandler(
            listenerFunction,
            new NewMessage({
              chats: [
                chatId,
              ],
            }),
          );
          try {
            await ctx.replyWithHTML(
              canceledAllAmoutMessage(
                ctx,
                operationName,
                userBeingTipped,
              ),
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    };

    await telegramApiClient.addEventHandler(
      listenerFunction,
      new NewMessage({
        chats: [
          chatId,
        ],
      }),
    );

    const myTimeout = setTimeout(async () => {
      if (isRunning) {
        await telegramApiClient.removeEventHandler(
          listenerFunction,
          new NewMessage({
            chats: [
              chatId,
            ],
          }),
        );
        try {
          await ctx.replyWithHTML(
            timeOutAllAmoutMessage(
              ctx,
              operationName,
              userBeingTipped,
            ),
          );
        } catch (e) {
          console.log(e);
        }
      }
      clearTimeout(myTimeout);
    }, 30000);
  } else {
    await queue.add(async () => {
      const task = await tipFunction(
        telegramClient,
        telegramApiClient,
        ctx,
        filteredMessage,
        io,
        groupTask,
        setting,
        faucetSetting,
        queue,
      );
    });
  }
};
