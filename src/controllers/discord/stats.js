/* eslint-disable import/prefer-default-export */
import {
  warnDirectMessage,
  statsMessage,
} from '../../messages/discord';
import db from '../../models';

const _ = require('lodash');

function group(arr, type, whichGroup) {
  return arr.reduce((res, obj) => {
    const key = obj.group.groupName;
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
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
    ],
  });
  console.log(user);
  if (!user) {
    return;
  }
  // group the resuts by server and type
  const groupedReactdrops = group(user.reactdrops, 'spend', 'reactdrops');
  const groupedFloods = group(user.floods, 'spend', 'floods');

  console.log(groupedReactdrops);
  // merge results into a single object
  const mergedObject = _.merge(
    groupedReactdrops,
    groupedFloods,
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
