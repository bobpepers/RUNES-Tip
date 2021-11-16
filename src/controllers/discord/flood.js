/* eslint-disable import/prefer-default-export */
import BigNumber from "bignumber.js";
import { Transaction } from "sequelize";
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
  walletNotFoundMessage,
  AfterSuccessMessage,
} from '../../messages/discord';
import settings from '../../config/settings';
import logger from "../../helpers/logger";

export const discordFlood = async (discordClient, message, filteredMessage) => {
  const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
  const onlineMembers = members.filter((member) => 
  member.presence?.status === "online"
  || member.presence?.status === "idle"
  || member.presence?.status === "dnd"
  || member.presence?.status === "offline"
  );
  const mappedMembersArray = onlineMembers.map((a) => {
    return a.user;
  });
  const withoutBots = [];
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
      });
      if (userExist) {
        const userIdTest = userExist.user_id.replace('discord-', '');
        if (userIdTest !== message.author.id) {
          withoutBots.push(userExist);
        }
      }
    }
  }

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
    if (!user) {
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Flood')] });
      return;
    }
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }
    if (amount < Number(settings.min.discord.flood)) {
      await message.channel.send({ embeds: [minimumMessage(message, 'Flood')] });
      return;
    } if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Flood')] });
      return;
    } if (amount <= 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Flood')] });
      return;
    }

    if (user.wallet.available < amount) {
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Flood')] });
      return;
    }
    if (withoutBots.length < 2) {
      await message.channel.send('Not enough online users');
      return;
    }
    const updatedBalance = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const amountPerUser = (((amount / withoutBots.length).toFixed(0)));
    const floodRecord = await db.flood.create({
      amount,
      userCount: withoutBots.length,
      userId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const floodee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      await floodee.wallet.update({
        available: floodee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      await db.floodtip.create({
        amount: amountPerUser,
        userId: floodee.id,
        floodId: floodRecord.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const userIdReceivedRain = floodee.user_id.replace('discord-', '');
      listOfUsersRained.push(`<@${userIdReceivedRain}>`);
    }

    const newStringListUsers = listOfUsersRained.join(", ");
    const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
    // eslint-disable-next-line no-restricted-syntax
    for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
      await message.channel.send(element);
    }

    await message.channel.send({ embeds: [AfterSuccessMessage(message, amount, withoutBots, amountPerUser, 'Flood', 'flooded')] });
    logger.info(`Success Rain Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
    message.channel.send('something went wrong');
  });
};
