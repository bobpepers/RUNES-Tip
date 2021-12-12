import db from '../../models';

export const mapMembers = async (
  message,
  t,
  optionalRoleMessage,
  onlineMembers,
) => {
  let roleId;
  let mappedMembersArray;
  const withoutBots = [];

  if (optionalRoleMessage && optionalRoleMessage.startsWith('<@&')) {
    roleId = optionalRoleMessage.substr(3).slice(0, -1);
  }
  if (roleId) {
    const filterWithRoles = onlineMembers.filter((product) => product._roles.includes(roleId));
    mappedMembersArray = filterWithRoles.map((a) => a.user);
  } else {
    mappedMembersArray = onlineMembers.map((a) => a.user);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const discordUser of mappedMembersArray) {
    // eslint-disable-next-line no-await-in-loop
    if (discordUser.bot === false) {
      // eslint-disable-next-line no-await-in-loop
      const userExist = await db.user.findOne({
        where: {
          user_id: `discord-${discordUser.id}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            required: true,
            include: [
              {
                model: db.address,
                as: 'addresses',
                required: true,
              },
            ],
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (userExist) {
        const userIdTest = userExist.user_id.replace('discord-', '');
        if (userIdTest !== message.author.id) {
          withoutBots.push(userExist);
        }
      }
    }
  }
  return withoutBots;
};
