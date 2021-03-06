"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordStats = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

var _sequelize = require("sequelize");

var _lodash = _interopRequireDefault(require("lodash"));

var _discord2 = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

/* eslint-disable guard-for-in */

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

function groupGlobal(arr, type, whichGroup) {
  return arr.reduce(function (res, obj) {
    var newObj = {
      amount: obj.amount
    };

    if (!res.global) {
      res.global = {};
    }

    if (!res.global["".concat(type)]) {
      res.global["".concat(type)] = {};
    }

    if (res.global["".concat(type)]["".concat(whichGroup)]) {
      res.global["".concat(type)]["".concat(whichGroup)].push(newObj);
    } else {
      res.global["".concat(type)]["".concat(whichGroup)] = [newObj];
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

    if (!res["".concat(key)]) {
      res["".concat(key)] = {};
    }

    if (!res["".concat(key)]["".concat(type)]) {
      res["".concat(key)]["".concat(type)] = {};
    }

    if (res["".concat(key)]["".concat(type)]["".concat(whichGroup)]) {
      res["".concat(key)]["".concat(type)]["".concat(whichGroup)].push(newObj);
    } else {
      res["".concat(key)]["".concat(type)]["".concat(whichGroup)] = [newObj];
    }

    return res;
  }, {});
}

var discordStats = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message, filteredMessageDiscord, io, groupTask, channelTask) {
    var activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var parentWhereOptions, childWhereOptions, childWhereOptionsTriviaTips, textTime, cutLastTimeLetter, cutNumberTime, isnum, _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, activityA, dateObj, userWithIncludes, groupedTips, groupedTipTips, groupedReactdrops, groupedFloods, groupedSoaks, groupedHurricanes, groupedThunderStorms, groupedThunders, groupedSleets, groupedReactdropTips, groupedFloodTips, groupedSoakTips, groupedHurricaneTips, groupedThunderStormTips, groupedThunderTips, groupedSleetTips, groupedTrivia, groupedTriviaTips, mergedObject, serverObj, spendTips, spendFloods, spendRains, spendSoaks, spendHurricanes, spendThunders, spendThunderstorms, spendReactDrops, spendTrivias, spendTotal, earnedTips, earnedFloods, earnedRains, earnedSoaks, earnedHurricanes, earnedThunders, earnedThunderstorms, earnedReactDrops, earnedTrivias, earnedTotal, serverString, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        parentWhereOptions = {};
                        childWhereOptions = {};
                        childWhereOptionsTriviaTips = {};
                        _context.next = 5;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessageDiscord[1].toLowerCase());

                      case 5:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 12;
                          break;
                        }

                        return _context.abrupt("return");

                      case 12:
                        if (filteredMessageDiscord[2]) {
                          // eslint-disable-next-line prefer-destructuring
                          textTime = filteredMessageDiscord[2];
                          cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                          cutNumberTime = textTime.substring(0, textTime.length - 1);
                          isnum = /^\d+$/.test(cutNumberTime);
                        }

                        if (!(filteredMessageDiscord[2] && !isnum // && Number(cutNumberTime) < 0
                        && (cutLastTimeLetter !== 'd' || cutLastTimeLetter !== 'h' || cutLastTimeLetter !== 'm' || cutLastTimeLetter !== 's'))) {
                          _context.next = 22;
                          break;
                        }

                        console.log('not pass');
                        _context.next = 17;
                        return _models["default"].activity.create({
                          type: 'stats_i',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 17:
                        activityA = _context.sent;
                        activity.unshift(activityA);
                        _context.next = 21;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidTimeMessage)(message, 'Stats')]
                        });

                      case 21:
                        return _context.abrupt("return");

                      case 22:
                        if (!(filteredMessageDiscord[2] && isnum // && Number(cutNumberTime) < 0
                        && (cutLastTimeLetter === 'd' || cutLastTimeLetter === 'h' || cutLastTimeLetter === 'm' || cutLastTimeLetter === 's'))) {
                          _context.next = 35;
                          break;
                        }

                        _context.next = 25;
                        return new Date().getTime();

                      case 25:
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

                        _context.next = 32;
                        return new Date(dateObj);

                      case 32:
                        dateObj = _context.sent;
                        childWhereOptions.createdAt = (0, _defineProperty2["default"])({}, _sequelize.Op.gte, dateObj); // childWhereOptionsTrivia.createdAt = { [Op.gte]: dateObj };

                        childWhereOptionsTriviaTips.createdAt = (0, _defineProperty2["default"])({}, _sequelize.Op.gte, dateObj);

                      case 35:
                        childWhereOptionsTriviaTips.amount = (0, _defineProperty2["default"])({}, _sequelize.Op.ne, null);
                        parentWhereOptions.id = user.id;

                        if (!(message.channel.type === _discord.ChannelType.GuildText)) {
                          _context.next = 42;
                          break;
                        }

                        childWhereOptions.groupId = groupTask.id;
                        childWhereOptionsTriviaTips.groupId = groupTask.id;
                        _context.next = 42;
                        return message.channel.send({
                          embeds: [(0, _discord2.warnDirectMessage)(message.author.id, 'Statistics')]
                        });

                      case 42:
                        _context.next = 44;
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
                            model: _models["default"].trivia,
                            as: 'trivias',
                            required: false,
                            separate: true,
                            where: childWhereOptions,
                            include: [{
                              model: _models["default"].group,
                              as: 'group',
                              required: false
                            }, {
                              model: _models["default"].triviatip,
                              as: 'triviatips',
                              where: {
                                amount: (0, _defineProperty2["default"])({}, _sequelize.Op.ne, null)
                              }
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
                            model: _models["default"].triviatip,
                            as: 'triviatips',
                            required: false,
                            separate: true,
                            where: childWhereOptionsTriviaTips,
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
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 44:
                        userWithIncludes = _context.sent;
                        console.log(userWithIncludes.triviatips);

                        if (message.channel.type === _discord.ChannelType.DM) {
                          // spend
                          groupedTips = userWithIncludes.tips ? groupGlobal(userWithIncludes.tips, 'spend', 'tips') : {};
                          groupedReactdrops = userWithIncludes.reactdrops ? groupGlobal(userWithIncludes.reactdrops, 'spend', 'reactdrops') : {};
                          groupedFloods = userWithIncludes.floods ? groupGlobal(userWithIncludes.floods, 'spend', 'floods') : {};
                          groupedSoaks = userWithIncludes.soaks ? groupGlobal(userWithIncludes.soaks, 'spend', 'soaks') : {};
                          groupedHurricanes = userWithIncludes.hurricanes ? groupGlobal(userWithIncludes.hurricanes, 'spend', 'hurricanes') : {};
                          groupedThunderStorms = userWithIncludes.thunderstorms ? groupGlobal(userWithIncludes.thunderstorms, 'spend', 'thunderstorms') : {};
                          groupedThunders = userWithIncludes.thunders ? groupGlobal(userWithIncludes.thunders, 'spend', 'thunders') : {};
                          groupedSleets = userWithIncludes.sleets ? groupGlobal(userWithIncludes.sleets, 'spend', 'sleets') : {};
                          groupedTrivia = userWithIncludes.trivias ? groupGlobal(userWithIncludes.trivias, 'spend', 'trivias') : {}; // earned

                          groupedTipTips = userWithIncludes.tiptips ? groupGlobal(userWithIncludes.tiptips, 'earned', 'tips') : {};
                          groupedReactdropTips = userWithIncludes.reactdroptips ? groupGlobal(userWithIncludes.reactdroptips, 'earned', 'reactdrops') : {};
                          groupedFloodTips = userWithIncludes.floodtips ? groupGlobal(userWithIncludes.floodtips, 'earned', 'floods') : {};
                          groupedSoakTips = userWithIncludes.soaktips ? groupGlobal(userWithIncludes.soaktips, 'earned', 'soaks') : {};
                          groupedHurricaneTips = userWithIncludes.hurricanetips ? groupGlobal(userWithIncludes.hurricanetips, 'earned', 'hurricanes') : {};
                          groupedThunderStormTips = userWithIncludes.thunderstormtips ? groupGlobal(userWithIncludes.thunderstormtips, 'earned', 'thunderstorms') : {};
                          groupedThunderTips = userWithIncludes.thundertips ? groupGlobal(userWithIncludes.thundertips, 'earned', 'thunders') : {};
                          groupedSleetTips = userWithIncludes.sleettips ? groupGlobal(userWithIncludes.sleettips, 'earned', 'sleets') : {};
                          groupedTriviaTips = userWithIncludes.triviatips ? groupGlobal(userWithIncludes.triviatips, 'earned', 'trivias') : {};
                        }

                        if (message.channel.type === _discord.ChannelType.GuildText) {
                          // spend
                          groupedTips = userWithIncludes.tips ? group(userWithIncludes.tips, 'spend', 'tips') : {};
                          groupedReactdrops = userWithIncludes.reactdrops ? group(userWithIncludes.reactdrops, 'spend', 'reactdrops') : {};
                          groupedFloods = userWithIncludes.floods ? group(userWithIncludes.floods, 'spend', 'floods') : {};
                          groupedSoaks = userWithIncludes.soaks ? group(userWithIncludes.soaks, 'spend', 'soaks') : {};
                          groupedHurricanes = userWithIncludes.hurricanes ? group(userWithIncludes.hurricanes, 'spend', 'hurricanes') : {};
                          groupedThunderStorms = userWithIncludes.thunderstorms ? group(userWithIncludes.thunderstorms, 'spend', 'thunderstorms') : {};
                          groupedThunders = userWithIncludes.thunders ? group(userWithIncludes.thunders, 'spend', 'thunders') : {};
                          groupedSleets = userWithIncludes.sleets ? group(userWithIncludes.sleets, 'spend', 'sleets') : {};
                          groupedTrivia = userWithIncludes.trivias ? group(userWithIncludes.trivias, 'spend', 'trivias') : {}; // earned

                          groupedTipTips = userWithIncludes.tiptips ? group(userWithIncludes.tiptips, 'earned', 'tips') : {};
                          groupedReactdropTips = userWithIncludes.reactdroptips ? group(userWithIncludes.reactdroptips, 'earned', 'reactdrops') : {};
                          groupedFloodTips = userWithIncludes.floodtips ? group(userWithIncludes.floodtips, 'earned', 'floods') : {};
                          groupedSoakTips = userWithIncludes.soaktips ? group(userWithIncludes.soaktips, 'earned', 'soaks') : {};
                          groupedHurricaneTips = userWithIncludes.hurricanetips ? group(userWithIncludes.hurricanetips, 'earned', 'hurricanes') : {};
                          groupedThunderStormTips = userWithIncludes.thunderstormtips ? group(userWithIncludes.thunderstormtips, 'earned', 'thunderstorms') : {};
                          groupedThunderTips = userWithIncludes.thundertips ? group(userWithIncludes.thundertips, 'earned', 'thunders') : {};
                          groupedSleetTips = userWithIncludes.sleettips ? group(userWithIncludes.sleettips, 'earned', 'sleets') : {};
                          groupedTriviaTips = userWithIncludes.triviatips ? group(userWithIncludes.triviatips, 'earned', 'trivias') : {};
                        } // merge results into a single object


                        mergedObject = _lodash["default"].merge( // Spend
                        groupedTips, groupedReactdrops, groupedFloods, groupedSoaks, groupedHurricanes, groupedThunderStorms, groupedThunders, groupedSleets, groupedTrivia, // Earned
                        groupedTipTips, groupedReactdropTips, groupedFloodTips, groupedSoakTips, groupedHurricaneTips, groupedThunderStormTips, groupedThunderTips, groupedSleetTips, groupedTriviaTips);

                        if (!_lodash["default"].isEmpty(mergedObject)) {
                          _context.next = 53;
                          break;
                        }

                        _context.next = 52;
                        return message.author.send({
                          embeds: [(0, _discord2.statsMessage)(message, "No data found!")]
                        });

                      case 52:
                        return _context.abrupt("return");

                      case 53:
                        _context.t0 = _regenerator["default"].keys(mergedObject);

                      case 54:
                        if ((_context.t1 = _context.t0()).done) {
                          _context.next = 83;
                          break;
                        }

                        serverObj = _context.t1.value;
                        console.log(serverObj);
                        console.log('serverObj'); // Spend

                        spendTips = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.tips && "".concat(mergedObject["".concat(serverObj)].spend.tips.length, " tips for ").concat(mergedObject["".concat(serverObj)].spend.tips.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendFloods = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.floods && "".concat(mergedObject["".concat(serverObj)].spend.floods.length, " floods for ").concat(mergedObject["".concat(serverObj)].spend.floods.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendRains = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.rains && "".concat(mergedObject["".concat(serverObj)].spend.rains.length, " rains for ").concat(mergedObject["".concat(serverObj)].spend.rains.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendSoaks = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.soaks && "".concat(mergedObject["".concat(serverObj)].spend.soaks.length, " soaks for ").concat(mergedObject["".concat(serverObj)].spend.soaks.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendHurricanes = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.hurricanes && "".concat(mergedObject["".concat(serverObj)].spend.hurricanes.length, " hurricanes for ").concat(mergedObject["".concat(serverObj)].spend.hurricanes.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendThunders = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.thunders && "".concat(mergedObject["".concat(serverObj)].spend.thunders.length, " thunders for ").concat(mergedObject["".concat(serverObj)].spend.thunders.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendThunderstorms = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.thunderstorms && "".concat(mergedObject["".concat(serverObj)].spend.thunderstorms.length, " thunderstorms for ").concat(mergedObject["".concat(serverObj)].spend.thunderstorms.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendReactDrops = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.reactdrops && "".concat(mergedObject["".concat(serverObj)].spend.reactdrops.length, " reactdrops for ").concat(mergedObject["".concat(serverObj)].spend.reactdrops.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendTrivias = mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.trivias && "".concat(mergedObject["".concat(serverObj)].spend.trivias.length, " Trivia for ").concat(mergedObject["".concat(serverObj)].spend.trivias.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        spendTotal = (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.tips ? mergedObject["".concat(serverObj)].spend.tips.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.floods ? mergedObject["".concat(serverObj)].spend.floods.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.rains ? mergedObject["".concat(serverObj)].spend.rains.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.soaks ? mergedObject["".concat(serverObj)].spend.soaks.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.hurricanes ? mergedObject["".concat(serverObj)].spend.hurricanes.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.thunders ? mergedObject["".concat(serverObj)].spend.thunders.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.thunderstorms ? mergedObject["".concat(serverObj)].spend.thunderstorms.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].spend && mergedObject["".concat(serverObj)].spend.reactdrops ? mergedObject["".concat(serverObj)].spend.reactdrops.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0); // Earned

                        earnedTips = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.tips && "".concat(mergedObject["".concat(serverObj)].earned.tips.length, " tips for ").concat(mergedObject["".concat(serverObj)].earned.tips.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedFloods = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.floods && "".concat(mergedObject["".concat(serverObj)].earned.floods.length, " floods for ").concat(mergedObject["".concat(serverObj)].earned.floods.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedRains = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.rains && "".concat(mergedObject["".concat(serverObj)].earned.rains.length, " rains for ").concat(mergedObject["".concat(serverObj)].earned.rains.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedSoaks = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.soaks && "".concat(mergedObject["".concat(serverObj)].earned.soaks.length, " soaks for ").concat(mergedObject["".concat(serverObj)].earned.soaks.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedHurricanes = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.hurricanes && "".concat(mergedObject["".concat(serverObj)].earned.hurricanes.length, " hurricanes for ").concat(mergedObject["".concat(serverObj)].earned.hurricanes.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedThunders = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.thunders && "".concat(mergedObject["".concat(serverObj)].earned.thunders.length, " thunders for ").concat(mergedObject["".concat(serverObj)].earned.thunders.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedThunderstorms = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.thunderstorms && "".concat(mergedObject["".concat(serverObj)].earned.thunderstorms.length, " thunderstorms for ").concat(mergedObject["".concat(serverObj)].earned.thunderstorms.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedReactDrops = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.reactdrops && "".concat(mergedObject["".concat(serverObj)].earned.reactdrops.length, " reactdrops for ").concat(mergedObject["".concat(serverObj)].earned.reactdrops.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedTrivias = mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.trivias && "".concat(mergedObject["".concat(serverObj)].earned.trivias.length, " trivia for ").concat(mergedObject["".concat(serverObj)].earned.trivias.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8, " ").concat(settings.coin.ticker);
                        earnedTotal = (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.tips ? mergedObject["".concat(serverObj)].earned.tips.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.floods ? mergedObject["".concat(serverObj)].earned.floods.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.rains ? mergedObject["".concat(serverObj)].earned.rains.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.soaks ? mergedObject["".concat(serverObj)].earned.soaks.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.hurricanes ? mergedObject["".concat(serverObj)].earned.hurricanes.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.thunders ? mergedObject["".concat(serverObj)].earned.thunders.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.thunderstorms ? mergedObject["".concat(serverObj)].earned.thunderstorms.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0) + (mergedObject["".concat(serverObj)].earned && mergedObject["".concat(serverObj)].earned.reactdrops ? mergedObject["".concat(serverObj)].earned.reactdrops.reduce(function (a, b) {
                          return +a + +b.amount;
                        }, 0) / 1e8 : 0);
                        serverString = "_**".concat(serverObj, "**_\n\n").concat(mergedObject["".concat(serverObj)].spend ? '_Spend_\n' : '', "\n").concat(spendTips ? "Tips: ".concat(spendTips, "\n") : '').concat(spendRains ? "Rains: ".concat(spendRains, "\n") : '').concat(spendFloods ? "Floods: ".concat(spendFloods, "\n") : '').concat(spendSoaks ? "Soaks: ".concat(spendSoaks, "\n") : '').concat(spendHurricanes ? "Hurricanes: ".concat(spendHurricanes, "\n") : '').concat(spendThunders ? "Thunders: ".concat(spendThunders, "\n") : '').concat(spendThunderstorms ? "Thunderstorms: ".concat(spendThunderstorms, "\n") : '').concat(spendReactDrops ? "ReactDrops: ".concat(spendReactDrops, "\n") : '').concat(spendTrivias ? "Trivia: ".concat(spendTrivias, "\n") : '').concat(spendTotal ? "Total Spend: ".concat(spendTotal, " ").concat(settings.coin.ticker, "\n") : '', "\n\n").concat(mergedObject["".concat(serverObj)].earned ? '_Earned_\n' : '', "\n").concat(earnedTips ? "Tips: ".concat(earnedTips, "\n") : '').concat(earnedRains ? "Rains: ".concat(earnedRains, "\n") : '').concat(earnedFloods ? "Floods: ".concat(earnedFloods, "\n") : '').concat(earnedSoaks ? "Soaks: ".concat(earnedSoaks, "\n") : '').concat(earnedHurricanes ? "Hurricanes: ".concat(earnedHurricanes, "\n") : '').concat(earnedThunders ? "Thunders: ".concat(earnedThunders, "\n") : '').concat(earnedThunderstorms ? "Thunderstorms: ".concat(earnedThunderstorms, "\n") : '').concat(earnedReactDrops ? "ReactDrops: ".concat(earnedReactDrops, "\n") : '').concat(earnedTrivias ? "Trivia: ".concat(earnedTrivias, "\n") : '').concat(earnedTotal ? "Total Earned: ".concat(earnedTotal, " ").concat(settings.coin.ticker, "\n") : ''); // eslint-disable-next-line no-await-in-loop

                        _context.next = 81;
                        return message.author.send({
                          embeds: [(0, _discord2.statsMessage)(message, serverString)]
                        });

                      case 81:
                        _context.next = 54;
                        break;

                      case 83:
                        _context.next = 85;
                        return _models["default"].activity.create({
                          type: 'stats_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 85:
                        preActivity = _context.sent;
                        _context.next = 88;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 88:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 90:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x6) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _models["default"].error.create({
                          type: 'stats',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 8:
                        _logger["default"].error("Error Stats Requested by: ".concat(err));

                        _context2.next = 11;
                        return message.channel.send({
                          embeds: [(0, _discord2.discordErrorMessage)("Stats")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x7) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function discordStats(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordStats = discordStats;