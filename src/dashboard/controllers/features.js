// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const fetchFeatures = async (req, res, next) => {
  console.log(req.body);
  const activityOptions = {};
  const groupOptions = {};
  const channelOptions = {};

  if (req.body.groupId !== '') {
    groupOptions.id = { [Op.like]: `%${Number(req.body.groupId)}%` };
  }
  if (req.body.channelId !== '') {
    channelOptions.id = { [Op.like]: `%${req.body.channelId}%` };
  }

  const options = {
    where: activityOptions,
    order: [
      ['id', 'DESC'],
    ],
    include: [
      {
        model: db.channel,
        as: 'channel',
        where: channelOptions,
        required: false,
      },
      {
        model: db.group,
        as: 'group',
        where: groupOptions,
        required: false,
      },
    ],
  };
  res.locals.features = await db.features.findAll(options);
  next();
};
