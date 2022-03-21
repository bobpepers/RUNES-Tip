import {
  confirmAllAmoutMessage,
  canceledAllAmoutMessage,
  timeOutAllAmoutMessage,
} from '../../../messages/matrix';

export const executeTipFunction = async (
  tipFunction,
  queue,
  amount,
  matrixClient,
  message,
  filteredMessage,
  io,
  groupTask,
  setting,
  faucetSetting,
  userDirectMessageRoomId,
  isCurrentRoomDirectMessage,
) => {
  let operationName;
  let userBeingTipped;
  if (
    filteredMessage[1].startsWith('<a')
      && !filteredMessage[2].startsWith('<a')
  ) {
    operationName = 'tip';
    userBeingTipped = filteredMessage[1];
  } else if (
    filteredMessage[1].startsWith('<a')
      && filteredMessage[2].startsWith('<a')
  ) {
    operationName = 'tip';
    userBeingTipped = 'multiple users';
  } else {
    operationName = filteredMessage[1];
  }
  if (amount && amount.toLowerCase() === 'all') {
    await matrixClient.sendEvent(
      message.event.room_id,
      "m.room.message",
      confirmAllAmoutMessage(
        message,
        operationName,
        userBeingTipped,
      ),
    ).then(async () => {
      let isRunning = true;
      const listenerFunction = async (confirmMessage, room) => {
        let tempBody = '';
        if (
          message.sender.userId === confirmMessage.sender.userId
          && message.sender.roomId === confirmMessage.sender.roomId
        ) {
          try {
            if (confirmMessage.event.type === 'm.room.encrypted') {
              const event = await matrixClient.crypto.decryptEvent(confirmMessage);
              tempBody = event.clearEvent.content.body;
            } else {
              tempBody = confirmMessage.event.content.body;
            }
          } catch (error) {
            console.error('#### ', error);
          }
          if (tempBody.toUpperCase() === 'YES'
          || tempBody.toUpperCase() === 'Y') {
            isRunning = false;
            matrixClient.off('Room.timeline', listenerFunction);
            await queue.add(async () => {
              const task = await tipFunction(
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
              );
            });
          } else if (tempBody.toUpperCase() === 'NO'
          || tempBody.toUpperCase() === 'N') {
            isRunning = false;
            matrixClient.off('Room.timeline', listenerFunction);
            await matrixClient.sendEvent(
              message.event.room_id,
              "m.room.message",
              canceledAllAmoutMessage(
                message,
                operationName,
                userBeingTipped,
              ),
            );
          }
        }
      };
      matrixClient.on('Room.timeline', listenerFunction);
      const myTimeout = setTimeout(async () => {
        if (isRunning) {
          matrixClient.off('Room.timeline', listenerFunction);
          await matrixClient.sendEvent(
            message.event.room_id,
            "m.room.message",
            timeOutAllAmoutMessage(
              message,
              operationName,
              userBeingTipped,
            ),
          );
        }
        clearTimeout(myTimeout);
      }, 30000);
    });
  } else {
    await queue.add(async () => {
      const task = await tipFunction(
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
      );
    });
  }
};
