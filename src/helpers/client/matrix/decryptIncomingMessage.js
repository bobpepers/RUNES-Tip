export async function verifyDevice(client, userId, deviceId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('"userId" is required and must be a string.');
  }
  if (!deviceId || typeof deviceId !== 'string') {
    throw new Error('"deviceId" is required and must be a string.');
  }
  await client.setDeviceKnown(userId, deviceId, true);
  await client.setDeviceVerified(userId, deviceId, true);
}

export const decryptIncomingMessage = async (
  matrixClient,
  message,
) => {
  let myBody;
  console.log(message);
  try {
    if (message.event.type === 'm.room.encrypted') {
    //   const devices = matrixClient.getStoredDevicesForUser(message.sender.userId);
    //   // eslint-disable-next-line no-restricted-syntax
    //   for (const device of devices) {
    //     console.log(`DEVICE_ID -> ${message.event.content.device_id}`);
    //     console.log({ device });
    //     if (device.isUnverified()) {
    //       // eslint-disable-next-line no-await-in-loop
    //       await verifyDevice(matrixClient, message.sender.userId, device.deviceId);
    //     }
    //   }

      if (message.clearEvent.content.formatted_body) {
        myBody = message.clearEvent.content.formatted_body;
      } else if (message.clearEvent.content.body) {
        myBody = message.clearEvent.content.body;
      } else {
        // eslint-disable-next-line no-underscore-dangle
        const event = await matrixClient._crypto.decryptEvent(message);
        if (event.clearEvent.content.formatted_body) {
          myBody = event.clearEvent.content.formatted_body;
        } else {
          myBody = event.clearEvent.content.body;
        }
      }
    } else if (message.event.content.formatted_body) {
      myBody = message.event.content.formatted_body;
    } else {
      myBody = message.event.content.body;
    }
  } catch (error) {
    console.error('#### ', error);
  }
  return myBody;
};
