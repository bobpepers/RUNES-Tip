import { inviteMatrixDirectMessageRoom } from '../../messages/matrix';

const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
};

export const findUserDirectMessageRoom = async (
  matrixClient,
  userId,
  roomId = null,
) => {
  try {
    let determinRoom;
    let determinUserDirectMessageState;
    // let invitedDMRooms;
    const rooms = await matrixClient.getRooms();
    const invitedDMRooms = await asyncFilter(rooms, async (room) => {
      const members = await room.currentState.getMembers();
      if (members.length !== 2) return false;
      // const isDirect = room.timeline[0].getContent().is_direct;
      // const isDirect = room.timeline[0].getContent();
      // console.log(isDirect);
      return members[1]
        && members[0]
        && members[1].membership
        && members[0].membership
        && (members[1].membership === 'join' || members[1].membership === 'invite')
        && (members[1].userId === matrixClient.credentials.userId || members[1].userId === userId)
        && (members[0].membership === 'join' || members[0].membership === 'invite')
        && (members[0].userId === userId || members[0].userId === matrixClient.credentials.userId);
      // && isDirect;
    });
    // console.log(invitedDMRooms);
    // console.log('invitedDMRooms');

    if (roomId) {
      determinRoom = invitedDMRooms.filter((i) => i.roomId === roomId);
    }

    if (invitedDMRooms.length > 1) {
      for (let i = 1; i < invitedDMRooms.length; i += 1) {
        // matrixClient.store.removeRoom(invitedDMRooms[parseInt(i, 10)].roomId);
        await matrixClient.leave(invitedDMRooms[parseInt(i, 10)].roomId);
        await matrixClient.forget(invitedDMRooms[parseInt(i, 10)].roomId, true);
      }
    }

    if (invitedDMRooms.length > 0) {
      // console.log(invitedDMRooms[0]);
      determinUserDirectMessageState = invitedDMRooms[0].currentState.getStateEvents("m.room.member", userId).event.content.membership;
    }
    if (determinRoom && determinRoom.length > 0) {
      console.log('current room is DM');
    } else {
      console.log('current room is not a DM room');
    }
    return [
      invitedDMRooms && invitedDMRooms.length > 0 ? invitedDMRooms[0] : false,
      determinRoom && determinRoom.length > 0,
      determinUserDirectMessageState,
    ];
  } catch (e) {
    console.log(e);
  }
};

export const inviteUserToDirectMessageRoom = async (
  matrixClient,
  directUserMessageRoom,
  userState,
  userId,
  username,
  roomId = null,
) => {
  let userRoomId;
  try {
    console.log(userState);
    if (userState === 'leave' || userState === 'invite') {
      console.log('reinvited user to old room');
      console.log(directUserMessageRoom);
      userRoomId = await matrixClient.invite(
        directUserMessageRoom.roomId,
        userId,
      );
      await matrixClient.sendEvent(
        roomId,
        "m.room.message",
        inviteMatrixDirectMessageRoom(username),
      );
    } else if (!directUserMessageRoom) {
      console.log('creating new dm room');
      userRoomId = await matrixClient.createRoom({
        preset: 'trusted_private_chat',
        invite: [userId],
        is_direct: true,
      });
      await matrixClient.sendEvent(
        roomId,
        "m.room.message",
        inviteMatrixDirectMessageRoom(username),
      );
    }
    return directUserMessageRoom.roomId || userRoomId;
  } catch (e) {
    console.log(e);
  }
};
