/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  notEnoughActiveUsersMessage,
  walletNotFoundMessage,
  minimumMessage,
  AfterSuccessMessage,
} from '../../messages/discord';
import settings from '../../config/settings';

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const logger = require('../../helpers/logger');

export const discordSleet = async (client, message, filteredMessage) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [
            {
              model: db.address,
              as: 'addresses',
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!user) {
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Sleet')] });
      return;
    }
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }
    if (amount < Number(settings.min.discord.sleet)) {
      await message.channel.send({ embeds: [minimumMessage(message, 'Sleet')] });
      return;
    }
    if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Sleet')] });
      return;
    }
    if (amount <= 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Sleet')] });
      return;
    }
    if (user.wallet.available < amount) {
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Sleet')] });
      return;
    }
    const group = await db.group.findOne({
      where: {
        groupId: `discord-${message.guildId}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!group) {
      await message.channel.send("Group not found");
      return;
    }

    const usersToRain = await db.user.findAll({
      where: {
        [Op.and]: [
          {
            user_id: { [Op.not]: `discord-${message.author.id}` },
          },
        ],
      },
      include: [
        {
          model: db.active,
          as: 'active',
          // required: false,
          where: {
            [Op.and]: [
              {
                lastSeen: {
                  [Op.gte]: new Date(Date.now() - (15 * 60 * 1000)),
                },
              },
              {
                groupId: group.id,
              },
            ],
          },
        },
        {
          model: db.wallet,
          as: 'wallet',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (usersToRain.length < 2) {
      await message.channel.send({ embeds: [notEnoughActiveUsersMessage(message, 'Sleet')] });
      return;
    }
    if (usersToRain.length >= 2) {
      const updatedBalance = await user.wallet.update({
        available: user.wallet.available - amount,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const amountPerUser = (((amount / usersToRain.length).toFixed(0)));
      const sleetRecord = await db.sleet.create({
        amount,
        userCount: usersToRain.length,
        userId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const listOfUsersRained = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const sleetee of usersToRain) {
        // eslint-disable-next-line no-await-in-loop
        await sleetee.wallet.update({
          available: sleetee.wallet.available + Number(amountPerUser),
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        // eslint-disable-next-line no-await-in-loop
        await db.sleettip.create({
          amount: amountPerUser,
          userId: sleetee.id,
          sleetId: sleetRecord.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        const userIdTest = sleetee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdTest}>`);
      }
      const newStringListUsers = listOfUsersRained.join(", ");
      const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
      // eslint-disable-next-line no-restricted-syntax
      for (const element of cutStringListUsers) {
        // eslint-disable-next-line no-await-in-loop
        await message.channel.send(element);
      }

      await message.channel.send({ embeds: [AfterSuccessMessage(message, amount, usersToRain, amountPerUser, 'Sleet', 'sleeted')] });
      logger.info(`Success Rain Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send("Somethign went wrong.");
  });
};
