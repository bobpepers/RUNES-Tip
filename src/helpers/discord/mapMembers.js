/* eslint-disable no-await-in-loop */
import _ from 'lodash';
import db from '../../models';

export const mapMembers = async (
  message,
  t,
  optionalRoleMessage,
  onlineMembers,
  setting,
) => {
  let roleId;
  let mappedMembersArray = [];
  const withoutBots = [];

  if (optionalRoleMessage && optionalRoleMessage.startsWith('<@&')) {
    roleId = optionalRoleMessage.substr(3).slice(0, -1);
  }
  if (roleId) {
    const filterWithRoles = await onlineMembers.filter((member) => member._roles.includes(roleId) && !member.user.bot);
    mappedMembersArray = await filterWithRoles.map((a) => a.user);
  } else {
    mappedMembersArray = await onlineMembers.filter((a) => !a.user.bot);
    mappedMembersArray = await mappedMembersArray.map((a) => a.user);
  }
  if (mappedMembersArray.length > setting.maxSampleSize) {
    mappedMembersArray = await _.sampleSize(mappedMembersArray, setting.maxSampleSize);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const discordUser of mappedMembersArray) {
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
      const userIdTest = await userExist.user_id.replace('discord-', '');
      if (userIdTest !== message.author.id) {
        await withoutBots.push(userExist);
      }
    }
  }
  const withoutBotsSorted = await _.sortBy(withoutBots, 'createdAt');
  return withoutBotsSorted;
};
