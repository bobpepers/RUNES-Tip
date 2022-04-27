import db from '../../models';

export const banChannel = async (
  req,
  res,
  next,
) => {
  const channel = await db.channel.findOne({
    where: {
      id: req.body.id,
    },
  });
  const updatedChannel = await channel.update({
    banned: !channel.banned,
    banMessage: req.body.banMessage,
  });
  res.locals.name = 'banChannel';
  res.locals.result = await db.channel.findOne({
    where: {
      id: req.body.id,
    },
    include: [
      {
        model: db.group,
        as: 'group',
      },
    ],
  });

  next();
};

export const fetchChannels = async (
  req,
  res,
  next,
) => {
  const channelOptions = {};
  if (req.body.id !== '') {
    channelOptions.id = Number(req.body.id);
  }
  if (req.body.channelId !== '') {
    channelOptions.channelId = req.body.channelId;
  }
  if (req.body.channelName !== '') {
    channelOptions.channelName = req.body.channelName;
  }
  if (req.body.serverId !== 'all') {
    channelOptions.groupId = req.body.serverId;
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    limit: req.body.limit,
    offset: req.body.offset,
    where: channelOptions,
    include: [
      {
        model: db.group,
        as: 'group',
      },
    ],
  };

  res.locals.name = 'channel';
  res.locals.count = await db.channel.count(options);
  res.locals.result = await db.channel.findAll(options);

  next();
};
