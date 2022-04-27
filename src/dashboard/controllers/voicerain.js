import { Op, Sequelize } from 'sequelize';
import db from '../../models';

export const fetchVoicerains = async (
  req,
  res,
  next,
) => {
  const options = {
    order: [
      ['id', 'DESC'],
    ],
    limit: req.body.limit,
    offset: req.body.offset,
    include: [
      {
        model: db.user,
        as: 'user',
        attributes: [
          'id',
          'username',
          'user_id',
        ],
      },
      {
        model: db.group,
        as: 'group',
        attributes: [
          'id',
          'groupName',
          'groupId',
        ],
      },
    ],
  };

  res.locals.name = 'voicerain';
  res.locals.count = await db.voicerain.count(options);
  res.locals.result = await db.voicerain.findAll(options);
  next();
};

export const fetchVoicerain = async (
  req,
  res,
  next,
) => {
  const options = {
    where: {
      id: req.body.id,
    },
    include: [
      {
        model: db.group,
        as: 'group',
        required: false,
      },
      {
        model: db.channel,
        as: 'channel',
        required: false,
      },
      {
        model: db.user,
        as: 'user',
      },
      {
        model: db.voiceraintip,
        as: 'voiceraintips',
        include: [
          {
            model: db.user,
            as: 'user',
            include: [
              {
                model: db.wallet,
                as: 'wallet',
              },
            ],
          },
        ],
      },
    ],
  };

  res.locals.name = 'voicerain';
  res.locals.result = await db.voicerain.findOne(options);
  next();
};
