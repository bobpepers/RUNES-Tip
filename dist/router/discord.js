"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../models"));

var _balance = require("../controllers/discord/balance");

var _deposit = require("../controllers/discord/deposit");

var _withdraw = require("../controllers/discord/withdraw");

var _voicerain = require("../controllers/discord/voicerain");

var _rain = require("../controllers/discord/rain");

var _sleet = require("../controllers/discord/sleet");

var _flood = require("../controllers/discord/flood");

var _fees = require("../controllers/discord/fees");

var _channel = require("../controllers/discord/channel");

var _group = require("../controllers/discord/group");

var _info = require("../controllers/discord/info");

var _soak = require("../controllers/discord/soak");

var _thunder = require("../controllers/discord/thunder");

var _thunderstorm = require("../controllers/discord/thunderstorm");

var _hurricane = require("../controllers/discord/hurricane");

var _faucet = require("../controllers/discord/faucet");

var _ignore = require("../controllers/discord/ignore");

var _help = require("../controllers/discord/help");

var _price = require("../controllers/discord/price");

var _listTransactions = require("../controllers/discord/listTransactions");

var _trivia = require("../controllers/discord/trivia");

var _reactdrop = require("../controllers/discord/reactdrop");

var _stats = require("../controllers/discord/stats");

var _publicstats = require("../controllers/discord/publicstats");

var _halving = require("../controllers/discord/halving");

var _mining = require("../controllers/discord/mining");

var _tip = require("../controllers/discord/tip");

var _user = require("../controllers/discord/user");

var _rateLimit = require("../helpers/rateLimit");

var _disallowDirectMessage = require("../helpers/client/discord/disallowDirectMessage");

var _executeTips = require("../helpers/client/discord/executeTips");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _settings = require("../controllers/discord/settings");

var _settings2 = require("../controllers/settings");

var _discord = require("../messages/discord");

// import { discordLeaderboard } from '../controllers/discord/leaderboard';
// import getCoinSettings from '../config/settings';
// const settings = getCoinSettings();
(0, _dotenv.config)();

var discordRouter = function discordRouter(discordClient, queue, io, settings) {
  var counter = 0;
  var interval = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var priceInfo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(counter % 2 === 0)) {
              _context.next = 8;
              break;
            }

            _context.next = 4;
            return _models["default"].currency.findOne({
              where: {
                iso: 'USD'
              }
            });

          case 4:
            priceInfo = _context.sent;
            discordClient.user.setPresence({
              activities: [{
                name: "$".concat(priceInfo.price, "/").concat(settings.coin.ticker),
                type: "WATCHING"
              }]
            });
            _context.next = 9;
            break;

          case 8:
            discordClient.user.setPresence({
              activities: [{
                name: "".concat(settings.bot.command.discord),
                type: "PLAYING"
              }]
            });

          case 9:
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 14:
            counter += 1;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  })), 40000);
  discordClient.on("presenceUpdate", function (oldMember, newMember) {// const { username } = newMember.user;
    // console.log('presenceUpdate');
  });
  discordClient.on('voiceStateUpdate', /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(oldMember, newMember) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                var groupTask, channelTask;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _group.updateDiscordGroup)(discordClient, newMember);

                      case 2:
                        groupTask = _context2.sent;
                        _context2.next = 5;
                        return (0, _channel.updateDiscordChannel)(newMember, groupTask);

                      case 5:
                        channelTask = _context2.sent;

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  discordClient.on("interactionCreate", /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(interaction) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, maintenance, walletExists, limited, setting;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (interaction.isButton()) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt("return");

            case 2:
              if (interaction.user.bot) {
                _context6.next = 29;
                break;
              }

              _context6.next = 5;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(interaction, 'discord');

            case 5:
              maintenance = _context6.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context6.next = 8;
                break;
              }

              return _context6.abrupt("return");

            case 8:
              _context6.next = 10;
              return (0, _user.createUpdateDiscordUser)(discordClient, interaction.user, queue);

            case 10:
              walletExists = _context6.sent;
              _context6.next = 13;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return (0, _group.updateDiscordGroup)(discordClient, interaction);

                      case 2:
                        groupTask = _context4.sent;
                        _context4.next = 5;
                        return (0, _channel.updateDiscordChannel)(interaction, groupTask);

                      case 5:
                        channelTask = _context4.sent;
                        _context4.next = 8;
                        return (0, _user.updateDiscordLastSeen)(interaction, interaction.user);

                      case 8:
                        lastSeenDiscordTask = _context4.sent;
                        groupTaskId = groupTask && groupTask.id;
                        channelTaskId = channelTask && channelTask.id;

                      case 11:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })));

            case 13:
              if (!interaction.isButton()) {
                _context6.next = 29;
                break;
              }

              if (!(interaction.customId === 'claimFaucet')) {
                _context6.next = 29;
                break;
              }

              _context6.next = 17;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'discord', 'Faucet');

            case 17:
              limited = _context6.sent;

              if (!limited) {
                _context6.next = 20;
                break;
              }

              return _context6.abrupt("return");

            case 20:
              _context6.next = 22;
              return (0, _settings.discordFeatureSettings)(interaction, 'faucet', groupTaskId, channelTaskId);

            case 22:
              setting = _context6.sent;

              if (setting) {
                _context6.next = 25;
                break;
              }

              return _context6.abrupt("return");

            case 25:
              _context6.next = 27;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                var task;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _faucet.discordFaucetClaim)(interaction, io);

                      case 2:
                        task = _context5.sent;

                      case 3:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })));

            case 27:
              _context6.next = 29;
              return interaction.deferUpdate()["catch"](function (e) {
                console.log(e);
              });

            case 29:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, disallow, walletExists, maintenance, faucetSetting, messageReplaceBreaksWithSpaces, preFilteredMessageDiscord, filteredMessageDiscord, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, _limited8, _limited9, _limited10, _limited11, _limited12, _limited13, setting, _limited14, _limited15, _setting, _limited16, _setting2, AmountPosition, AmountPositionEnded, _limited17, _setting3, _limited18, _setting4, _limited19, _setting5, _limited20, _setting6, _limited21, _setting7, _limited22, _setting8, _limited23, _setting9, _limited24, _setting10, _limited25, _setting11, _limited26, _setting12;

      return _regenerator["default"].wrap(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              if (message.author.bot) {
                _context34.next = 8;
                break;
              }

              _context34.next = 3;
              return (0, _user.createUpdateDiscordUser)(discordClient, message.author, queue);

            case 3:
              walletExists = _context34.sent;
              _context34.next = 6;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return (0, _group.updateDiscordGroup)(discordClient, message);

                      case 2:
                        groupTask = _context7.sent;
                        _context7.next = 5;
                        return (0, _channel.updateDiscordChannel)(message, groupTask);

                      case 5:
                        channelTask = _context7.sent;
                        _context7.next = 8;
                        return (0, _user.updateDiscordLastSeen)(message, message.author);

                      case 8:
                        lastSeenDiscordTask = _context7.sent;

                      case 9:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })));

            case 6:
              groupTaskId = groupTask && groupTask.id;
              channelTaskId = channelTask && channelTask.id;

            case 8:
              if (!(!message.content.startsWith(settings.bot.command.discord) || message.author.bot)) {
                _context34.next = 10;
                break;
              }

              return _context34.abrupt("return");

            case 10:
              _context34.next = 12;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 12:
              maintenance = _context34.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context34.next = 15;
                break;
              }

              return _context34.abrupt("return");

            case 15:
              if (!(groupTask && groupTask.banned)) {
                _context34.next = 19;
                break;
              }

              _context34.next = 18;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 18:
              return _context34.abrupt("return");

            case 19:
              if (!(channelTask && channelTask.banned)) {
                _context34.next = 23;
                break;
              }

              _context34.next = 22;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 22:
              return _context34.abrupt("return");

            case 23:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context34.next = 27;
                break;
              }

              _context34.next = 26;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 26:
              return _context34.abrupt("return");

            case 27:
              _context34.next = 29;
              return (0, _settings2.waterFaucetSettings)(groupTaskId, channelTaskId);

            case 29:
              faucetSetting = _context34.sent;

              if (faucetSetting) {
                _context34.next = 32;
                break;
              }

              return _context34.abrupt("return");

            case 32:
              messageReplaceBreaksWithSpaces = message.content.replace(/\n/g, " ");
              preFilteredMessageDiscord = messageReplaceBreaksWithSpaces.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context34.next = 43;
                break;
              }

              _context34.next = 38;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Help');

            case 38:
              limited = _context34.sent;

              if (!limited) {
                _context34.next = 41;
                break;
              }

              return _context34.abrupt("return");

            case 41:
              _context34.next = 43;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                var task;
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context8.sent;

                      case 3:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })));

            case 43:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context34.next = 51;
                break;
              }

              _context34.next = 46;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Help');

            case 46:
              _limited = _context34.sent;

              if (!_limited) {
                _context34.next = 49;
                break;
              }

              return _context34.abrupt("return");

            case 49:
              _context34.next = 51;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                var task;
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context9.sent;

                      case 3:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })));

            case 51:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'fees')) {
                _context34.next = 59;
                break;
              }

              _context34.next = 54;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Fees');

            case 54:
              _limited2 = _context34.sent;

              if (!_limited2) {
                _context34.next = 57;
                break;
              }

              return _context34.abrupt("return");

            case 57:
              _context34.next = 59;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                var task;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return (0, _fees.fetchFeeSchedule)(message, io, groupTaskId, channelTaskId);

                      case 2:
                        task = _context10.sent;

                      case 3:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              })));

            case 59:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'stats')) {
                _context34.next = 67;
                break;
              }

              _context34.next = 62;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Stats');

            case 62:
              _limited3 = _context34.sent;

              if (!_limited3) {
                _context34.next = 65;
                break;
              }

              return _context34.abrupt("return");

            case 65:
              _context34.next = 67;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
                var task;
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return (0, _stats.discordStats)(message, filteredMessageDiscord, io, groupTask, channelTask);

                      case 2:
                        task = _context11.sent;

                      case 3:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              })));

            case 67:
              if (!settings.coin.halving.enabled) {
                _context34.next = 76;
                break;
              }

              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'halving')) {
                _context34.next = 76;
                break;
              }

              _context34.next = 71;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Halving');

            case 71:
              _limited4 = _context34.sent;

              if (!_limited4) {
                _context34.next = 74;
                break;
              }

              return _context34.abrupt("return");

            case 74:
              _context34.next = 76;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                var task;
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return (0, _halving.discordHalving)(message, settings.coin.halving, io);

                      case 2:
                        task = _context12.sent;

                      case 3:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              })));

            case 76:
              if (!(settings.coin.name === 'Pirate')) {
                _context34.next = 85;
                break;
              }

              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'mining')) {
                _context34.next = 85;
                break;
              }

              _context34.next = 80;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Mining');

            case 80:
              _limited5 = _context34.sent;

              if (!_limited5) {
                _context34.next = 83;
                break;
              }

              return _context34.abrupt("return");

            case 83:
              _context34.next = 85;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                var task;
                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return (0, _mining.discordMining)(message, settings.coin.halving, io);

                      case 2:
                        task = _context13.sent;

                      case 3:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })));

            case 85:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context34.next = 93;
                break;
              }

              _context34.next = 88;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Leaderboard');

            case 88:
              _limited6 = _context34.sent;

              if (!_limited6) {
                _context34.next = 91;
                break;
              }

              return _context34.abrupt("return");

            case 91:
              _context34.next = 93;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        console.log('unavailable'); // const task = await discordLeaderboard(message, io);

                      case 1:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })));

            case 93:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context34.next = 101;
                break;
              }

              _context34.next = 96;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'PublicStats');

            case 96:
              _limited7 = _context34.sent;

              if (!_limited7) {
                _context34.next = 99;
                break;
              }

              return _context34.abrupt("return");

            case 99:
              _context34.next = 101;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
                var task;
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return (0, _publicstats.discordPublicStats)(message, io);

                      case 2:
                        task = _context15.sent;

                      case 3:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              })));

            case 101:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context34.next = 109;
                break;
              }

              _context34.next = 104;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Info');

            case 104:
              _limited8 = _context34.sent;

              if (!_limited8) {
                _context34.next = 107;
                break;
              }

              return _context34.abrupt("return");

            case 107:
              _context34.next = 109;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
                var task;
                return _regenerator["default"].wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return (0, _info.discordCoinInfo)(message, io);

                      case 2:
                        task = _context16.sent;

                      case 3:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
              })));

            case 109:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context34.next = 117;
                break;
              }

              _context34.next = 112;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'IgnoreMe');

            case 112:
              _limited9 = _context34.sent;

              if (!_limited9) {
                _context34.next = 115;
                break;
              }

              return _context34.abrupt("return");

            case 115:
              _context34.next = 117;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
                var task;
                return _regenerator["default"].wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        _context17.next = 2;
                        return (0, _ignore.setIgnoreMe)(message, io);

                      case 2:
                        task = _context17.sent;

                      case 3:
                      case "end":
                        return _context17.stop();
                    }
                  }
                }, _callee17);
              })));

            case 117:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context34.next = 125;
                break;
              }

              _context34.next = 120;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Balance');

            case 120:
              _limited10 = _context34.sent;

              if (!_limited10) {
                _context34.next = 123;
                break;
              }

              return _context34.abrupt("return");

            case 123:
              _context34.next = 125;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
                var task;
                return _regenerator["default"].wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return (0, _balance.fetchDiscordWalletBalance)(message, io);

                      case 2:
                        task = _context18.sent;

                      case 3:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18);
              })));

            case 125:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'listtransactions')) {
                _context34.next = 133;
                break;
              }

              _context34.next = 128;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ListTransactions');

            case 128:
              _limited11 = _context34.sent;

              if (!_limited11) {
                _context34.next = 131;
                break;
              }

              return _context34.abrupt("return");

            case 131:
              _context34.next = 133;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
                var task;
                return _regenerator["default"].wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        _context19.next = 2;
                        return (0, _listTransactions.fetchDiscordListTransactions)(message, io);

                      case 2:
                        task = _context19.sent;

                      case 3:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19);
              })));

            case 133:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'price')) {
                _context34.next = 141;
                break;
              }

              _context34.next = 136;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Price');

            case 136:
              _limited12 = _context34.sent;

              if (!_limited12) {
                _context34.next = 139;
                break;
              }

              return _context34.abrupt("return");

            case 139:
              _context34.next = 141;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
                var task;
                return _regenerator["default"].wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _context20.next = 2;
                        return (0, _price.discordPrice)(message, io);

                      case 2:
                        task = _context20.sent;

                      case 3:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20);
              })));

            case 141:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context34.next = 154;
                break;
              }

              _context34.next = 144;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Faucet');

            case 144:
              _limited13 = _context34.sent;

              if (!_limited13) {
                _context34.next = 147;
                break;
              }

              return _context34.abrupt("return");

            case 147:
              _context34.next = 149;
              return (0, _settings.discordFeatureSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 149:
              setting = _context34.sent;

              if (setting) {
                _context34.next = 152;
                break;
              }

              return _context34.abrupt("return");

            case 152:
              _context34.next = 154;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
                var task;
                return _regenerator["default"].wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.next = 2;
                        return (0, _faucet.discordFaucetClaim)(message, io);

                      case 2:
                        task = _context21.sent;

                      case 3:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21);
              })));

            case 154:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context34.next = 162;
                break;
              }

              _context34.next = 157;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Deposit');

            case 157:
              _limited14 = _context34.sent;

              if (!_limited14) {
                _context34.next = 160;
                break;
              }

              return _context34.abrupt("return");

            case 160:
              _context34.next = 162;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
                var task;
                return _regenerator["default"].wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        _context22.next = 2;
                        return (0, _deposit.fetchDiscordWalletDepositAddress)(message, io);

                      case 2:
                        task = _context22.sent;

                      case 3:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22);
              })));

            case 162:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context34.next = 175;
                break;
              }

              _context34.next = 165;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Withdraw');

            case 165:
              _limited15 = _context34.sent;

              if (!_limited15) {
                _context34.next = 168;
                break;
              }

              return _context34.abrupt("return");

            case 168:
              _context34.next = 170;
              return (0, _settings.discordFeatureSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 170:
              _setting = _context34.sent;

              if (_setting) {
                _context34.next = 173;
                break;
              }

              return _context34.abrupt("return");

            case 173:
              _context34.next = 175;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting, faucetSetting);

            case 175:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1] && filteredMessageDiscord[1].startsWith('<@'))) {
                _context34.next = 200;
                break;
              }

              _context34.next = 178;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Tip');

            case 178:
              _limited16 = _context34.sent;

              if (!_limited16) {
                _context34.next = 181;
                break;
              }

              return _context34.abrupt("return");

            case 181:
              _context34.next = 183;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
                return _regenerator["default"].wrap(function _callee23$(_context23) {
                  while (1) {
                    switch (_context23.prev = _context23.next) {
                      case 0:
                        _context23.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'tip', io);

                      case 2:
                        disallow = _context23.sent;

                      case 3:
                      case "end":
                        return _context23.stop();
                    }
                  }
                }, _callee23);
              })));

            case 183:
              if (!disallow) {
                _context34.next = 185;
                break;
              }

              return _context34.abrupt("return");

            case 185:
              _context34.next = 187;
              return (0, _settings.discordFeatureSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 187:
              _setting2 = _context34.sent;

              if (_setting2) {
                _context34.next = 190;
                break;
              }

              return _context34.abrupt("return");

            case 190:
              if (!(filteredMessageDiscord[1].substr(2).slice(0, -1) === discordClient.user.id)) {
                _context34.next = 195;
                break;
              }

              _context34.next = 193;
              return (0, _executeTips.executeTipFunction)(_tip.tipCoinsToDiscordFaucet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 193:
              _context34.next = 200;
              break;

            case 195:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[parseInt(AmountPosition, 10)] || !filteredMessageDiscord[parseInt(AmountPosition, 10)].startsWith('<@')) {
                  AmountPositionEnded = true;
                }
              }

              _context34.next = 200;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[parseInt(AmountPosition, 10)], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 200:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context34.next = 217;
                break;
              }

              _context34.next = 203;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'VoiceRain');

            case 203:
              _limited17 = _context34.sent;

              if (!_limited17) {
                _context34.next = 206;
                break;
              }

              return _context34.abrupt("return");

            case 206:
              _context34.next = 208;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24() {
                return _regenerator["default"].wrap(function _callee24$(_context24) {
                  while (1) {
                    switch (_context24.prev = _context24.next) {
                      case 0:
                        _context24.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'voicerain', io);

                      case 2:
                        disallow = _context24.sent;

                      case 3:
                      case "end":
                        return _context24.stop();
                    }
                  }
                }, _callee24);
              })));

            case 208:
              if (!disallow) {
                _context34.next = 210;
                break;
              }

              return _context34.abrupt("return");

            case 210:
              _context34.next = 212;
              return (0, _settings.discordFeatureSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 212:
              _setting3 = _context34.sent;

              if (_setting3) {
                _context34.next = 215;
                break;
              }

              return _context34.abrupt("return");

            case 215:
              _context34.next = 217;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3, faucetSetting);

            case 217:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context34.next = 234;
                break;
              }

              _context34.next = 220;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Rain');

            case 220:
              _limited18 = _context34.sent;

              if (!_limited18) {
                _context34.next = 223;
                break;
              }

              return _context34.abrupt("return");

            case 223:
              _context34.next = 225;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
                return _regenerator["default"].wrap(function _callee25$(_context25) {
                  while (1) {
                    switch (_context25.prev = _context25.next) {
                      case 0:
                        _context25.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'rain', io);

                      case 2:
                        disallow = _context25.sent;

                      case 3:
                      case "end":
                        return _context25.stop();
                    }
                  }
                }, _callee25);
              })));

            case 225:
              if (!disallow) {
                _context34.next = 227;
                break;
              }

              return _context34.abrupt("return");

            case 227:
              _context34.next = 229;
              return (0, _settings.discordFeatureSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 229:
              _setting4 = _context34.sent;

              if (_setting4) {
                _context34.next = 232;
                break;
              }

              return _context34.abrupt("return");

            case 232:
              _context34.next = 234;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4, faucetSetting);

            case 234:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context34.next = 251;
                break;
              }

              _context34.next = 237;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Flood');

            case 237:
              _limited19 = _context34.sent;

              if (!_limited19) {
                _context34.next = 240;
                break;
              }

              return _context34.abrupt("return");

            case 240:
              _context34.next = 242;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26() {
                return _regenerator["default"].wrap(function _callee26$(_context26) {
                  while (1) {
                    switch (_context26.prev = _context26.next) {
                      case 0:
                        _context26.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'flood', io);

                      case 2:
                        disallow = _context26.sent;

                      case 3:
                      case "end":
                        return _context26.stop();
                    }
                  }
                }, _callee26);
              })));

            case 242:
              if (!disallow) {
                _context34.next = 244;
                break;
              }

              return _context34.abrupt("return");

            case 244:
              _context34.next = 246;
              return (0, _settings.discordFeatureSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 246:
              _setting5 = _context34.sent;

              if (_setting5) {
                _context34.next = 249;
                break;
              }

              return _context34.abrupt("return");

            case 249:
              _context34.next = 251;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5, faucetSetting);

            case 251:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context34.next = 268;
                break;
              }

              _context34.next = 254;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Thunder');

            case 254:
              _limited20 = _context34.sent;

              if (!_limited20) {
                _context34.next = 257;
                break;
              }

              return _context34.abrupt("return");

            case 257:
              _context34.next = 259;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27() {
                return _regenerator["default"].wrap(function _callee27$(_context27) {
                  while (1) {
                    switch (_context27.prev = _context27.next) {
                      case 0:
                        _context27.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'thunder', io);

                      case 2:
                        disallow = _context27.sent;

                      case 3:
                      case "end":
                        return _context27.stop();
                    }
                  }
                }, _callee27);
              })));

            case 259:
              if (!disallow) {
                _context34.next = 261;
                break;
              }

              return _context34.abrupt("return");

            case 261:
              _context34.next = 263;
              return (0, _settings.discordFeatureSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 263:
              _setting6 = _context34.sent;

              if (_setting6) {
                _context34.next = 266;
                break;
              }

              return _context34.abrupt("return");

            case 266:
              _context34.next = 268;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6, faucetSetting);

            case 268:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context34.next = 285;
                break;
              }

              _context34.next = 271;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ThunderStorm');

            case 271:
              _limited21 = _context34.sent;

              if (!_limited21) {
                _context34.next = 274;
                break;
              }

              return _context34.abrupt("return");

            case 274:
              _context34.next = 276;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28() {
                return _regenerator["default"].wrap(function _callee28$(_context28) {
                  while (1) {
                    switch (_context28.prev = _context28.next) {
                      case 0:
                        _context28.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'thunderstorm', io);

                      case 2:
                        disallow = _context28.sent;

                      case 3:
                      case "end":
                        return _context28.stop();
                    }
                  }
                }, _callee28);
              })));

            case 276:
              if (!disallow) {
                _context34.next = 278;
                break;
              }

              return _context34.abrupt("return");

            case 278:
              _context34.next = 280;
              return (0, _settings.discordFeatureSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 280:
              _setting7 = _context34.sent;

              if (_setting7) {
                _context34.next = 283;
                break;
              }

              return _context34.abrupt("return");

            case 283:
              _context34.next = 285;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7, faucetSetting);

            case 285:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context34.next = 302;
                break;
              }

              _context34.next = 288;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Hurricane');

            case 288:
              _limited22 = _context34.sent;

              if (!_limited22) {
                _context34.next = 291;
                break;
              }

              return _context34.abrupt("return");

            case 291:
              _context34.next = 293;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29() {
                return _regenerator["default"].wrap(function _callee29$(_context29) {
                  while (1) {
                    switch (_context29.prev = _context29.next) {
                      case 0:
                        _context29.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'hurricane', io);

                      case 2:
                        disallow = _context29.sent;

                      case 3:
                      case "end":
                        return _context29.stop();
                    }
                  }
                }, _callee29);
              })));

            case 293:
              if (!disallow) {
                _context34.next = 295;
                break;
              }

              return _context34.abrupt("return");

            case 295:
              _context34.next = 297;
              return (0, _settings.discordFeatureSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 297:
              _setting8 = _context34.sent;

              if (_setting8) {
                _context34.next = 300;
                break;
              }

              return _context34.abrupt("return");

            case 300:
              _context34.next = 302;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8, faucetSetting);

            case 302:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context34.next = 319;
                break;
              }

              _context34.next = 305;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Soak');

            case 305:
              _limited23 = _context34.sent;

              if (!_limited23) {
                _context34.next = 308;
                break;
              }

              return _context34.abrupt("return");

            case 308:
              _context34.next = 310;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30() {
                return _regenerator["default"].wrap(function _callee30$(_context30) {
                  while (1) {
                    switch (_context30.prev = _context30.next) {
                      case 0:
                        _context30.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'soak', io);

                      case 2:
                        disallow = _context30.sent;

                      case 3:
                      case "end":
                        return _context30.stop();
                    }
                  }
                }, _callee30);
              })));

            case 310:
              if (!disallow) {
                _context34.next = 312;
                break;
              }

              return _context34.abrupt("return");

            case 312:
              _context34.next = 314;
              return (0, _settings.discordFeatureSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 314:
              _setting9 = _context34.sent;

              if (_setting9) {
                _context34.next = 317;
                break;
              }

              return _context34.abrupt("return");

            case 317:
              _context34.next = 319;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9, faucetSetting);

            case 319:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context34.next = 336;
                break;
              }

              _context34.next = 322;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Sleet');

            case 322:
              _limited24 = _context34.sent;

              if (!_limited24) {
                _context34.next = 325;
                break;
              }

              return _context34.abrupt("return");

            case 325:
              _context34.next = 327;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31() {
                return _regenerator["default"].wrap(function _callee31$(_context31) {
                  while (1) {
                    switch (_context31.prev = _context31.next) {
                      case 0:
                        _context31.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'sleet', io);

                      case 2:
                        disallow = _context31.sent;

                      case 3:
                      case "end":
                        return _context31.stop();
                    }
                  }
                }, _callee31);
              })));

            case 327:
              if (!disallow) {
                _context34.next = 329;
                break;
              }

              return _context34.abrupt("return");

            case 329:
              _context34.next = 331;
              return (0, _settings.discordFeatureSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 331:
              _setting10 = _context34.sent;

              if (_setting10) {
                _context34.next = 334;
                break;
              }

              return _context34.abrupt("return");

            case 334:
              _context34.next = 336;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10, faucetSetting);

            case 336:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context34.next = 353;
                break;
              }

              _context34.next = 339;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ReactDrop');

            case 339:
              _limited25 = _context34.sent;

              if (!_limited25) {
                _context34.next = 342;
                break;
              }

              return _context34.abrupt("return");

            case 342:
              _context34.next = 344;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32() {
                return _regenerator["default"].wrap(function _callee32$(_context32) {
                  while (1) {
                    switch (_context32.prev = _context32.next) {
                      case 0:
                        _context32.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'reactdrop', io);

                      case 2:
                        disallow = _context32.sent;

                      case 3:
                      case "end":
                        return _context32.stop();
                    }
                  }
                }, _callee32);
              })));

            case 344:
              if (!disallow) {
                _context34.next = 346;
                break;
              }

              return _context34.abrupt("return");

            case 346:
              _context34.next = 348;
              return (0, _settings.discordFeatureSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 348:
              _setting11 = _context34.sent;

              if (_setting11) {
                _context34.next = 351;
                break;
              }

              return _context34.abrupt("return");

            case 351:
              _context34.next = 353;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11, faucetSetting);

            case 353:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'trivia')) {
                _context34.next = 370;
                break;
              }

              _context34.next = 356;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Trivia');

            case 356:
              _limited26 = _context34.sent;

              if (!_limited26) {
                _context34.next = 359;
                break;
              }

              return _context34.abrupt("return");

            case 359:
              _context34.next = 361;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33() {
                return _regenerator["default"].wrap(function _callee33$(_context33) {
                  while (1) {
                    switch (_context33.prev = _context33.next) {
                      case 0:
                        _context33.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'trivia', io);

                      case 2:
                        disallow = _context33.sent;

                      case 3:
                      case "end":
                        return _context33.stop();
                    }
                  }
                }, _callee33);
              })));

            case 361:
              if (!disallow) {
                _context34.next = 363;
                break;
              }

              return _context34.abrupt("return");

            case 363:
              _context34.next = 365;
              return (0, _settings.discordFeatureSettings)(message, 'trivia', groupTaskId, channelTaskId);

            case 365:
              _setting12 = _context34.sent;

              if (_setting12) {
                _context34.next = 368;
                break;
              }

              return _context34.abrupt("return");

            case 368:
              _context34.next = 370;
              return (0, _executeTips.executeTipFunction)(_trivia.discordTrivia, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting12, faucetSetting);

            case 370:
            case "end":
              return _context34.stop();
          }
        }
      }, _callee34);
    }));

    return function (_x4) {
      return _ref7.apply(this, arguments);
    };
  }());
  console.log("Logged in as ".concat(discordClient.user.tag, "!"));
};

exports.discordRouter = discordRouter;