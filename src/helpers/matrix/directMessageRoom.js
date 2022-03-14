export const findUserDirectMessageRoom = async (
  matrixClient,
  message,
) => {
  const rooms = matrixClient.getRooms();
  const invitedDMRooms = rooms.filter((room) => {
    // getMyMembership -> "invite", "join", "leave", "ban"
    const membership = room.getMyMembership();
    const type = room.getDMInviter() ? 'directMessage' : 'room';
    const members = room.getJoinedMembers();
    const findBotUser = members.filter((i) => i.userId === matrixClient.credentials.userId);
    const findUser = members.filter((i) => i.userId === message.sender.userId);
    return (membership === 'invite' || membership === 'join')
      && type === 'directMessage'
      && findBotUser
      && findUser;
  });
  return invitedDMRooms;
};
