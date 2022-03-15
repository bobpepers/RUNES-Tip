import { inviteMatrixDirectMessageRoom } from '../../messages/matrix';

export const findUserDirectMessageRoom = async (
  matrixClient,
  userId,
  roomId = null,
) => {
  let type;
  let determinRoom;
  let determinUserDirectMessageState;
  let determinBotDirectMessageState;
  let invitedDMRooms;
  try {
    const rooms = matrixClient.getRooms();
    invitedDMRooms = rooms.filter((room) => {
      // getMyMembership -> "invite", "join", "leave", "ban"
      const membership = room.getMyMembership();
      type = room.getDMInviter() ? 'directMessage' : 'room';
      const allMembers = room.currentState.getMembers();
      if (type === 'room' && allMembers.length <= 2) {
        if (allMembers.some((m) => m.getDMInviter())) type = 'directMessage';
      }
      const members = room.getJoinedMembers();
      // const getCurrentState = room.currentState.getStateEvents("m.room.member", userId);
      // const getCurrentStateV = room.currentState.getStateEvents("m.room.member", matrixClient.credentials.userId);

      return type === 'directMessage';
    });

    if (invitedDMRooms.length > 1) {
      for (let i = 1; i < invitedDMRooms.length; i += 1) {
        matrixClient.store.removeRoom(invitedDMRooms[parseInt(i, 10)].roomId);
        matrixClient.leave(invitedDMRooms[parseInt(i, 10)].roomId);
      }
    }
    if (roomId) {
      determinRoom = invitedDMRooms.filter((i) => i.roomId === roomId);
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
  } catch (e) {
    console.log(e);
  }

  // console.log(invitedDMRooms);
  return [
    invitedDMRooms.length > 0 ? invitedDMRooms[0] : false,
    determinRoom && determinRoom.length > 0,
    determinUserDirectMessageState,
  ];
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
