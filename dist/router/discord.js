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

var _leaderboard = require("../controllers/discord/leaderboard");

var _tip = require("../controllers/discord/tip");

var _user = require("../controllers/discord/user");

var _settings = require("../controllers/discord/settings");

var _rateLimit = require("../helpers/rateLimit");

var _disallowDirectMessage = require("../helpers/client/discord/disallowDirectMessage");

var _executeTips = require("../helpers/client/discord/executeTips");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _discord = require("../messages/discord");

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
              console.log('interaction started');

              if (interaction.user.bot) {
                _context6.next = 30;
                break;
              }

              _context6.next = 6;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(interaction, 'discord');

            case 6:
              maintenance = _context6.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt("return");

            case 9:
              _context6.next = 11;
              return (0, _user.createUpdateDiscordUser)(discordClient, interaction.user, queue);

            case 11:
              walletExists = _context6.sent;
              _context6.next = 14;
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
                        return (0, _user.updateDiscordLastSeen)(discordClient, interaction.user);

                      case 8:
                        lastSeenDiscordTask = _context4.sent;

                      case 9:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })));

            case 14:
              if (!interaction.isButton()) {
                _context6.next = 30;
                break;
              }

              if (!(interaction.customId === 'claimFaucet')) {
                _context6.next = 30;
                break;
              }

              _context6.next = 18;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'discord', 'Faucet');

            case 18:
              limited = _context6.sent;

              if (!limited) {
                _context6.next = 21;
                break;
              }

              return _context6.abrupt("return");

            case 21:
              _context6.next = 23;
              return (0, _settings.discordSettings)(interaction, 'faucet', groupTaskId, channelTaskId);

            case 23:
              setting = _context6.sent;

              if (setting) {
                _context6.next = 26;
                break;
              }

              return _context6.abrupt("return");

            case 26:
              _context6.next = 28;
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

            case 28:
              _context6.next = 30;
              return interaction.deferUpdate()["catch"](function (e) {
                console.log(e);
              });

            case 30:
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
    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, disallow, maintenance, walletExists, faucetSetting, preFilteredMessageDiscord, filteredMessageDiscord, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, _limited8, _limited9, _limited10, _limited11, setting, _limited12, _limited13, _setting, _limited14, _setting2, AmountPosition, AmountPositionEnded, _limited15, _setting3, _limited16, _setting4, _limited17, _setting5, _limited18, _setting6, _limited19, _setting7, _limited20, _setting8, _limited21, _setting9, _limited22, _setting10, _limited23, _setting11, _limited24, _setting12;

      return _regenerator["default"].wrap(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              if (message.author.bot) {
                _context32.next = 13;
                break;
              }

              _context32.next = 3;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 3:
              maintenance = _context32.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context32.next = 6;
                break;
              }

              return _context32.abrupt("return");

            case 6:
              _context32.next = 8;
              return (0, _user.createUpdateDiscordUser)(discordClient, message.author, queue);

            case 8:
              walletExists = _context32.sent;
              _context32.next = 11;
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
                        return (0, _user.updateDiscordLastSeen)(discordClient, message.author);

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
                _context32.next = 15;
                break;
              }

              return _context32.abrupt("return");

            case 15:
              if (!(groupTask && groupTask.banned)) {
                _context32.next = 19;
                break;
              }

              _context32.next = 18;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              });

            case 18:
              return _context32.abrupt("return");

            case 19:
              if (!(channelTask && channelTask.banned)) {
                _context32.next = 23;
                break;
              }

              _context32.next = 22;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              });

            case 22:
              return _context32.abrupt("return");

            case 23:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context32.next = 27;
                break;
              }

              _context32.next = 26;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              });

            case 26:
              return _context32.abrupt("return");

            case 27:
              _context32.next = 29;
              return (0, _settings.discordwaterFaucetSettings)(groupTaskId, channelTaskId);

            case 29:
              faucetSetting = _context32.sent;

              if (faucetSetting) {
                _context32.next = 32;
                break;
              }

              return _context32.abrupt("return");

            case 32:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context32.next = 42;
                break;
              }

              _context32.next = 37;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Help');

            case 37:
              limited = _context32.sent;

              if (!limited) {
                _context32.next = 40;
                break;
              }

              return _context32.abrupt("return");

            case 40:
              _context32.next = 42;
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
                _context32.next = 50;
                break;
              }

              _context32.next = 45;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Help');

            case 45:
              _limited = _context32.sent;

              if (!_limited) {
                _context32.next = 48;
                break;
              }

              return _context32.abrupt("return");

            case 48:
              _context32.next = 50;
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
                _context32.next = 58;
                break;
              }

              _context32.next = 53;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Fees');

            case 53:
              _limited2 = _context32.sent;

              if (!_limited2) {
                _context32.next = 56;
                break;
              }

              return _context32.abrupt("return");

            case 56:
              _context32.next = 58;
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
                _context32.next = 66;
                break;
              }

              _context32.next = 61;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Stats');

            case 61:
              _limited3 = _context32.sent;

              if (!_limited3) {
                _context32.next = 64;
                break;
              }

              return _context32.abrupt("return");

            case 64:
              _context32.next = 66;
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
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context32.next = 74;
                break;
              }

              _context32.next = 69;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Leaderboard');

            case 69:
              _limited4 = _context32.sent;

              if (!_limited4) {
                _context32.next = 72;
                break;
              }

              return _context32.abrupt("return");

            case 72:
              _context32.next = 74;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        console.log('unavailable'); // const task = await discordLeaderboard(message, io);

                      case 1:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              })));

            case 74:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context32.next = 82;
                break;
              }

              _context32.next = 77;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'PublicStats');

            case 77:
              _limited5 = _context32.sent;

              if (!_limited5) {
                _context32.next = 80;
                break;
              }

              return _context32.abrupt("return");

            case 80:
              _context32.next = 82;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                var task;
                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return (0, _publicstats.discordPublicStats)(message, io);

                      case 2:
                        task = _context13.sent;

                      case 3:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })));

            case 82:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context32.next = 90;
                break;
              }

              _context32.next = 85;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Info');

            case 85:
              _limited6 = _context32.sent;

              if (!_limited6) {
                _context32.next = 88;
                break;
              }

              return _context32.abrupt("return");

            case 88:
              _context32.next = 90;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
                var task;
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return (0, _info.discordCoinInfo)(message, io);

                      case 2:
                        task = _context14.sent;

                      case 3:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })));

            case 90:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context32.next = 98;
                break;
              }

              _context32.next = 93;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'IgnoreMe');

            case 93:
              _limited7 = _context32.sent;

              if (!_limited7) {
                _context32.next = 96;
                break;
              }

              return _context32.abrupt("return");

            case 96:
              _context32.next = 98;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
                var task;
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return (0, _ignore.setIgnoreMe)(message, io);

                      case 2:
                        task = _context15.sent;

                      case 3:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              })));

            case 98:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context32.next = 106;
                break;
              }

              _context32.next = 101;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Balance');

            case 101:
              _limited8 = _context32.sent;

              if (!_limited8) {
                _context32.next = 104;
                break;
              }

              return _context32.abrupt("return");

            case 104:
              _context32.next = 106;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
                var task;
                return _regenerator["default"].wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return (0, _balance.fetchDiscordWalletBalance)(message, io);

                      case 2:
                        task = _context16.sent;

                      case 3:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
              })));

            case 106:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'listtransactions')) {
                _context32.next = 114;
                break;
              }

              _context32.next = 109;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ListTransactions');

            case 109:
              _limited9 = _context32.sent;

              if (!_limited9) {
                _context32.next = 112;
                break;
              }

              return _context32.abrupt("return");

            case 112:
              _context32.next = 114;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
                var task;
                return _regenerator["default"].wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        _context17.next = 2;
                        return (0, _listTransactions.fetchDiscordListTransactions)(message, io);

                      case 2:
                        task = _context17.sent;

                      case 3:
                      case "end":
                        return _context17.stop();
                    }
                  }
                }, _callee17);
              })));

            case 114:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'price')) {
                _context32.next = 122;
                break;
              }

              _context32.next = 117;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Price');

            case 117:
              _limited10 = _context32.sent;

              if (!_limited10) {
                _context32.next = 120;
                break;
              }

              return _context32.abrupt("return");

            case 120:
              _context32.next = 122;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
                var task;
                return _regenerator["default"].wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return (0, _price.discordPrice)(message, io);

                      case 2:
                        task = _context18.sent;

                      case 3:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18);
              })));

            case 122:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context32.next = 135;
                break;
              }

              _context32.next = 125;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Faucet');

            case 125:
              _limited11 = _context32.sent;

              if (!_limited11) {
                _context32.next = 128;
                break;
              }

              return _context32.abrupt("return");

            case 128:
              _context32.next = 130;
              return (0, _settings.discordSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 130:
              setting = _context32.sent;

              if (setting) {
                _context32.next = 133;
                break;
              }

              return _context32.abrupt("return");

            case 133:
              _context32.next = 135;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
                var task;
                return _regenerator["default"].wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        _context19.next = 2;
                        return (0, _faucet.discordFaucetClaim)(message, io);

                      case 2:
                        task = _context19.sent;

                      case 3:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19);
              })));

            case 135:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context32.next = 143;
                break;
              }

              _context32.next = 138;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Deposit');

            case 138:
              _limited12 = _context32.sent;

              if (!_limited12) {
                _context32.next = 141;
                break;
              }

              return _context32.abrupt("return");

            case 141:
              _context32.next = 143;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
                var task;
                return _regenerator["default"].wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _context20.next = 2;
                        return (0, _deposit.fetchDiscordWalletDepositAddress)(message, io);

                      case 2:
                        task = _context20.sent;

                      case 3:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20);
              })));

            case 143:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context32.next = 156;
                break;
              }

              _context32.next = 146;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Withdraw');

            case 146:
              _limited13 = _context32.sent;

              if (!_limited13) {
                _context32.next = 149;
                break;
              }

              return _context32.abrupt("return");

            case 149:
              _context32.next = 151;
              return (0, _settings.discordSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 151:
              _setting = _context32.sent;

              if (_setting) {
                _context32.next = 154;
                break;
              }

              return _context32.abrupt("return");

            case 154:
              _context32.next = 156;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting, faucetSetting);

            case 156:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1] && filteredMessageDiscord[1].startsWith('<@'))) {
                _context32.next = 181;
                break;
              }

              _context32.next = 159;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Tip');

            case 159:
              _limited14 = _context32.sent;

              if (!_limited14) {
                _context32.next = 162;
                break;
              }

              return _context32.abrupt("return");

            case 162:
              _context32.next = 164;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
                return _regenerator["default"].wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'tip', io);

                      case 2:
                        disallow = _context21.sent;

                      case 3:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21);
              })));

            case 164:
              if (!disallow) {
                _context32.next = 166;
                break;
              }

              return _context32.abrupt("return");

            case 166:
              _context32.next = 168;
              return (0, _settings.discordSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 168:
              _setting2 = _context32.sent;

              if (_setting2) {
                _context32.next = 171;
                break;
              }

              return _context32.abrupt("return");

            case 171:
              if (!(filteredMessageDiscord[1].substr(3).slice(0, -1) === discordClient.user.id)) {
                _context32.next = 176;
                break;
              }

              _context32.next = 174;
              return (0, _executeTips.executeTipFunction)(_tip.tipCoinsToDiscordFaucet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 174:
              _context32.next = 181;
              break;

            case 176:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[parseInt(AmountPosition, 10)].startsWith('<@')) {
                  AmountPositionEnded = true;
                }
              }

              _context32.next = 181;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[parseInt(AmountPosition, 10)], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 181:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context32.next = 198;
                break;
              }

              _context32.next = 184;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'VoiceRain');

            case 184:
              _limited15 = _context32.sent;

              if (!_limited15) {
                _context32.next = 187;
                break;
              }

              return _context32.abrupt("return");

            case 187:
              _context32.next = 189;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
                return _regenerator["default"].wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        _context22.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'voicerain', io);

                      case 2:
                        disallow = _context22.sent;

                      case 3:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22);
              })));

            case 189:
              if (!disallow) {
                _context32.next = 191;
                break;
              }

              return _context32.abrupt("return");

            case 191:
              _context32.next = 193;
              return (0, _settings.discordSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 193:
              _setting3 = _context32.sent;

              if (_setting3) {
                _context32.next = 196;
                break;
              }

              return _context32.abrupt("return");

            case 196:
              _context32.next = 198;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3, faucetSetting);

            case 198:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context32.next = 215;
                break;
              }

              _context32.next = 201;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Fees');

            case 201:
              _limited16 = _context32.sent;

              if (!_limited16) {
                _context32.next = 204;
                break;
              }

              return _context32.abrupt("return");

            case 204:
              _context32.next = 206;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
                return _regenerator["default"].wrap(function _callee23$(_context23) {
                  while (1) {
                    switch (_context23.prev = _context23.next) {
                      case 0:
                        _context23.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'rain', io);

                      case 2:
                        disallow = _context23.sent;

                      case 3:
                      case "end":
                        return _context23.stop();
                    }
                  }
                }, _callee23);
              })));

            case 206:
              if (!disallow) {
                _context32.next = 208;
                break;
              }

              return _context32.abrupt("return");

            case 208:
              _context32.next = 210;
              return (0, _settings.discordSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 210:
              _setting4 = _context32.sent;

              if (_setting4) {
                _context32.next = 213;
                break;
              }

              return _context32.abrupt("return");

            case 213:
              _context32.next = 215;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4, faucetSetting);

            case 215:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context32.next = 232;
                break;
              }

              _context32.next = 218;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Flood');

            case 218:
              _limited17 = _context32.sent;

              if (!_limited17) {
                _context32.next = 221;
                break;
              }

              return _context32.abrupt("return");

            case 221:
              _context32.next = 223;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24() {
                return _regenerator["default"].wrap(function _callee24$(_context24) {
                  while (1) {
                    switch (_context24.prev = _context24.next) {
                      case 0:
                        _context24.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'flood', io);

                      case 2:
                        disallow = _context24.sent;

                      case 3:
                      case "end":
                        return _context24.stop();
                    }
                  }
                }, _callee24);
              })));

            case 223:
              if (!disallow) {
                _context32.next = 225;
                break;
              }

              return _context32.abrupt("return");

            case 225:
              _context32.next = 227;
              return (0, _settings.discordSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 227:
              _setting5 = _context32.sent;

              if (_setting5) {
                _context32.next = 230;
                break;
              }

              return _context32.abrupt("return");

            case 230:
              _context32.next = 232;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5, faucetSetting);

            case 232:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context32.next = 249;
                break;
              }

              _context32.next = 235;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Thunder');

            case 235:
              _limited18 = _context32.sent;

              if (!_limited18) {
                _context32.next = 238;
                break;
              }

              return _context32.abrupt("return");

            case 238:
              _context32.next = 240;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
                return _regenerator["default"].wrap(function _callee25$(_context25) {
                  while (1) {
                    switch (_context25.prev = _context25.next) {
                      case 0:
                        _context25.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'thunder', io);

                      case 2:
                        disallow = _context25.sent;

                      case 3:
                      case "end":
                        return _context25.stop();
                    }
                  }
                }, _callee25);
              })));

            case 240:
              if (!disallow) {
                _context32.next = 242;
                break;
              }

              return _context32.abrupt("return");

            case 242:
              _context32.next = 244;
              return (0, _settings.discordSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 244:
              _setting6 = _context32.sent;

              if (_setting6) {
                _context32.next = 247;
                break;
              }

              return _context32.abrupt("return");

            case 247:
              _context32.next = 249;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6, faucetSetting);

            case 249:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context32.next = 266;
                break;
              }

              _context32.next = 252;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ThunderStorm');

            case 252:
              _limited19 = _context32.sent;

              if (!_limited19) {
                _context32.next = 255;
                break;
              }

              return _context32.abrupt("return");

            case 255:
              _context32.next = 257;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26() {
                return _regenerator["default"].wrap(function _callee26$(_context26) {
                  while (1) {
                    switch (_context26.prev = _context26.next) {
                      case 0:
                        _context26.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'thunderstorm', io);

                      case 2:
                        disallow = _context26.sent;

                      case 3:
                      case "end":
                        return _context26.stop();
                    }
                  }
                }, _callee26);
              })));

            case 257:
              if (!disallow) {
                _context32.next = 259;
                break;
              }

              return _context32.abrupt("return");

            case 259:
              _context32.next = 261;
              return (0, _settings.discordSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 261:
              _setting7 = _context32.sent;

              if (_setting7) {
                _context32.next = 264;
                break;
              }

              return _context32.abrupt("return");

            case 264:
              _context32.next = 266;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7, faucetSetting);

            case 266:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context32.next = 283;
                break;
              }

              _context32.next = 269;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Hurricane');

            case 269:
              _limited20 = _context32.sent;

              if (!_limited20) {
                _context32.next = 272;
                break;
              }

              return _context32.abrupt("return");

            case 272:
              _context32.next = 274;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27() {
                return _regenerator["default"].wrap(function _callee27$(_context27) {
                  while (1) {
                    switch (_context27.prev = _context27.next) {
                      case 0:
                        _context27.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'hurricane', io);

                      case 2:
                        disallow = _context27.sent;

                      case 3:
                      case "end":
                        return _context27.stop();
                    }
                  }
                }, _callee27);
              })));

            case 274:
              if (!disallow) {
                _context32.next = 276;
                break;
              }

              return _context32.abrupt("return");

            case 276:
              _context32.next = 278;
              return (0, _settings.discordSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 278:
              _setting8 = _context32.sent;

              if (_setting8) {
                _context32.next = 281;
                break;
              }

              return _context32.abrupt("return");

            case 281:
              _context32.next = 283;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8, faucetSetting);

            case 283:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context32.next = 300;
                break;
              }

              _context32.next = 286;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Soak');

            case 286:
              _limited21 = _context32.sent;

              if (!_limited21) {
                _context32.next = 289;
                break;
              }

              return _context32.abrupt("return");

            case 289:
              _context32.next = 291;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28() {
                return _regenerator["default"].wrap(function _callee28$(_context28) {
                  while (1) {
                    switch (_context28.prev = _context28.next) {
                      case 0:
                        _context28.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'soak', io);

                      case 2:
                        disallow = _context28.sent;

                      case 3:
                      case "end":
                        return _context28.stop();
                    }
                  }
                }, _callee28);
              })));

            case 291:
              if (!disallow) {
                _context32.next = 293;
                break;
              }

              return _context32.abrupt("return");

            case 293:
              _context32.next = 295;
              return (0, _settings.discordSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 295:
              _setting9 = _context32.sent;

              if (_setting9) {
                _context32.next = 298;
                break;
              }

              return _context32.abrupt("return");

            case 298:
              _context32.next = 300;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9, faucetSetting);

            case 300:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context32.next = 317;
                break;
              }

              _context32.next = 303;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Sleet');

            case 303:
              _limited22 = _context32.sent;

              if (!_limited22) {
                _context32.next = 306;
                break;
              }

              return _context32.abrupt("return");

            case 306:
              _context32.next = 308;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29() {
                return _regenerator["default"].wrap(function _callee29$(_context29) {
                  while (1) {
                    switch (_context29.prev = _context29.next) {
                      case 0:
                        _context29.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'sleet', io);

                      case 2:
                        disallow = _context29.sent;

                      case 3:
                      case "end":
                        return _context29.stop();
                    }
                  }
                }, _callee29);
              })));

            case 308:
              if (!disallow) {
                _context32.next = 310;
                break;
              }

              return _context32.abrupt("return");

            case 310:
              _context32.next = 312;
              return (0, _settings.discordSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 312:
              _setting10 = _context32.sent;

              if (_setting10) {
                _context32.next = 315;
                break;
              }

              return _context32.abrupt("return");

            case 315:
              _context32.next = 317;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10, faucetSetting);

            case 317:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context32.next = 334;
                break;
              }

              _context32.next = 320;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'ReactDrop');

            case 320:
              _limited23 = _context32.sent;

              if (!_limited23) {
                _context32.next = 323;
                break;
              }

              return _context32.abrupt("return");

            case 323:
              _context32.next = 325;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30() {
                return _regenerator["default"].wrap(function _callee30$(_context30) {
                  while (1) {
                    switch (_context30.prev = _context30.next) {
                      case 0:
                        _context30.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'reactdrop', io);

                      case 2:
                        disallow = _context30.sent;

                      case 3:
                      case "end":
                        return _context30.stop();
                    }
                  }
                }, _callee30);
              })));

            case 325:
              if (!disallow) {
                _context32.next = 327;
                break;
              }

              return _context32.abrupt("return");

            case 327:
              _context32.next = 329;
              return (0, _settings.discordSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 329:
              _setting11 = _context32.sent;

              if (_setting11) {
                _context32.next = 332;
                break;
              }

              return _context32.abrupt("return");

            case 332:
              _context32.next = 334;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11, faucetSetting);

            case 334:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'trivia')) {
                _context32.next = 351;
                break;
              }

              _context32.next = 337;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'discord', 'Trivia');

            case 337:
              _limited24 = _context32.sent;

              if (!_limited24) {
                _context32.next = 340;
                break;
              }

              return _context32.abrupt("return");

            case 340:
              _context32.next = 342;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31() {
                return _regenerator["default"].wrap(function _callee31$(_context31) {
                  while (1) {
                    switch (_context31.prev = _context31.next) {
                      case 0:
                        _context31.next = 2;
                        return (0, _disallowDirectMessage.disallowDirectMessage)(message, lastSeenDiscordTask, 'trivia', io);

                      case 2:
                        disallow = _context31.sent;

                      case 3:
                      case "end":
                        return _context31.stop();
                    }
                  }
                }, _callee31);
              })));

            case 342:
              if (!disallow) {
                _context32.next = 344;
                break;
              }

              return _context32.abrupt("return");

            case 344:
              _context32.next = 346;
              return (0, _settings.discordSettings)(message, 'trivia', groupTaskId, channelTaskId);

            case 346:
              _setting12 = _context32.sent;

              if (_setting12) {
                _context32.next = 349;
                break;
              }

              return _context32.abrupt("return");

            case 349:
              _context32.next = 351;
              return (0, _executeTips.executeTipFunction)(_trivia.discordTrivia, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting12, faucetSetting);

            case 351:
            case "end":
              return _context32.stop();
          }
        }
      }, _callee32);
    }));

    return function (_x4) {
      return _ref7.apply(this, arguments);
    };
  }());
  console.log("Logged in as ".concat(discordClient.user.tag, "!"));
};

exports.discordRouter = discordRouter;