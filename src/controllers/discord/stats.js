/* eslint-disable import/prefer-default-export */
import {
  warnDirectMessage,
  statsMessage,
} from '../../messages/discord';
import db from '../../models';

const _ = require('lodash');

function group(arr, type, whichGroup) {
  return arr.reduce((res, obj) => {
    const key = obj.group && obj.group.groupName ? obj.group.groupName : 'undefined';
    const newObj = { amount: obj.amount };
    if (!res[key]) { res[key] = {}; }
    if (!res[key][type]) { res[key][type] = {}; }
    if (res[key][type][whichGroup]) { res[key][type][whichGroup].push(newObj); } else { res[key][type][whichGroup] = [newObj]; }
    return res;
  }, {});
}

export const discordStats = async (message, io) => {
  const user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
    },
    include: [
      {
        model: db.reactdrop,
        as: 'reactdrops',
        required: false,
        separate: true,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.flood,
        as: 'floods',
        required: false,
        separate: true,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.soak,
        as: 'soaks',
        required: false,
        separate: true,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.sleet,
        as: 'sleets',
        required: false,
        separate: true,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },

      {
        model: db.hurricane,
        as: 'hurricanes',
        required: false,
        separate: true,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      // {
      //  model: db.thunder,
      //  as: 'thunders',
      //  required: false,
      //  include: [
      //    {
      //      model: db.group,
      //      as: 'group',
      //      required: false,
      //    },
      //  ],
      // },
      // {
      // model: db.thunderstorm,
      //      as: 'thunderstorms',
      //    required: false,
      //  include: [
      //  {
      //  model: db.group,
      // as: 'group',
      // required: false,
      // },
      // ],
      // },
    ],
  });
  console.log(user);
  if (!user) {
    return;
  }
  console.log('123');
  // group the resuts by server and type
  const groupedReactdrops = user.reactdrops ? group(user.reactdrops, 'spend', 'reactdrops') : {};
  const groupedFloods = user.floods ? group(user.floods, 'spend', 'floods') : {};
  const groupedSoaks = user.soaks ? group(user.soaks, 'spend', 'soaks') : {};
  const groupedHurricanes = user.hurricanes ? group(user.hurricanes, 'spend', 'hurricanes') : {};
  const groupedThunderStorms = user.thunderstorms ? group(user.thunderstorms, 'spend', 'thunderstorms') : {};
  const groupedThunders = user.thunder ? group(user.thunders, 'spend', 'thunders') : {};
  const groupedSleets = user.sleets ? group(user.sleets, 'spend', 'sleets') : {};
  console.log('456');
  // merge results into a single object
  const mergedObject = _.merge(
    groupedReactdrops,
    groupedFloods,
    groupedSoaks,
    groupedHurricanes,
    groupedThunderStorms,
    groupedThunders,
    groupedSleets,
  );
  console.log(mergedObject);

  if (message.channel.type === 'DM') {
    message.author.send({ embeds: [statsMessage(message)] });
  }
  if (message.channel.type === 'GUILD_TEXT') {
    message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Help')] });
    message.author.send({ embeds: [statsMessage(message, mergedObject)] });
  }

  let activity;

  // activity = await db.activity.create({
  //  type: 'help',
  //  earnerId: user.id,
  // });

  // activity = await db.activity.findOne({
  //  where: {
  // id: activity.id,
  // },
  //  include: [
  //  {
  //  model: db.user,
  //      as: 'earner',
  //     },
  //   ],
  // });
  // io.to('admin').emit('updateActivity', {
  //  activity,
  // });

  return true;
};
