import db from '../../models';

export const fetchSoaks = async (
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

  res.locals.name = 'soak';
  res.locals.count = await db.soak.count(options);
  res.locals.result = await db.soak.findAll(options);
  next();
};

export const fetchSoak = async (
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
        model: db.soaktip,
        as: 'soaktips',
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

  res.locals.name = 'soak';
  res.locals.result = await db.soak.findOne(options);
  next();
};
