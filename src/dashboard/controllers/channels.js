// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const banChannel = async (req, res, next) => {
  console.log('ban channel');
  next();
};

export const fetchChannels = async (req, res, next) => {
  const userOptions = {};
  if (req.body.id !== '') {
    userOptions.id = Number(req.body.id);
  }
  if (req.body.channelId !== '') {
    userOptions.groupId = req.body.channelId;
  }
  if (req.body.channelName !== '') {
    userOptions.channelName = req.body.channelName;
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    where: userOptions,
  };
  res.locals.channels = await db.channel.findAll(options);
  next();
};
