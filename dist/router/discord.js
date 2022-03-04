"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _balance = require("../controllers/discord/balance");

var _deposit = require("../controllers/discord/deposit");

var _withdraw = require("../controllers/discord/withdraw");

var _voicerain = require("../controllers/discord/voicerain");

var _rain = require("../controllers/discord/rain");

var _sleet = require("../controllers/discord/sleet");

var _flood = require("../controllers/discord/flood");

var _tip = require("../controllers/discord/tip");

var _user = require("../controllers/discord/user");

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

var _rateLimit = require("../helpers/rateLimit");

var _trivia = require("../controllers/discord/trivia");

var _reactdrop = require("../controllers/discord/reactdrop");

var _models = _interopRequireDefault(require("../models"));

var _discord = require("../messages/discord");

var _stats = require("../controllers/discord/stats");

var _publicstats = require("../controllers/discord/publicstats");

var _leaderboard = require("../controllers/discord/leaderboard");

var _settings = require("../controllers/discord/settings");

var _executeTips = require("../helpers/discord/executeTips");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

(0, _dotenv.config)();

var discordRouter = function discordRouter(discordClient, queue, io, settings) {
  // discordClient.on('ready', async () => {
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
  console.log("Logged in as ".concat(discordClient.user.tag, "!")); // });

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
                        return (0, _channel.updateDiscordChannel)(discordClient, newMember, groupTask);

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
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, faucetSetting, maintenance, walletExists, preFilteredMessageDiscord, filteredMessageDiscord, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, _limited8, _limited9, _limited10, setting, _limited11, _limited12, _setting, _limited13, _setting2, _limited14, AmountPosition, AmountPositionEnded, _setting3, _limited15, _setting4, _limited16, _setting5, _limited17, _setting6, _limited18, _setting7, _limited19, _setting8, _limited20, _setting9, _limited21, _setting10, _limited22, _setting11, _limited23, _setting12, _limited24;

      return _regenerator["default"].wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              if (message.author.bot) {
                _context17.next = 31;
                break;
              }

              _context17.next = 3;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 3:
              maintenance = _context17.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context17.next = 6;
                break;
              }

              return _context17.abrupt("return");

            case 6:
              _context17.next = 8;
              return (0, _user.createUpdateDiscordUser)(message, queue);

            case 8:
              walletExists = _context17.sent;
              _context17.next = 11;
              return (0, _group.updateDiscordGroup)(discordClient, message);

            case 11:
              groupTask = _context17.sent;
              _context17.next = 14;
              return queue.add(function () {
                return groupTask;
              });

            case 14:
              groupTaskId = groupTask && groupTask.id;
              _context17.next = 17;
              return (0, _channel.updateDiscordChannel)(discordClient, message, groupTask);

            case 17:
              channelTask = _context17.sent;
              _context17.next = 20;
              return queue.add(function () {
                return channelTask;
              });

            case 20:
              channelTaskId = channelTask && channelTask.id;
              _context17.next = 23;
              return (0, _user.updateDiscordLastSeen)(discordClient, message);

            case 23:
              lastSeenDiscordTask = _context17.sent;
              _context17.next = 26;
              return queue.add(function () {
                return lastSeenDiscordTask;
              });

            case 26:
              _context17.next = 28;
              return (0, _settings.discordwaterFaucetSettings)(groupTaskId, channelTaskId);

            case 28:
              faucetSetting = _context17.sent;

              if (faucetSetting) {
                _context17.next = 31;
                break;
              }

              return _context17.abrupt("return");

            case 31:
              if (!(!message.content.startsWith(settings.bot.command.discord) || message.author.bot)) {
                _context17.next = 33;
                break;
              }

              return _context17.abrupt("return");

            case 33:
              if (!message.content.startsWith(settings.bot.command.discord)) {
                _context17.next = 46;
                break;
              }

              if (!(groupTask && groupTask.banned)) {
                _context17.next = 38;
                break;
              }

              _context17.next = 37;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              });

            case 37:
              return _context17.abrupt("return");

            case 38:
              if (!(channelTask && channelTask.banned)) {
                _context17.next = 42;
                break;
              }

              _context17.next = 41;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              });

            case 41:
              return _context17.abrupt("return");

            case 42:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context17.next = 46;
                break;
              }

              _context17.next = 45;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              });

            case 45:
              return _context17.abrupt("return");

            case 46:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context17.next = 56;
                break;
              }

              _context17.next = 51;
              return (0, _rateLimit.limitHelp)(message);

            case 51:
              limited = _context17.sent;

              if (!limited) {
                _context17.next = 54;
                break;
              }

              return _context17.abrupt("return");

            case 54:
              _context17.next = 56;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                var task;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context4.sent;

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })));

            case 56:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context17.next = 64;
                break;
              }

              _context17.next = 59;
              return (0, _rateLimit.limitHelp)(message);

            case 59:
              _limited = _context17.sent;

              if (!_limited) {
                _context17.next = 62;
                break;
              }

              return _context17.abrupt("return");

            case 62:
              _context17.next = 64;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                var task;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context5.sent;

                      case 3:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })));

            case 64:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'fees')) {
                _context17.next = 72;
                break;
              }

              _context17.next = 67;
              return (0, _rateLimit.limitHelp)(message);

            case 67:
              _limited2 = _context17.sent;

              if (!_limited2) {
                _context17.next = 70;
                break;
              }

              return _context17.abrupt("return");

            case 70:
              _context17.next = 72;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                var task;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return (0, _fees.fetchFeeSchedule)(message, io, groupTaskId, channelTaskId);

                      case 2:
                        task = _context6.sent;

                      case 3:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              })));

            case 72:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'stats')) {
                _context17.next = 80;
                break;
              }

              _context17.next = 75;
              return (0, _rateLimit.limitStats)(message);

            case 75:
              _limited3 = _context17.sent;

              if (!_limited3) {
                _context17.next = 78;
                break;
              }

              return _context17.abrupt("return");

            case 78:
              _context17.next = 80;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                var task;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return (0, _stats.discordStats)(message, filteredMessageDiscord, io, groupTask, channelTask);

                      case 2:
                        task = _context7.sent;

                      case 3:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })));

            case 80:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context17.next = 88;
                break;
              }

              _context17.next = 83;
              return (0, _rateLimit.limitLeaderboard)(message);

            case 83:
              _limited4 = _context17.sent;

              if (!_limited4) {
                _context17.next = 86;
                break;
              }

              return _context17.abrupt("return");

            case 86:
              _context17.next = 88;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        console.log('unavailable'); // const task = await discordLeaderboard(message, io);

                      case 1:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })));

            case 88:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context17.next = 96;
                break;
              }

              _context17.next = 91;
              return (0, _rateLimit.limitPublicStats)(message);

            case 91:
              _limited5 = _context17.sent;

              if (!_limited5) {
                _context17.next = 94;
                break;
              }

              return _context17.abrupt("return");

            case 94:
              _context17.next = 96;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                var task;
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return (0, _publicstats.discordPublicStats)(message, io);

                      case 2:
                        task = _context9.sent;

                      case 3:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })));

            case 96:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context17.next = 104;
                break;
              }

              _context17.next = 99;
              return (0, _rateLimit.limitInfo)(message);

            case 99:
              _limited6 = _context17.sent;

              if (!_limited6) {
                _context17.next = 102;
                break;
              }

              return _context17.abrupt("return");

            case 102:
              _context17.next = 104;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                var task;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return (0, _info.discordCoinInfo)(message, io);

                      case 2:
                        task = _context10.sent;

                      case 3:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              })));

            case 104:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context17.next = 112;
                break;
              }

              _context17.next = 107;
              return (0, _rateLimit.limitIgnoreMe)(message);

            case 107:
              _limited7 = _context17.sent;

              if (!_limited7) {
                _context17.next = 110;
                break;
              }

              return _context17.abrupt("return");

            case 110:
              _context17.next = 112;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
                var task;
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return (0, _ignore.setIgnoreMe)(message, io);

                      case 2:
                        task = _context11.sent;

                      case 3:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              })));

            case 112:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context17.next = 120;
                break;
              }

              _context17.next = 115;
              return (0, _rateLimit.limitBalance)(message);

            case 115:
              _limited8 = _context17.sent;

              if (!_limited8) {
                _context17.next = 118;
                break;
              }

              return _context17.abrupt("return");

            case 118:
              _context17.next = 120;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                var task;
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return (0, _balance.fetchDiscordWalletBalance)(message, io);

                      case 2:
                        task = _context12.sent;

                      case 3:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              })));

            case 120:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'listtransactions')) {
                _context17.next = 128;
                break;
              }

              _context17.next = 123;
              return (0, _rateLimit.limitListTransactions)(message);

            case 123:
              _limited9 = _context17.sent;

              if (!_limited9) {
                _context17.next = 126;
                break;
              }

              return _context17.abrupt("return");

            case 126:
              _context17.next = 128;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                var task;
                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return (0, _listTransactions.fetchDiscordListTransactions)(message, io);

                      case 2:
                        task = _context13.sent;

                      case 3:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })));

            case 128:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'price')) {
                _context17.next = 136;
                break;
              }

              _context17.next = 131;
              return (0, _rateLimit.limitPrice)(message);

            case 131:
              _limited10 = _context17.sent;

              if (!_limited10) {
                _context17.next = 134;
                break;
              }

              return _context17.abrupt("return");

            case 134:
              _context17.next = 136;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
                var task;
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return (0, _price.discordPrice)(message, io);

                      case 2:
                        task = _context14.sent;

                      case 3:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })));

            case 136:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context17.next = 149;
                break;
              }

              _context17.next = 139;
              return (0, _settings.discordSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 139:
              setting = _context17.sent;

              if (setting) {
                _context17.next = 142;
                break;
              }

              return _context17.abrupt("return");

            case 142:
              _context17.next = 144;
              return (0, _rateLimit.limitFaucet)(message);

            case 144:
              _limited11 = _context17.sent;

              if (!_limited11) {
                _context17.next = 147;
                break;
              }

              return _context17.abrupt("return");

            case 147:
              _context17.next = 149;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
                var task;
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return (0, _faucet.discordFaucetClaim)(message, filteredMessageDiscord, io);

                      case 2:
                        task = _context15.sent;

                      case 3:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              })));

            case 149:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context17.next = 157;
                break;
              }

              _context17.next = 152;
              return (0, _rateLimit.limitDeposit)(message);

            case 152:
              _limited12 = _context17.sent;

              if (!_limited12) {
                _context17.next = 155;
                break;
              }

              return _context17.abrupt("return");

            case 155:
              _context17.next = 157;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
                var task;
                return _regenerator["default"].wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return (0, _deposit.fetchDiscordWalletDepositAddress)(message, io);

                      case 2:
                        task = _context16.sent;

                      case 3:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
              })));

            case 157:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context17.next = 170;
                break;
              }

              _context17.next = 160;
              return (0, _settings.discordSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 160:
              _setting = _context17.sent;

              if (_setting) {
                _context17.next = 163;
                break;
              }

              return _context17.abrupt("return");

            case 163:
              _context17.next = 165;
              return (0, _rateLimit.limitWithdraw)(message);

            case 165:
              _limited13 = _context17.sent;

              if (!_limited13) {
                _context17.next = 168;
                break;
              }

              return _context17.abrupt("return");

            case 168:
              _context17.next = 170;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting, faucetSetting);

            case 170:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@'))) {
                _context17.next = 191;
                break;
              }

              _context17.next = 173;
              return (0, _settings.discordSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 173:
              _setting2 = _context17.sent;

              if (_setting2) {
                _context17.next = 176;
                break;
              }

              return _context17.abrupt("return");

            case 176:
              _context17.next = 178;
              return (0, _rateLimit.limitTip)(message);

            case 178:
              _limited14 = _context17.sent;

              if (!_limited14) {
                _context17.next = 181;
                break;
              }

              return _context17.abrupt("return");

            case 181:
              if (!(filteredMessageDiscord[1].substr(3).slice(0, -1) === discordClient.user.id)) {
                _context17.next = 186;
                break;
              }

              _context17.next = 184;
              return (0, _executeTips.executeTipFunction)(_tip.tipCoinsToDiscordFaucet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 184:
              _context17.next = 191;
              break;

            case 186:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[AmountPosition].startsWith('<@')) {
                  AmountPositionEnded = true;
                }
              }

              _context17.next = 191;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[AmountPosition], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 191:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context17.next = 204;
                break;
              }

              _context17.next = 194;
              return (0, _settings.discordSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 194:
              _setting3 = _context17.sent;

              if (_setting3) {
                _context17.next = 197;
                break;
              }

              return _context17.abrupt("return");

            case 197:
              _context17.next = 199;
              return (0, _rateLimit.limitRain)(message);

            case 199:
              _limited15 = _context17.sent;

              if (!_limited15) {
                _context17.next = 202;
                break;
              }

              return _context17.abrupt("return");

            case 202:
              _context17.next = 204;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3, faucetSetting);

            case 204:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context17.next = 217;
                break;
              }

              _context17.next = 207;
              return (0, _settings.discordSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 207:
              _setting4 = _context17.sent;

              if (_setting4) {
                _context17.next = 210;
                break;
              }

              return _context17.abrupt("return");

            case 210:
              _context17.next = 212;
              return (0, _rateLimit.limitRain)(message);

            case 212:
              _limited16 = _context17.sent;

              if (!_limited16) {
                _context17.next = 215;
                break;
              }

              return _context17.abrupt("return");

            case 215:
              _context17.next = 217;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4, faucetSetting);

            case 217:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context17.next = 230;
                break;
              }

              _context17.next = 220;
              return (0, _settings.discordSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 220:
              _setting5 = _context17.sent;

              if (_setting5) {
                _context17.next = 223;
                break;
              }

              return _context17.abrupt("return");

            case 223:
              _context17.next = 225;
              return (0, _rateLimit.limitFlood)(message);

            case 225:
              _limited17 = _context17.sent;

              if (!_limited17) {
                _context17.next = 228;
                break;
              }

              return _context17.abrupt("return");

            case 228:
              _context17.next = 230;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5, faucetSetting);

            case 230:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context17.next = 243;
                break;
              }

              _context17.next = 233;
              return (0, _settings.discordSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 233:
              _setting6 = _context17.sent;

              if (_setting6) {
                _context17.next = 236;
                break;
              }

              return _context17.abrupt("return");

            case 236:
              _context17.next = 238;
              return (0, _rateLimit.limitThunder)(message);

            case 238:
              _limited18 = _context17.sent;

              if (!_limited18) {
                _context17.next = 241;
                break;
              }

              return _context17.abrupt("return");

            case 241:
              _context17.next = 243;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6, faucetSetting);

            case 243:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context17.next = 256;
                break;
              }

              _context17.next = 246;
              return (0, _settings.discordSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 246:
              _setting7 = _context17.sent;

              if (_setting7) {
                _context17.next = 249;
                break;
              }

              return _context17.abrupt("return");

            case 249:
              _context17.next = 251;
              return (0, _rateLimit.limitThunderStorm)(message);

            case 251:
              _limited19 = _context17.sent;

              if (!_limited19) {
                _context17.next = 254;
                break;
              }

              return _context17.abrupt("return");

            case 254:
              _context17.next = 256;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7, faucetSetting);

            case 256:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context17.next = 269;
                break;
              }

              _context17.next = 259;
              return (0, _settings.discordSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 259:
              _setting8 = _context17.sent;

              if (_setting8) {
                _context17.next = 262;
                break;
              }

              return _context17.abrupt("return");

            case 262:
              _context17.next = 264;
              return (0, _rateLimit.limitHurricane)(message);

            case 264:
              _limited20 = _context17.sent;

              if (!_limited20) {
                _context17.next = 267;
                break;
              }

              return _context17.abrupt("return");

            case 267:
              _context17.next = 269;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8, faucetSetting);

            case 269:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context17.next = 282;
                break;
              }

              _context17.next = 272;
              return (0, _settings.discordSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 272:
              _setting9 = _context17.sent;

              if (_setting9) {
                _context17.next = 275;
                break;
              }

              return _context17.abrupt("return");

            case 275:
              _context17.next = 277;
              return (0, _rateLimit.limitSoak)(message);

            case 277:
              _limited21 = _context17.sent;

              if (!_limited21) {
                _context17.next = 280;
                break;
              }

              return _context17.abrupt("return");

            case 280:
              _context17.next = 282;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9, faucetSetting);

            case 282:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context17.next = 295;
                break;
              }

              _context17.next = 285;
              return (0, _settings.discordSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 285:
              _setting10 = _context17.sent;

              if (_setting10) {
                _context17.next = 288;
                break;
              }

              return _context17.abrupt("return");

            case 288:
              _context17.next = 290;
              return (0, _rateLimit.limitSleet)(message);

            case 290:
              _limited22 = _context17.sent;

              if (!_limited22) {
                _context17.next = 293;
                break;
              }

              return _context17.abrupt("return");

            case 293:
              _context17.next = 295;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10, faucetSetting);

            case 295:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context17.next = 308;
                break;
              }

              _context17.next = 298;
              return (0, _settings.discordSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 298:
              _setting11 = _context17.sent;

              if (_setting11) {
                _context17.next = 301;
                break;
              }

              return _context17.abrupt("return");

            case 301:
              _context17.next = 303;
              return (0, _rateLimit.limitReactDrop)(message);

            case 303:
              _limited23 = _context17.sent;

              if (!_limited23) {
                _context17.next = 306;
                break;
              }

              return _context17.abrupt("return");

            case 306:
              _context17.next = 308;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11, faucetSetting);

            case 308:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'trivia')) {
                _context17.next = 321;
                break;
              }

              _context17.next = 311;
              return (0, _settings.discordSettings)(message, 'trivia', groupTaskId, channelTaskId);

            case 311:
              _setting12 = _context17.sent;

              if (_setting12) {
                _context17.next = 314;
                break;
              }

              return _context17.abrupt("return");

            case 314:
              _context17.next = 316;
              return (0, _rateLimit.limitTrivia)(message);

            case 316:
              _limited24 = _context17.sent;

              if (!_limited24) {
                _context17.next = 319;
                break;
              }

              return _context17.abrupt("return");

            case 319:
              _context17.next = 321;
              return (0, _executeTips.executeTipFunction)(_trivia.discordTrivia, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting12, faucetSetting);

            case 321:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
};

exports.discordRouter = discordRouter;