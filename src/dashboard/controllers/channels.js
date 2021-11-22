// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const banChannel = async (req, res, next) => {
  console.log('ban channel');
  try {
    const channel = await db.channel.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.channel = await channel.update({
      banned: !channel.banned,
    });
  } catch (err) {
    res.locals.error = err;
    console.log(err);
  }
  next();
};

export const fetchChannels = async (req, res, next) => {
  console.log('fetcChannels_____________________________');
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
  console.log(res.locals.channels);
  next();
};
