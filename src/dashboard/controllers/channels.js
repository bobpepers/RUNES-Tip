import db from '../../models';

export const banChannel = async (
  req,
  res,
  next,
) => {
  try {
    const channel = await db.channel.findOne({
      where: {
        id: req.body.id,
      },
    });
    const updatedChannel = await channel.update({
      banned: !channel.banned,
      banMessage: req.body.banMessage,
    });

    res.locals.channel = await db.channel.findOne({
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
  } catch (err) {
    res.locals.error = err;
    console.log(err);
  }
  // console.log(res.locals.channel);
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
    limit: 300,
    where: channelOptions,
    include: [
      {
        model: db.group,
        as: 'group',
      },
    ],
  };
  res.locals.channels = await db.channel.findAll(options);
  // console.log(res.locals.channels);
  next();
};
