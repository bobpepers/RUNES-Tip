/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import { Op } from 'sequelize';
import { Api } from 'telegram';
import db from '../../models';

export const banServer = async (
  req,
  res,
  next,
) => {
  const group = await db.group.findOne({
    where: {
      id: req.body.id,
    },
  });
  res.locals.name = 'banServer';
  res.locals.result = await group.update({
    banned: !group.banned,
    banMessage: req.body.banMessage,
  });

  next();
};

export const fetchServers = async (
  req,
  res,
  next,
) => {
  const userOptions = {};
  if (req.body.platform !== 'all') {
    if (req.body.platform === 'telegram') {
      userOptions.groupId = { [Op.startsWith]: 'telegram-' };
    }
    if (req.body.platform === 'discord') {
      userOptions.groupId = { [Op.startsWith]: 'discord-' };
    }
  }
  if (req.body.id !== '') {
    userOptions.id = Number(req.body.id);
  }
  if (req.body.groupId !== '') {
    userOptions.groupId = req.body.groupId;
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    limit: req.body.limit,
    offset: req.body.offset,
    where: userOptions,
  };

  const GroupsDB = await db.group.findAll(options);

  // const newArray = GroupsDB.filter((el) => el.groupId.startsWith('telegram-'));
  // const newTelegramIdArray = newArray.map((group) => group.groupId.replace('telegram-', ''));
  // console.log(newTelegramIdArray);

  const currentDiscordGuilds = await res.locals.discordClient.guilds.cache.map((guild) => guild.id);
  const currentMatrixRooms = await res.locals.matrixClient.getRooms();
  // const currentTelegramGroups = await res.locals.telegramApiClient.invoke(
  //   new Api.channels.GetChannels({
  //     id: newTelegramIdArray,
  //   }),
  // );
  // console.log(currentTelegramGroups);

  // eslint-disable-next-line guard-for-in
  const newGroupDBArray = GroupsDB.map((group) => {
    const myGroup = group.dataValues;

    if (myGroup.groupId.startsWith('discord-')) {
      const discordGroupId = myGroup.groupId.replace('discord-', '');
      if (currentDiscordGuilds.includes(discordGroupId)) {
        myGroup.isInServer = true;
      } else {
        myGroup.isInServer = false;
      }
    }

    if (myGroup.groupId.startsWith('matrix-')) {
      const matrixGroupId = myGroup.groupId.replace('matrix-', '');
      const foundRoom = currentMatrixRooms.find((o) => o.roomId === matrixGroupId);
      if (foundRoom) {
        myGroup.isInServer = true;
      } else {
        myGroup.isInServer = false;
      }
    }

    return myGroup;
  });

  res.locals.name = 'servers';
  res.locals.count = await db.group.count(options);
  res.locals.result = newGroupDBArray;
  next();
};

export const leaveServer = async (
  req,
  res,
  next,
) => {
  const server = await db.group.findOne({
    where: {
      id: req.body.id,
    },
  });
  if (!server) {
    throw new Error("SERVER_NOT_FOUND");
  }
  if (server.groupId.startsWith('discord-')) {
    const discordGroupId = server.groupId.replace('discord-', '');
    await res.locals.discordClient.guilds.cache.get(discordGroupId).leave();
  }
  if (server.groupId.startsWith('matrix-')) {
    const matrixGroupId = server.groupId.replace('matrix-', '');
    await res.locals.matrixClient.leave(matrixGroupId);
  }
  res.locals.name = 'leaveServer';
  res.locals.result = {
    id: server.id,
  };
  next();
};
