import db from '../../models';

export const fetchTips = async (
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

  res.locals.name = 'tip';
  res.locals.count = await db.tip.count(options);
  res.locals.result = await db.tip.findAll(options);
  next();
};

export const fetchTip = async (
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
        model: db.tiptip,
        as: 'tiptips',
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

  res.locals.name = 'tip';
  res.locals.result = await db.tip.findOne(options);
  next();
};
