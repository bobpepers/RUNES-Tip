/* eslint-disable no-await-in-loop */
import _ from 'lodash';
import db from '../../models';
import { getInstance } from "../../services/rclient";

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
    const filterWithRoles = await onlineMembers.filter((member) => member._roles.includes(roleId) && !member.user.bot && member.user.id !== message.author.id);
    mappedMembersArray = await filterWithRoles.map((a) => a.user);
  } else {
    const filterWithoutRoles = await onlineMembers.filter((a) => !a.user.bot && a.user.id !== message.author.id);
    mappedMembersArray = await filterWithoutRoles.map((a) => a.user);
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
    if (!userExist) {
      let user;
      console.log(discordUser);
      user = await db.user.create({
        user_id: `discord-${discordUser.id}`,
        username: `${discordUser.username}#${discordUser.discriminator}`,
        firstname: '',
        lastname: '',
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (user) {
        if (user.username !== `${discordUser.username}#${discordUser.discriminator}`) {
          user = await user.update(
            {
              username: `${discordUser.username}#${discordUser.discriminator}`,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        let wallet = await db.wallet.findOne(
          {
            where: {
              userId: user.id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        if (!wallet) {
          wallet = await db.wallet.create({
            userId: user.id,
            available: 0,
            locked: 0,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        let address = await db.address.findOne(
          {
            where: {
              walletId: wallet.id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        if (!address) {
          console.log('adress not found');
          const newAddress = await getInstance().getNewAddress();
          console.log(newAddress);
          address = await db.address.create({
            address: newAddress,
            walletId: wallet.id,
            type: 'deposit',
            confirmed: true,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
      }
      const userExistNew = await db.user.findOne({
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
      if (userExistNew) {
        const userIdTest = await userExistNew.user_id.replace('discord-', '');
        if (userIdTest !== message.author.id) {
          await withoutBots.push(userExistNew);
        }
      }
    }
  }
  const withoutBotsSorted = await _.sortBy(withoutBots, 'createdAt');
  return withoutBotsSorted;
};
