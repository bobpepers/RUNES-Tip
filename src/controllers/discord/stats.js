/* eslint-disable guard-for-in */
/* eslint-disable import/prefer-default-export */
import {
  warnDirectMessage,
  statsMessage,
  invalidTimeMessage,
  walletNotFoundMessage,
  // serverStatsMessage,
} from '../../messages/discord';
import db from '../../models';
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

const { Op } = require('sequelize');

const _ = require('lodash');

function groupGlobal(arr, type, whichGroup) {
  return arr.reduce((res, obj) => {
    const newObj = {
      amount: obj.amount,
    };
    if (!res.global) {
      res.global = {};
    }
    if (!res.global[type]) {
      res.global[type] = {};
    }
    if (res.global[type][whichGroup]) {
      res.global[type][whichGroup].push(newObj);
    } else {
      res.global[type][whichGroup] = [newObj];
    }
    return res;
  }, {});
}

function group(arr, type, whichGroup) {
  return arr.reduce((res, obj) => {
    const key = obj.group && obj.group.groupName ? obj.group.groupName : 'undefined';
    const newObj = {
      amount: obj.amount,
    };
    if (!res[key]) {
      res[key] = {};
    }
    if (!res[key][type]) {
      res[key][type] = {};
    }
    if (res[key][type][whichGroup]) {
      res[key][type][whichGroup].push(newObj);
    } else {
      res[key][type][whichGroup] = [newObj];
    }
    return res;
  }, {});
}

export const discordStats = async (
  message,
  filteredMessageDiscord,
  io,
  groupTask,
  channelTask,
) => {
  const activity = [];
  const parentWhereOptions = {};
  const childWhereOptions = {};
  const childWhereOptionsTriviaTips = {};
  let textTime;
  let cutLastTimeLetter;
  let cutNumberTime;
  let isnum;

  let user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
    },
  });

  if (!user) {
    const activityA = await db.activity.create({
      type: 'stats_f',
      spenderId: user.id,
    });
    activity.unshift(activityA);
    await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Stats')] }).catch((e) => {
      console.log(e);
    });
    return;
  }

  if (filteredMessageDiscord[2]) {
    // eslint-disable-next-line prefer-destructuring
    textTime = filteredMessageDiscord[2];
    cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
    cutNumberTime = textTime.substring(0, textTime.length - 1);
    isnum = /^\d+$/.test(cutNumberTime);
  }
  if (
    (filteredMessageDiscord[2]
      && !isnum)
    // && Number(cutNumberTime) < 0
    && (
      cutLastTimeLetter !== 'd'
      || cutLastTimeLetter !== 'h'
      || cutLastTimeLetter !== 'm'
      || cutLastTimeLetter !== 's')
  ) {
    console.log('not pass');
    const activityA = await db.activity.create({
      type: 'stats_i',
      spenderId: user.id,
    });
    activity.unshift(activityA);
    await message.channel.send({ embeds: [invalidTimeMessage(message, 'Stats')] }).catch((e) => {
      console.log(e);
    });
    return;
  }

  if (
    (filteredMessageDiscord[2]
      && isnum)
    // && Number(cutNumberTime) < 0
    && (
      cutLastTimeLetter === 'd'
      || cutLastTimeLetter === 'h'
      || cutLastTimeLetter === 'm'
      || cutLastTimeLetter === 's')
  ) {
    let dateObj = await new Date().getTime();
    if (cutLastTimeLetter === 'd') {
      dateObj -= Number(cutNumberTime) * 24 * 60 * 60 * 1000;
    }
    if (cutLastTimeLetter === 'h') {
      dateObj -= Number(cutNumberTime) * 60 * 60 * 1000;
    }
    if (cutLastTimeLetter === 'm') {
      dateObj -= Number(cutNumberTime) * 60 * 1000;
    }
    if (cutLastTimeLetter === 's') {
      dateObj -= Number(cutNumberTime) * 1000;
    }
    dateObj = await new Date(dateObj);
    childWhereOptions.createdAt = { [Op.gte]: dateObj };
    // childWhereOptionsTrivia.createdAt = { [Op.gte]: dateObj };
    childWhereOptionsTriviaTips.createdAt = { [Op.gte]: dateObj };
  }
  childWhereOptionsTriviaTips.amount = { [Op.ne]: null };
  parentWhereOptions.user_id = `discord-${message.author.id}`;

  if (message.channel.type === 'GUILD_TEXT') {
    childWhereOptions.groupId = groupTask.id;
    childWhereOptionsTriviaTips.groupId = groupTask.id;
    message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Statistics')] }).catch((e) => {
      console.log(e);
    });
  }

  user = await db.user.findOne({
    where: parentWhereOptions,
    include: [
      // Spend
      {
        model: db.tip,
        as: 'tips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.reactdrop,
        as: 'reactdrops',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.trivia,
        as: 'trivias',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
          {
            model: db.triviatip,
            as: 'triviatips',
            where: {
              amount: { [Op.ne]: null },
            },
          },
        ],
      },
      {
        model: db.flood,
        as: 'floods',
        required: false,
        separate: true,
        where: childWhereOptions,
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
        where: childWhereOptions,
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
        where: childWhereOptions,
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
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.thunder,
        as: 'thunders',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.thunderstorm,
        as: 'thunderstorms',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },

      // Earned
      {
        model: db.tiptip,
        as: 'tiptips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.thunderstormtip,
        as: 'thunderstormtips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.triviatip,
        as: 'triviatips',
        required: false,
        separate: true,
        where: childWhereOptionsTriviaTips,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.reactdroptip,
        as: 'reactdroptips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.floodtip,
        as: 'floodtips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.soaktip,
        as: 'soaktips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.hurricanetip,
        as: 'hurricanetips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.thundertip,
        as: 'thundertips',
        required: false,
        separate: true,
        where: childWhereOptions,
        include: [
          {
            model: db.group,
            as: 'group',
            required: false,
          },
        ],
      },
      {
        model: db.sleettip,
        as: 'sleettips',
        required: false,
        separate: true,
        where: childWhereOptions,
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
  if (!user) {
    return;
  }
  let groupedTips;
  let groupedTipTips;
  let groupedReactdrops;
  let groupedFloods;
  let groupedSoaks;
  let groupedHurricanes;
  let groupedThunderStorms;
  let groupedThunders;
  let groupedSleets;
  let groupedReactdropTips;
  let groupedFloodTips;
  let groupedSoakTips;
  let groupedHurricaneTips;
  let groupedThunderStormTips;
  let groupedThunderTips;
  let groupedSleetTips;

  let groupedTrivia;
  let groupedTriviaTips;

  console.log(user.triviatips);
  if (message.channel.type === 'DM') {
    // spend
    groupedTips = user.tips ? groupGlobal(user.tips, 'spend', 'tips') : {};
    groupedReactdrops = user.reactdrops ? groupGlobal(user.reactdrops, 'spend', 'reactdrops') : {};
    groupedFloods = user.floods ? groupGlobal(user.floods, 'spend', 'floods') : {};
    groupedSoaks = user.soaks ? groupGlobal(user.soaks, 'spend', 'soaks') : {};
    groupedHurricanes = user.hurricanes ? groupGlobal(user.hurricanes, 'spend', 'hurricanes') : {};
    groupedThunderStorms = user.thunderstorms ? groupGlobal(user.thunderstorms, 'spend', 'thunderstorms') : {};
    groupedThunders = user.thunders ? groupGlobal(user.thunders, 'spend', 'thunders') : {};
    groupedSleets = user.sleets ? groupGlobal(user.sleets, 'spend', 'sleets') : {};
    groupedTrivia = user.trivias ? groupGlobal(user.trivias, 'spend', 'trivias') : {};

    // earned
    groupedTipTips = user.tiptips ? groupGlobal(user.tiptips, 'earned', 'tips') : {};
    groupedReactdropTips = user.reactdroptips ? groupGlobal(user.reactdroptips, 'earned', 'reactdrops') : {};
    groupedFloodTips = user.floodtips ? groupGlobal(user.floodtips, 'earned', 'floods') : {};
    groupedSoakTips = user.soaktips ? groupGlobal(user.soaktips, 'earned', 'soaks') : {};
    groupedHurricaneTips = user.hurricanetips ? groupGlobal(user.hurricanetips, 'earned', 'hurricanes') : {};
    groupedThunderStormTips = user.thunderstormtips ? groupGlobal(user.thunderstormtips, 'earned', 'thunderstorms') : {};
    groupedThunderTips = user.thundertips ? groupGlobal(user.thundertips, 'earned', 'thunders') : {};
    groupedSleetTips = user.sleettips ? groupGlobal(user.sleettips, 'earned', 'sleets') : {};
    groupedTriviaTips = user.triviatips ? groupGlobal(user.triviatips, 'earned', 'trivias') : {};
  }
  if (message.channel.type === 'GUILD_TEXT') {
    // spend
    groupedTips = user.tips ? group(user.tips, 'spend', 'tips') : {};
    groupedReactdrops = user.reactdrops ? group(user.reactdrops, 'spend', 'reactdrops') : {};
    groupedFloods = user.floods ? group(user.floods, 'spend', 'floods') : {};
    groupedSoaks = user.soaks ? group(user.soaks, 'spend', 'soaks') : {};
    groupedHurricanes = user.hurricanes ? group(user.hurricanes, 'spend', 'hurricanes') : {};
    groupedThunderStorms = user.thunderstorms ? group(user.thunderstorms, 'spend', 'thunderstorms') : {};
    groupedThunders = user.thunders ? group(user.thunders, 'spend', 'thunders') : {};
    groupedSleets = user.sleets ? group(user.sleets, 'spend', 'sleets') : {};
    groupedTrivia = user.trivias ? group(user.trivias, 'spend', 'trivias') : {};

    // earned
    groupedTipTips = user.tiptips ? group(user.tiptips, 'earned', 'tips') : {};
    groupedReactdropTips = user.reactdroptips ? group(user.reactdroptips, 'earned', 'reactdrops') : {};
    groupedFloodTips = user.floodtips ? group(user.floodtips, 'earned', 'floods') : {};
    groupedSoakTips = user.soaktips ? group(user.soaktips, 'earned', 'soaks') : {};
    groupedHurricaneTips = user.hurricanetips ? group(user.hurricanetips, 'earned', 'hurricanes') : {};
    groupedThunderStormTips = user.thunderstormtips ? group(user.thunderstormtips, 'earned', 'thunderstorms') : {};
    groupedThunderTips = user.thundertips ? group(user.thundertips, 'earned', 'thunders') : {};
    groupedSleetTips = user.sleettips ? group(user.sleettips, 'earned', 'sleets') : {};
    groupedTriviaTips = user.triviatips ? group(user.triviatips, 'earned', 'trivias') : {};
  }

  // merge results into a single object
  const mergedObject = _.merge(

    // Spend
    groupedTips,
    groupedReactdrops,
    groupedFloods,
    groupedSoaks,
    groupedHurricanes,
    groupedThunderStorms,
    groupedThunders,
    groupedSleets,
    groupedTrivia,

    // Earned
    groupedTipTips,
    groupedReactdropTips,
    groupedFloodTips,
    groupedSoakTips,
    groupedHurricaneTips,
    groupedThunderStormTips,
    groupedThunderTips,
    groupedSleetTips,
    groupedTriviaTips,
  );

  if (_.isEmpty(mergedObject)) {
    await message.author.send({ embeds: [statsMessage(message, "No data found!")] }).catch((e) => {
      console.log(e);
    });
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const serverObj in mergedObject) {
    // Spend
    const spendTips = mergedObject[serverObj].spend && mergedObject[serverObj].spend.tips
      && `${mergedObject[serverObj].spend.tips.length} tips for ${mergedObject[serverObj].spend.tips.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendFloods = mergedObject[serverObj].spend && mergedObject[serverObj].spend.floods
      && `${mergedObject[serverObj].spend.floods.length} floods for ${mergedObject[serverObj].spend.floods.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendRains = mergedObject[serverObj].spend && mergedObject[serverObj].spend.rains
      && `${mergedObject[serverObj].spend.rains.length} rains for ${mergedObject[serverObj].spend.rains.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendSoaks = mergedObject[serverObj].spend && mergedObject[serverObj].spend.soaks
      && `${mergedObject[serverObj].spend.soaks.length} soaks for ${mergedObject[serverObj].spend.soaks.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendHurricanes = mergedObject[serverObj].spend && mergedObject[serverObj].spend.hurricanes
      && `${mergedObject[serverObj].spend.hurricanes.length} hurricanes for ${mergedObject[serverObj].spend.hurricanes.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendThunders = mergedObject[serverObj].spend && mergedObject[serverObj].spend.thunders
      && `${mergedObject[serverObj].spend.thunders.length} thunders for ${mergedObject[serverObj].spend.thunders.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendThunderstorms = mergedObject[serverObj].spend && mergedObject[serverObj].spend.thunderstorms
      && `${mergedObject[serverObj].spend.thunderstorms.length} thunderstorms for ${mergedObject[serverObj].spend.thunderstorms.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendReactDrops = mergedObject[serverObj].spend && mergedObject[serverObj].spend.reactdrops
      && `${mergedObject[serverObj].spend.reactdrops.length} reactdrops for ${mergedObject[serverObj].spend.reactdrops.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendTrivias = mergedObject[serverObj].spend && mergedObject[serverObj].spend.trivias
      && `${mergedObject[serverObj].spend.trivias.length} Trivia for ${mergedObject[serverObj].spend.trivias.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const spendTotal = (mergedObject[serverObj].spend && mergedObject[serverObj].spend.tips ? mergedObject[serverObj].spend.tips.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
      + (mergedObject[serverObj].spend && mergedObject[serverObj].spend.floods ? mergedObject[serverObj].spend.floods.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
      + (mergedObject[serverObj].spend && mergedObject[serverObj].spend.rains ? mergedObject[serverObj].spend.rains.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
      + (mergedObject[serverObj].spend && mergedObject[serverObj].spend.soaks ? mergedObject[serverObj].spend.soaks.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
      + (mergedObject[serverObj].spend && mergedObject[serverObj].spend.hurricanes ? mergedObject[serverObj].spend.hurricanes.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
      + (mergedObject[serverObj].spend && mergedObject[serverObj].spend.thunders ? mergedObject[serverObj].spend.thunders.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
      + (mergedObject[serverObj].spend && mergedObject[serverObj].spend.thunderstorms ? mergedObject[serverObj].spend.thunderstorms.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
      + (mergedObject[serverObj].spend && mergedObject[serverObj].spend.reactdrops ? mergedObject[serverObj].spend.reactdrops.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0);

    // Earned
    const earnedTips = mergedObject[serverObj].earned && mergedObject[serverObj].earned.tips
      && `${mergedObject[serverObj].earned.tips.length} tips for ${mergedObject[serverObj].earned.tips.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedFloods = mergedObject[serverObj].earned && mergedObject[serverObj].earned.floods
      && `${mergedObject[serverObj].earned.floods.length} floods for ${mergedObject[serverObj].earned.floods.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedRains = mergedObject[serverObj].earned && mergedObject[serverObj].earned.rains
      && `${mergedObject[serverObj].earned.rains.length} rains for ${mergedObject[serverObj].earned.rains.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedSoaks = mergedObject[serverObj].earned && mergedObject[serverObj].earned.soaks
      && `${mergedObject[serverObj].earned.soaks.length} soaks for ${mergedObject[serverObj].earned.soaks.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedHurricanes = mergedObject[serverObj].earned && mergedObject[serverObj].earned.hurricanes
      && `${mergedObject[serverObj].earned.hurricanes.length} hurricanes for ${mergedObject[serverObj].earned.hurricanes.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedThunders = mergedObject[serverObj].earned && mergedObject[serverObj].earned.thunders
      && `${mergedObject[serverObj].earned.thunders.length} thunders for ${mergedObject[serverObj].earned.thunders.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedThunderstorms = mergedObject[serverObj].earned && mergedObject[serverObj].earned.thunderstorms
      && `${mergedObject[serverObj].earned.thunderstorms.length} thunderstorms for ${mergedObject[serverObj].earned.thunderstorms.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedReactDrops = mergedObject[serverObj].earned && mergedObject[serverObj].earned.reactdrops
      && `${mergedObject[serverObj].earned.reactdrops.length} reactdrops for ${mergedObject[serverObj].earned.reactdrops.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedTrivias = mergedObject[serverObj].earned && mergedObject[serverObj].earned.trivias
      && `${mergedObject[serverObj].earned.trivias.length} trivia for ${mergedObject[serverObj].earned.trivias.reduce((a, b) => +a + +b.amount, 0) / 1e8} ${settings.coin.ticker}`;

    const earnedTotal = (mergedObject[serverObj].earned && mergedObject[serverObj].earned.tips ? mergedObject[serverObj].earned.tips.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
    + (mergedObject[serverObj].earned && mergedObject[serverObj].earned.floods ? mergedObject[serverObj].earned.floods.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
    + (mergedObject[serverObj].earned && mergedObject[serverObj].earned.rains ? mergedObject[serverObj].earned.rains.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
    + (mergedObject[serverObj].earned && mergedObject[serverObj].earned.soaks ? mergedObject[serverObj].earned.soaks.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
    + (mergedObject[serverObj].earned && mergedObject[serverObj].earned.hurricanes ? mergedObject[serverObj].earned.hurricanes.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
    + (mergedObject[serverObj].earned && mergedObject[serverObj].earned.thunders ? mergedObject[serverObj].earned.thunders.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
    + (mergedObject[serverObj].earned && mergedObject[serverObj].earned.thunderstorms ? mergedObject[serverObj].earned.thunderstorms.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0)
    + (mergedObject[serverObj].earned && mergedObject[serverObj].earned.reactdrops ? mergedObject[serverObj].earned.reactdrops.reduce((a, b) => +a + +b.amount, 0) / 1e8 : 0);

    const serverString = `_**${serverObj}**_
    
${mergedObject[serverObj].spend ? '_Spend_\n' : ''}
${spendTips ? `Tips: ${spendTips}\n` : ''}${spendRains ? `Rains: ${spendRains}\n` : ''}${spendFloods ? `Floods: ${spendFloods}\n` : ''}${spendSoaks ? `Soaks: ${spendSoaks}\n` : ''}${spendHurricanes ? `Hurricanes: ${spendHurricanes}\n` : ''}${spendThunders ? `Thunders: ${spendThunders}\n` : ''}${spendThunderstorms ? `Thunderstorms: ${spendThunderstorms}\n` : ''}${spendReactDrops ? `ReactDrops: ${spendReactDrops}\n` : ''}${spendTrivias ? `Trivia: ${spendTrivias}\n` : ''}${spendTotal ? `Total Spend: ${spendTotal} ${settings.coin.ticker}\n` : ''}
  
${mergedObject[serverObj].earned ? '_Earned_\n' : ''}
${earnedTips ? `Tips: ${earnedTips}\n` : ''}${earnedRains ? `Rains: ${earnedRains}\n` : ''}${earnedFloods ? `Floods: ${earnedFloods}\n` : ''}${earnedSoaks ? `Soaks: ${earnedSoaks}\n` : ''}${earnedHurricanes ? `Hurricanes: ${earnedHurricanes}\n` : ''}${earnedThunders ? `Thunders: ${earnedThunders}\n` : ''}${earnedThunderstorms ? `Thunderstorms: ${earnedThunderstorms}\n` : ''}${earnedReactDrops ? `ReactDrops: ${earnedReactDrops}\n` : ''}${earnedTrivias ? `Trivia: ${earnedTrivias}\n` : ''}${earnedTotal ? `Total Earned: ${earnedTotal} ${settings.coin.ticker}\n` : ''}`;
    // eslint-disable-next-line no-await-in-loop
    await message.author.send({ embeds: [statsMessage(message, serverString)] }).catch((e) => {
      console.log(e);
    });
  }

  const preActivity = await db.activity.create({
    type: 'stats_s',
    earnerId: user.id,
  });
  const finalActivity = await db.activity.findOne({
    where: {
      id: preActivity.id,
    },
    include: [
      {
        model: db.user,
        as: 'earner',
      },
    ],
  });
  activity.unshift(finalActivity);
  io.to('admin').emit('updateActivity', {
    activity,
  });
  return true;
};
