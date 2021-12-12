"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordStats = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

/* eslint-disable guard-for-in */

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var _require = require('sequelize'),
    Op = _require.Op;

var _ = require('lodash');

function groupGlobal(arr, type, whichGroup) {
  return arr.reduce(function (res, obj) {
    var newObj = {
      amount: obj.amount
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
  return arr.reduce(function (res, obj) {
    var key = obj.group && obj.group.groupName ? obj.group.groupName : 'undefined';
    var newObj = {
      amount: obj.amount
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

var discordStats = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, filteredMessageDiscord, io, groupTask, channelTask) {
    var parentWhereOptions, childWhereOptions, textTime, cutLastTimeLetter, cutNumberTime, isnum, dateObj, user, groupedTips, groupedTipTips, groupedReactdrops, groupedFloods, groupedSoaks, groupedHurricanes, groupedThunderStorms, groupedThunders, groupedSleets, groupedReactdropTips, groupedFloodTips, groupedSoakTips, groupedHurricaneTips, groupedThunderStormTips, groupedThunderTips, groupedSleetTips, mergedObject, serverObj, spendTips, spendFloods, spendRains, spendSoaks, spendHurricanes, spendThunders, spendThunderstorms, spendReactDrops, earnedTips, earnedFloods, earnedRains, earnedSoaks, earnedHurricanes, earnedThunders, earnedThunderstorms, earnedReactDrops, serverString, activity;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parentWhereOptions = {};
            childWhereOptions = {};

            if (filteredMessageDiscord[2]) {
              textTime = filteredMessageDiscord[2];
              cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
              cutNumberTime = textTime.substring(0, textTime.length - 1);
              isnum = /^\d+$/.test(cutNumberTime);
            }

            if (!(filteredMessageDiscord[2] && !isnum // && Number(cutNumberTime) < 0
            && (cutLastTimeLetter !== 'd' || cutLastTimeLetter !== 'h' || cutLastTimeLetter !== 'm' || cutLastTimeLetter !== 's'))) {
              _context.next = 6;
              break;
            }

            console.log('not pass');
            return _context.abrupt("return");

          case 6:
            if (!(filteredMessageDiscord[2] && isnum // && Number(cutNumberTime) < 0
            && (cutLastTimeLetter === 'd' || cutLastTimeLetter === 'h' || cutLastTimeLetter === 'm' || cutLastTimeLetter === 's'))) {
              _context.next = 18;
              break;
            }

            _context.next = 9;
            return new Date().getTime();

          case 9:
            dateObj = _context.sent;

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

            _context.next = 16;
            return new Date(dateObj);

          case 16:
            dateObj = _context.sent;
            childWhereOptions.createdAt = (0, _defineProperty2["default"])({}, Op.gte, dateObj);

          case 18:
            parentWhereOptions.user_id = "discord-".concat(message.author.id);

            if (message.channel.type === 'DM') {// message.author.send({ embeds: [statsMessage(message)] });
            }

            if (message.channel.type === 'GUILD_TEXT') {
              childWhereOptions.groupId = groupTask.id;
              message.channel.send({
                embeds: [(0, _discord.warnDirectMessage)(message.author.id, 'Statistics')]
              }); // message.author.send({ embeds: [statsMessage(message, serverString)] });
            }

            _context.next = 23;
            return _models["default"].user.findOne({
              where: parentWhereOptions,
              include: [// Spend
              {
                model: _models["default"].tip,
                as: 'tips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].reactdrop,
                as: 'reactdrops',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].flood,
                as: 'floods',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].soak,
                as: 'soaks',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].sleet,
                as: 'sleets',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].hurricane,
                as: 'hurricanes',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].thunder,
                as: 'thunders',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].thunderstorm,
                as: 'thunderstorms',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, // Earned
              {
                model: _models["default"].tiptip,
                as: 'tiptips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].thunderstormtip,
                as: 'thunderstormtips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].reactdroptip,
                as: 'reactdroptips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].floodtip,
                as: 'floodtips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].soaktip,
                as: 'soaktips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].hurricanetip,
                as: 'hurricanetips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].thundertip,
                as: 'thundertips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }, {
                model: _models["default"].sleettip,
                as: 'sleettips',
                required: false,
                separate: true,
                where: childWhereOptions,
                include: [{
                  model: _models["default"].group,
                  as: 'group',
                  required: false
                }]
              }]
            });

          case 23:
            user = _context.sent;

            if (user) {
              _context.next = 26;
              break;
            }

            return _context.abrupt("return");

          case 26:
            if (message.channel.type === 'DM') {
              // spend
              groupedTips = user.tips ? groupGlobal(user.tips, 'spend', 'tips') : {};
              groupedReactdrops = user.reactdrops ? groupGlobal(user.reactdrops, 'spend', 'reactdrops') : {};
              groupedFloods = user.floods ? groupGlobal(user.floods, 'spend', 'floods') : {};
              groupedSoaks = user.soaks ? groupGlobal(user.soaks, 'spend', 'soaks') : {};
              groupedHurricanes = user.hurricanes ? groupGlobal(user.hurricanes, 'spend', 'hurricanes') : {};
              groupedThunderStorms = user.thunderstorms ? groupGlobal(user.thunderstorms, 'spend', 'thunderstorms') : {};
              groupedThunders = user.thunders ? groupGlobal(user.thunders, 'spend', 'thunders') : {};
              groupedSleets = user.sleets ? groupGlobal(user.sleets, 'spend', 'sleets') : {}; // earned

              groupedTipTips = user.tiptips ? groupGlobal(user.tiptips, 'earned', 'tips') : {};
              groupedReactdropTips = user.reactdroptips ? groupGlobal(user.reactdroptips, 'earned', 'reactdrops') : {};
              groupedFloodTips = user.floodtips ? groupGlobal(user.floodtips, 'earned', 'floods') : {};
              groupedSoakTips = user.soaktips ? groupGlobal(user.soaktips, 'earned', 'soaks') : {};
              groupedHurricaneTips = user.hurricanetips ? groupGlobal(user.hurricanetips, 'earned', 'hurricanes') : {};
              groupedThunderStormTips = user.thunderstormtips ? groupGlobal(user.thunderstormtips, 'earned', 'thunderstorms') : {};
              groupedThunderTips = user.thundertips ? groupGlobal(user.thundertips, 'earned', 'thunders') : {};
              groupedSleetTips = user.sleettips ? groupGlobal(user.sleettips, 'earned', 'sleets') : {};
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
              groupedSleets = user.sleets ? group(user.sleets, 'spend', 'sleets') : {}; // earned

              groupedTipTips = user.tiptips ? group(user.tiptips, 'earned', 'tips') : {};
              groupedReactdropTips = user.reactdroptips ? group(user.reactdroptips, 'earned', 'reactdrops') : {};
              groupedFloodTips = user.floodtips ? group(user.floodtips, 'earned', 'floods') : {};
              groupedSoakTips = user.soaktips ? group(user.soaktips, 'earned', 'soaks') : {};
              groupedHurricaneTips = user.hurricanetips ? group(user.hurricanetips, 'earned', 'hurricanes') : {};
              groupedThunderStormTips = user.thunderstormtips ? group(user.thunderstormtips, 'earned', 'thunderstorms') : {};
              groupedThunderTips = user.thundertips ? group(user.thundertips, 'earned', 'thunders') : {};
              groupedSleetTips = user.sleettips ? group(user.sleettips, 'earned', 'sleets') : {};
            } // group the resuts by server and type
            // merge results into a single object


            mergedObject = _.merge( // Spend
            groupedTips, groupedReactdrops, groupedFloods, groupedSoaks, groupedHurricanes, groupedThunderStorms, groupedThunders, groupedSleets, // Earned
            groupedTipTips, groupedReactdropTips, groupedFloodTips, groupedSoakTips, groupedHurricaneTips, groupedThunderStormTips, groupedThunderTips, groupedSleetTips);

            if (!_.isEmpty(mergedObject)) {
              _context.next = 32;
              break;
            }

            _context.next = 32;
            return message.author.send({
              embeds: [(0, _discord.statsMessage)(message, "No data found!")]
            });

          case 32:
            _context.t0 = _regenerator["default"].keys(mergedObject);

          case 33:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 56;
              break;
            }

            serverObj = _context.t1.value;
            // Spend
            spendTips = mergedObject[serverObj].spend && mergedObject[serverObj].spend.tips && "".concat(mergedObject[serverObj].spend.tips.length, " tips for ").concat(mergedObject[serverObj].spend.tips.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            spendFloods = mergedObject[serverObj].spend && mergedObject[serverObj].spend.floods && "".concat(mergedObject[serverObj].spend.floods.length, " floods for ").concat(mergedObject[serverObj].spend.floods.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            spendRains = mergedObject[serverObj].spend && mergedObject[serverObj].spend.rains && "".concat(mergedObject[serverObj].spend.rains.length, " rains for ").concat(mergedObject[serverObj].spend.rains.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            spendSoaks = mergedObject[serverObj].spend && mergedObject[serverObj].spend.soaks && "".concat(mergedObject[serverObj].spend.soaks.length, " soaks for ").concat(mergedObject[serverObj].spend.soaks.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            spendHurricanes = mergedObject[serverObj].spend && mergedObject[serverObj].spend.hurricanes && "".concat(mergedObject[serverObj].spend.hurricanes.length, " hurricanes for ").concat(mergedObject[serverObj].spend.hurricanes.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            spendThunders = mergedObject[serverObj].spend && mergedObject[serverObj].spend.thunders && "".concat(mergedObject[serverObj].spend.thunders.length, " thunders for ").concat(mergedObject[serverObj].spend.thunders.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            spendThunderstorms = mergedObject[serverObj].spend && mergedObject[serverObj].spend.thunderstorms && "".concat(mergedObject[serverObj].spend.thunderstorms.length, " thunderstorms for ").concat(mergedObject[serverObj].spend.thunderstorms.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            spendReactDrops = mergedObject[serverObj].spend && mergedObject[serverObj].spend.reactdrops && "".concat(mergedObject[serverObj].spend.reactdrops.length, " reactdrops for ").concat(mergedObject[serverObj].spend.reactdrops.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker); // Earned

            earnedTips = mergedObject[serverObj].earned && mergedObject[serverObj].earned.tips && "".concat(mergedObject[serverObj].earned.tips.length, " tips for ").concat(mergedObject[serverObj].earned.tips.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            earnedFloods = mergedObject[serverObj].earned && mergedObject[serverObj].earned.floods && "".concat(mergedObject[serverObj].earned.floods.length, " floods for ").concat(mergedObject[serverObj].earned.floods.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            earnedRains = mergedObject[serverObj].earned && mergedObject[serverObj].earned.rains && "".concat(mergedObject[serverObj].earned.rains.length, " rains for ").concat(mergedObject[serverObj].earned.rains.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            earnedSoaks = mergedObject[serverObj].earned && mergedObject[serverObj].earned.soaks && "".concat(mergedObject[serverObj].earned.soaks.length, " soaks for ").concat(mergedObject[serverObj].earned.soaks.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            earnedHurricanes = mergedObject[serverObj].earned && mergedObject[serverObj].earned.hurricanes && "".concat(mergedObject[serverObj].earned.hurricanes.length, " hurricanes for ").concat(mergedObject[serverObj].earned.hurricanes.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            earnedThunders = mergedObject[serverObj].earned && mergedObject[serverObj].earned.thunders && "".concat(mergedObject[serverObj].earned.thunders.length, " thunders for ").concat(mergedObject[serverObj].earned.thunders.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            earnedThunderstorms = mergedObject[serverObj].earned && mergedObject[serverObj].earned.thunderstorms && "".concat(mergedObject[serverObj].earned.thunderstorms.length, " thunderstorms for ").concat(mergedObject[serverObj].earned.thunderstorms.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            earnedReactDrops = mergedObject[serverObj].earned && mergedObject[serverObj].earned.reactdrops && "".concat(mergedObject[serverObj].earned.reactdrops.length, " reactdrops for ").concat(mergedObject[serverObj].earned.reactdrops.reduce(function (a, b) {
              return +a + +b.amount;
            }, 0) / 1e8, " ").concat(settings.coin.ticker);
            serverString = "_**".concat(serverObj, "**_\n    \n").concat(mergedObject[serverObj].spend ? '_Spend_\n' : '', "\n").concat(spendTips ? "Tips: ".concat(spendTips, "\n") : '').concat(spendRains ? "Rains: ".concat(spendRains, "\n") : '').concat(spendFloods ? "Floods: ".concat(spendFloods, "\n") : '').concat(spendSoaks ? "Soaks: ".concat(spendSoaks, "\n") : '').concat(spendHurricanes ? "Hurricanes: ".concat(spendHurricanes, "\n") : '').concat(spendThunders ? "Thunders: ".concat(spendThunders, "\n") : '').concat(spendThunderstorms ? "Thunderstorms: ".concat(spendThunderstorms, "\n") : '').concat(spendReactDrops ? "ReactDrops: ".concat(spendReactDrops, "\n") : '', "\n  \n").concat(mergedObject[serverObj].earned ? '_Earned_\n' : '', "\n").concat(earnedTips ? "Tips: ".concat(earnedTips, "\n") : '').concat(earnedRains ? "Rains: ".concat(earnedRains, "\n") : '').concat(earnedFloods ? "Floods: ".concat(earnedFloods, "\n") : '').concat(earnedSoaks ? "Soaks: ".concat(earnedSoaks, "\n") : '').concat(earnedHurricanes ? "Hurricanes: ".concat(earnedHurricanes, "\n") : '').concat(earnedThunders ? "Thunders: ".concat(earnedThunders, "\n") : '').concat(earnedThunderstorms ? "Thunderstorms: ".concat(earnedThunderstorms, "\n") : '').concat(earnedReactDrops ? "ReactDrops: ".concat(earnedReactDrops, "\n") : '');
            _context.next = 54;
            return message.author.send({
              embeds: [(0, _discord.statsMessage)(message, serverString)]
            });

          case 54:
            _context.next = 33;
            break;

          case 56:
            return _context.abrupt("return", true);

          case 57:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function discordStats(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordStats = discordStats;