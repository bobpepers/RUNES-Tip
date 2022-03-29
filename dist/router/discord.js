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

var _leaderboard = require("../controllers/discord/leaderboard");

var _tip = require("../controllers/discord/tip");

var _user = require("../controllers/discord/user");

var _settings = require("../controllers/discord/settings");

var _rateLimit = require("../helpers/rateLimit");

var _disallowDirectMessage = require("../helpers/client/discord/disallowDirectMessage");

var _executeTips = require("../helpers/client/discord/executeTips");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _discord = require("../messages/discord");

var _settings2 = _interopRequireDefault(require("../config/settings"));

var settings = (0, _settings2["default"])();
(0, _dotenv.config)();

var discordRouter = function discordRouter(discordClient, queue, io, settings) {
  var counter = 0;
  var interval = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var priceInfo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(counter % 2 === 0)) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return _models["default"].priceInfo.findOne({
              where: {
                currency: 'USD'
              }
            });

          case 3:
            priceInfo = _context.sent;
            discordClient.user.setPresence({
              activities: [{
                name: "$".concat(priceInfo.price, "/").concat(settings.coin.ticker),
                type: "WATCHING"
              }]
            });
            _context.next = 8;
            break;

          case 7:
            discordClient.user.setPresence({
              activities: [{
                name: "".concat(settings.bot.command.discord),
                type: "PLAYING"
              }]
            });

          case 8:
            counter += 1;

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), 40000);
  discordClient.on("presenceUpdate", function (oldMember, newMember) {
    // const { username } = newMember.user;
    console.log('presenceUpdate');
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

                      case 9:
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
              return (0, _settings.discordSettings)(interaction, 'faucet', groupTaskId, channelTaskId);

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
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, disallow, maintenance, walletExists, faucetSetting, preFilteredMessageDiscord, filteredMessageDiscord, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, _limited8, _limited9, _limited10, _limited11, _limited12, _limited13, setting, _limited14, _limited15, _setting, _limited16, _setting2, AmountPosition, AmountPositionEnded, _limited17, _setting3, _limited18, _setting4, _limited19, _setting5, _limited20, _setting6, _limited21, _setting7, _limited22, _setting8, _limited23, _setting9, _limited24, _setting10, _limited25, _setting11, _limited26, _setting12;

      return _regenerator["default"].wrap(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              if (message.author.bot) {
                _context34.next = 13;
                break;
              }

              _context34.next = 3;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 3:
              maintenance = _context34.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context34.next = 6;
                break;
              }

              return _context34.abrupt("return");

            case 6:
              _context34.next = 8;
              return (0, _user.createUpdateDiscordUser)(discordClient, message.author, queue);

            case 8:
              walletExists = _context34.sent;
              _context34.next = 11;
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

            case 11:
              groupTaskId = groupTask && groupTask.id;
              channelTaskId = channelTask && channelTask.id;

            case 13:
              if (!(!message.content.startsWith(settings.bot.command.discord) || message.author.bot)) {
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
              return (0, _settings.discordwaterFaucetSettings)(groupTaskId, channelTaskId);

            case 29:
              faucetSetting = _context34.sent;

              if (faucetSetting) {
                _context34.next = 32;
                break;
              }

              return _context34.abrupt("return");

            case 32:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context34.next = 42;
                break;
              }

              _context34.next = 37;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Help');

            case 37:
              limited = _context34.sent;

              if (!limited) {
                _context34.next = 40;
                break;
              }

              return _context34.abrupt("return");

            case 40:
              _context34.next = 42;
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

            case 42:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context34.next = 50;
                break;
              }

              _context34.next = 45;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Help');

            case 45:
              _limited = _context34.sent;

              if (!_limited) {
                _context34.next = 48;
                break;
              }

              return _context34.abrupt("return");

            case 48:
              _context34.next = 50;
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

            case 50:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'fees')) {
                _context34.next = 58;
                break;
              }

              _context34.next = 53;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Fees');

            case 53:
              _limited2 = _context34.sent;

              if (!_limited2) {
                _context34.next = 56;
                break;
              }

              return _context34.abrupt("return");

            case 56:
              _context34.next = 58;
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

            case 58:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'stats')) {
                _context34.next = 66;
                break;
              }

              _context34.next = 61;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Stats');

            case 61:
              _limited3 = _context34.sent;

              if (!_limited3) {
                _context34.next = 64;
                break;
              }

              return _context34.abrupt("return");

            case 64:
              _context34.next = 66;
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

            case 66:
              if (!settings.coin.halving.enabled) {
                _context34.next = 75;
                break;
              }

              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'halving')) {
                _context34.next = 75;
                break;
              }

              _context34.next = 70;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Halving');

            case 70:
              _limited4 = _context34.sent;

              if (!_limited4) {
                _context34.next = 73;
                break;
              }

              return _context34.abrupt("return");

            case 73:
              _context34.next = 75;
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

            case 75:
              if (!(settings.coin.name === 'Pirate')) {
                _context34.next = 84;
                break;
              }

              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'mining')) {
                _context34.next = 84;
                break;
              }

              _context34.next = 79;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Mining');

            case 79:
              _limited5 = _context34.sent;

              if (!_limited5) {
                _context34.next = 82;
                break;
              }

              return _context34.abrupt("return");

            case 82:
              _context34.next = 84;
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

            case 84:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context34.next = 92;
                break;
              }

              _context34.next = 87;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Leaderboard');

            case 87:
              _limited6 = _context34.sent;

              if (!_limited6) {
                _context34.next = 90;
                break;
              }

              return _context34.abrupt("return");

            case 90:
              _context34.next = 92;
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

            case 92:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context34.next = 100;
                break;
              }

              _context34.next = 95;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'PublicStats');

            case 95:
              _limited7 = _context34.sent;

              if (!_limited7) {
                _context34.next = 98;
                break;
              }

              return _context34.abrupt("return");

            case 98:
              _context34.next = 100;
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

            case 100:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context34.next = 108;
                break;
              }

              _context34.next = 103;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Info');

            case 103:
              _limited8 = _context34.sent;

              if (!_limited8) {
                _context34.next = 106;
                break;
              }

              return _context34.abrupt("return");

            case 106:
              _context34.next = 108;
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

            case 108:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context34.next = 116;
                break;
              }

              _context34.next = 111;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'IgnoreMe');

            case 111:
              _limited9 = _context34.sent;

              if (!_limited9) {
                _context34.next = 114;
                break;
              }

              return _context34.abrupt("return");

            case 114:
              _context34.next = 116;
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

            case 116:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context34.next = 124;
                break;
              }

              _context34.next = 119;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Balance');

            case 119:
              _limited10 = _context34.sent;

              if (!_limited10) {
                _context34.next = 122;
                break;
              }

              return _context34.abrupt("return");

            case 122:
              _context34.next = 124;
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

            case 124:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'listtransactions')) {
                _context34.next = 132;
                break;
              }

              _context34.next = 127;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ListTransactions');

            case 127:
              _limited11 = _context34.sent;

              if (!_limited11) {
                _context34.next = 130;
                break;
              }

              return _context34.abrupt("return");

            case 130:
              _context34.next = 132;
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

            case 132:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'price')) {
                _context34.next = 140;
                break;
              }

              _context34.next = 135;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Price');

            case 135:
              _limited12 = _context34.sent;

              if (!_limited12) {
                _context34.next = 138;
                break;
              }

              return _context34.abrupt("return");

            case 138:
              _context34.next = 140;
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

            case 140:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context34.next = 153;
                break;
              }

              _context34.next = 143;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Faucet');

            case 143:
              _limited13 = _context34.sent;

              if (!_limited13) {
                _context34.next = 146;
                break;
              }

              return _context34.abrupt("return");

            case 146:
              _context34.next = 148;
              return (0, _settings.discordSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 148:
              setting = _context34.sent;

              if (setting) {
                _context34.next = 151;
                break;
              }

              return _context34.abrupt("return");

            case 151:
              _context34.next = 153;
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

            case 153:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context34.next = 161;
                break;
              }

              _context34.next = 156;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Deposit');

            case 156:
              _limited14 = _context34.sent;

              if (!_limited14) {
                _context34.next = 159;
                break;
              }

              return _context34.abrupt("return");

            case 159:
              _context34.next = 161;
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

            case 161:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context34.next = 174;
                break;
              }

              _context34.next = 164;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Withdraw');

            case 164:
              _limited15 = _context34.sent;

              if (!_limited15) {
                _context34.next = 167;
                break;
              }

              return _context34.abrupt("return");

            case 167:
              _context34.next = 169;
              return (0, _settings.discordSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 169:
              _setting = _context34.sent;

              if (_setting) {
                _context34.next = 172;
                break;
              }

              return _context34.abrupt("return");

            case 172:
              _context34.next = 174;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting, faucetSetting);

            case 174:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1] && filteredMessageDiscord[1].startsWith('<@'))) {
                _context34.next = 199;
                break;
              }

              _context34.next = 177;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Tip');

            case 177:
              _limited16 = _context34.sent;

              if (!_limited16) {
                _context34.next = 180;
                break;
              }

              return _context34.abrupt("return");

            case 180:
              _context34.next = 182;
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

            case 182:
              if (!disallow) {
                _context34.next = 184;
                break;
              }

              return _context34.abrupt("return");

            case 184:
              _context34.next = 186;
              return (0, _settings.discordSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 186:
              _setting2 = _context34.sent;

              if (_setting2) {
                _context34.next = 189;
                break;
              }

              return _context34.abrupt("return");

            case 189:
              if (!(filteredMessageDiscord[1].substr(3).slice(0, -1) === discordClient.user.id)) {
                _context34.next = 194;
                break;
              }

              _context34.next = 192;
              return (0, _executeTips.executeTipFunction)(_tip.tipCoinsToDiscordFaucet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 192:
              _context34.next = 199;
              break;

            case 194:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[parseInt(AmountPosition, 10)].startsWith('<@')) {
                  AmountPositionEnded = true;
                }
              }

              _context34.next = 199;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[parseInt(AmountPosition, 10)], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 199:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context34.next = 216;
                break;
              }

              _context34.next = 202;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'VoiceRain');

            case 202:
              _limited17 = _context34.sent;

              if (!_limited17) {
                _context34.next = 205;
                break;
              }

              return _context34.abrupt("return");

            case 205:
              _context34.next = 207;
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

            case 207:
              if (!disallow) {
                _context34.next = 209;
                break;
              }

              return _context34.abrupt("return");

            case 209:
              _context34.next = 211;
              return (0, _settings.discordSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 211:
              _setting3 = _context34.sent;

              if (_setting3) {
                _context34.next = 214;
                break;
              }

              return _context34.abrupt("return");

            case 214:
              _context34.next = 216;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3, faucetSetting);

            case 216:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context34.next = 233;
                break;
              }

              _context34.next = 219;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Fees');

            case 219:
              _limited18 = _context34.sent;

              if (!_limited18) {
                _context34.next = 222;
                break;
              }

              return _context34.abrupt("return");

            case 222:
              _context34.next = 224;
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

            case 224:
              if (!disallow) {
                _context34.next = 226;
                break;
              }

              return _context34.abrupt("return");

            case 226:
              _context34.next = 228;
              return (0, _settings.discordSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 228:
              _setting4 = _context34.sent;

              if (_setting4) {
                _context34.next = 231;
                break;
              }

              return _context34.abrupt("return");

            case 231:
              _context34.next = 233;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4, faucetSetting);

            case 233:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context34.next = 250;
                break;
              }

              _context34.next = 236;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Flood');

            case 236:
              _limited19 = _context34.sent;

              if (!_limited19) {
                _context34.next = 239;
                break;
              }

              return _context34.abrupt("return");

            case 239:
              _context34.next = 241;
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

            case 241:
              if (!disallow) {
                _context34.next = 243;
                break;
              }

              return _context34.abrupt("return");

            case 243:
              _context34.next = 245;
              return (0, _settings.discordSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 245:
              _setting5 = _context34.sent;

              if (_setting5) {
                _context34.next = 248;
                break;
              }

              return _context34.abrupt("return");

            case 248:
              _context34.next = 250;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5, faucetSetting);

            case 250:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context34.next = 267;
                break;
              }

              _context34.next = 253;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Thunder');

            case 253:
              _limited20 = _context34.sent;

              if (!_limited20) {
                _context34.next = 256;
                break;
              }

              return _context34.abrupt("return");

            case 256:
              _context34.next = 258;
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

            case 258:
              if (!disallow) {
                _context34.next = 260;
                break;
              }

              return _context34.abrupt("return");

            case 260:
              _context34.next = 262;
              return (0, _settings.discordSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 262:
              _setting6 = _context34.sent;

              if (_setting6) {
                _context34.next = 265;
                break;
              }

              return _context34.abrupt("return");

            case 265:
              _context34.next = 267;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6, faucetSetting);

            case 267:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context34.next = 284;
                break;
              }

              _context34.next = 270;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ThunderStorm');

            case 270:
              _limited21 = _context34.sent;

              if (!_limited21) {
                _context34.next = 273;
                break;
              }

              return _context34.abrupt("return");

            case 273:
              _context34.next = 275;
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

            case 275:
              if (!disallow) {
                _context34.next = 277;
                break;
              }

              return _context34.abrupt("return");

            case 277:
              _context34.next = 279;
              return (0, _settings.discordSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 279:
              _setting7 = _context34.sent;

              if (_setting7) {
                _context34.next = 282;
                break;
              }

              return _context34.abrupt("return");

            case 282:
              _context34.next = 284;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7, faucetSetting);

            case 284:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context34.next = 301;
                break;
              }

              _context34.next = 287;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Hurricane');

            case 287:
              _limited22 = _context34.sent;

              if (!_limited22) {
                _context34.next = 290;
                break;
              }

              return _context34.abrupt("return");

            case 290:
              _context34.next = 292;
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

            case 292:
              if (!disallow) {
                _context34.next = 294;
                break;
              }

              return _context34.abrupt("return");

            case 294:
              _context34.next = 296;
              return (0, _settings.discordSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 296:
              _setting8 = _context34.sent;

              if (_setting8) {
                _context34.next = 299;
                break;
              }

              return _context34.abrupt("return");

            case 299:
              _context34.next = 301;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8, faucetSetting);

            case 301:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context34.next = 318;
                break;
              }

              _context34.next = 304;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Soak');

            case 304:
              _limited23 = _context34.sent;

              if (!_limited23) {
                _context34.next = 307;
                break;
              }

              return _context34.abrupt("return");

            case 307:
              _context34.next = 309;
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

            case 309:
              if (!disallow) {
                _context34.next = 311;
                break;
              }

              return _context34.abrupt("return");

            case 311:
              _context34.next = 313;
              return (0, _settings.discordSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 313:
              _setting9 = _context34.sent;

              if (_setting9) {
                _context34.next = 316;
                break;
              }

              return _context34.abrupt("return");

            case 316:
              _context34.next = 318;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9, faucetSetting);

            case 318:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context34.next = 335;
                break;
              }

              _context34.next = 321;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Sleet');

            case 321:
              _limited24 = _context34.sent;

              if (!_limited24) {
                _context34.next = 324;
                break;
              }

              return _context34.abrupt("return");

            case 324:
              _context34.next = 326;
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

            case 326:
              if (!disallow) {
                _context34.next = 328;
                break;
              }

              return _context34.abrupt("return");

            case 328:
              _context34.next = 330;
              return (0, _settings.discordSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 330:
              _setting10 = _context34.sent;

              if (_setting10) {
                _context34.next = 333;
                break;
              }

              return _context34.abrupt("return");

            case 333:
              _context34.next = 335;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10, faucetSetting);

            case 335:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context34.next = 352;
                break;
              }

              _context34.next = 338;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ReactDrop');

            case 338:
              _limited25 = _context34.sent;

              if (!_limited25) {
                _context34.next = 341;
                break;
              }

              return _context34.abrupt("return");

            case 341:
              _context34.next = 343;
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

            case 343:
              if (!disallow) {
                _context34.next = 345;
                break;
              }

              return _context34.abrupt("return");

            case 345:
              _context34.next = 347;
              return (0, _settings.discordSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 347:
              _setting11 = _context34.sent;

              if (_setting11) {
                _context34.next = 350;
                break;
              }

              return _context34.abrupt("return");

            case 350:
              _context34.next = 352;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11, faucetSetting);

            case 352:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'trivia')) {
                _context34.next = 369;
                break;
              }

              _context34.next = 355;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Trivia');

            case 355:
              _limited26 = _context34.sent;

              if (!_limited26) {
                _context34.next = 358;
                break;
              }

              return _context34.abrupt("return");

            case 358:
              _context34.next = 360;
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

            case 360:
              if (!disallow) {
                _context34.next = 362;
                break;
              }

              return _context34.abrupt("return");

            case 362:
              _context34.next = 364;
              return (0, _settings.discordSettings)(message, 'trivia', groupTaskId, channelTaskId);

            case 364:
              _setting12 = _context34.sent;

              if (_setting12) {
                _context34.next = 367;
                break;
              }

              return _context34.abrupt("return");

            case 367:
              _context34.next = 369;
              return (0, _executeTips.executeTipFunction)(_trivia.discordTrivia, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting12, faucetSetting);

            case 369:
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