/* eslint-disable no-await-in-loop */
import _ from 'lodash';
import db from '../../../models';
import { getInstance } from "../../../services/rclient";

export const mapMembers = async (
  matrixClient,
  message,
  t,
  onlineMembers,
  setting,
) => {
  let mappedMembersArray = [];
  const withoutBots = [];

  console.log(onlineMembers);

  mappedMembersArray = await onlineMembers.filter((a) => a.userId !== message.sender.userId && a.userId !== matrixClient.credentials.userId);
  // mappedMembersArray = await filterWithoutRoles.map((a) => a.user);

  if (mappedMembersArray.length > setting.maxSampleSize) {
    mappedMembersArray = await _.sampleSize(mappedMembersArray, setting.maxSampleSize);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const matrixUser of mappedMembersArray) {
    const userExist = await db.user.findOne({
      where: {
        user_id: `matrix-${matrixUser.userId}`,
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
              required: false,
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (userExist) {
      const userIdTest = await userExist.user_id.replace('matrix-', '');
      if (userIdTest !== message.sender.userId) {
        if (!userExist.banned) {
          await withoutBots.push(userExist);
        }
      }
    }
    if (!userExist) {
      let user;
      console.log(matrixUser);
      user = await db.user.create({
        user_id: `matrix-${matrixUser.userId}`,
        username: `${matrixUser.name}`,
        firstname: '',
        lastname: '',
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (user) {
        if (user.username !== `${matrixUser.name}`) {
          user = await user.update(
            {
              username: `${matrixUser.name}`,
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
          const newAddress = await getInstance().getNewAddress();
          const addressAlreadyExist = await db.address.findOne(
            {
              where: {
                address: newAddress,
              },
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
          if (!addressAlreadyExist) {
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
      }
      const userExistNew = await db.user.findOne({
        where: {
          user_id: `matrix-${matrixUser.userId}`,
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
        const userIdTest = await userExistNew.user_id.replace('matrix-', '');
        if (userIdTest !== message.sender.userId) {
          await withoutBots.push(userExistNew);
        }
      }
    }
  }
  const withoutBotsSorted = await _.sortBy(withoutBots, 'createdAt');
  return withoutBotsSorted;
};
