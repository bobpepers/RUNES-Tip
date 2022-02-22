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
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(oldMember, newMember) {
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
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context2.next = 7;
              return (0, _channel.updateDiscordChannel)(discordClient, newMember, groupTask);

            case 7:
              channelTask = _context2.sent;
              _context2.next = 10;
              return queue.add(function () {
                return channelTask;
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, faucetSetting, maintenance, walletExists, preFilteredMessageDiscord, filteredMessageDiscord, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, _limited8, _limited9, setting, _limited10, _limited11, _setting, _limited12, _setting2, _limited13, AmountPosition, AmountPositionEnded, _setting3, _limited14, _setting4, _limited15, _setting5, _limited16, _setting6, _limited17, _setting7, _limited18, _setting8, _limited19, _setting9, _limited20, _setting10, _limited21, _setting11, _limited22, _setting12, _limited23;

      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              if (message.author.bot) {
                _context15.next = 31;
                break;
              }

              _context15.next = 3;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 3:
              maintenance = _context15.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context15.next = 6;
                break;
              }

              return _context15.abrupt("return");

            case 6:
              _context15.next = 8;
              return (0, _user.createUpdateDiscordUser)(message, queue);

            case 8:
              walletExists = _context15.sent;
              _context15.next = 11;
              return (0, _group.updateDiscordGroup)(discordClient, message);

            case 11:
              groupTask = _context15.sent;
              _context15.next = 14;
              return queue.add(function () {
                return groupTask;
              });

            case 14:
              groupTaskId = groupTask && groupTask.id;
              _context15.next = 17;
              return (0, _channel.updateDiscordChannel)(discordClient, message, groupTask);

            case 17:
              channelTask = _context15.sent;
              _context15.next = 20;
              return queue.add(function () {
                return channelTask;
              });

            case 20:
              channelTaskId = channelTask && channelTask.id;
              _context15.next = 23;
              return (0, _user.updateDiscordLastSeen)(discordClient, message);

            case 23:
              lastSeenDiscordTask = _context15.sent;
              _context15.next = 26;
              return queue.add(function () {
                return lastSeenDiscordTask;
              });

            case 26:
              _context15.next = 28;
              return (0, _settings.discordwaterFaucetSettings)(groupTaskId, channelTaskId);

            case 28:
              faucetSetting = _context15.sent;

              if (faucetSetting) {
                _context15.next = 31;
                break;
              }

              return _context15.abrupt("return");

            case 31:
              if (!(!message.content.startsWith(settings.bot.command.discord) || message.author.bot)) {
                _context15.next = 33;
                break;
              }

              return _context15.abrupt("return");

            case 33:
              if (!message.content.startsWith(settings.bot.command.discord)) {
                _context15.next = 46;
                break;
              }

              if (!(groupTask && groupTask.banned)) {
                _context15.next = 38;
                break;
              }

              _context15.next = 37;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              });

            case 37:
              return _context15.abrupt("return");

            case 38:
              if (!(channelTask && channelTask.banned)) {
                _context15.next = 42;
                break;
              }

              _context15.next = 41;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              });

            case 41:
              return _context15.abrupt("return");

            case 42:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context15.next = 46;
                break;
              }

              _context15.next = 45;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              });

            case 45:
              return _context15.abrupt("return");

            case 46:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context15.next = 56;
                break;
              }

              _context15.next = 51;
              return (0, _rateLimit.limitHelp)(message);

            case 51:
              limited = _context15.sent;

              if (!limited) {
                _context15.next = 54;
                break;
              }

              return _context15.abrupt("return");

            case 54:
              _context15.next = 56;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                var task;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context3.sent;

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })));

            case 56:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context15.next = 64;
                break;
              }

              _context15.next = 59;
              return (0, _rateLimit.limitHelp)(message);

            case 59:
              _limited = _context15.sent;

              if (!_limited) {
                _context15.next = 62;
                break;
              }

              return _context15.abrupt("return");

            case 62:
              _context15.next = 64;
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

            case 64:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'fees')) {
                _context15.next = 72;
                break;
              }

              _context15.next = 67;
              return (0, _rateLimit.limitHelp)(message);

            case 67:
              _limited2 = _context15.sent;

              if (!_limited2) {
                _context15.next = 70;
                break;
              }

              return _context15.abrupt("return");

            case 70:
              _context15.next = 72;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                var task;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _fees.fetchFeeSchedule)(message, io, groupTaskId, channelTaskId);

                      case 2:
                        task = _context5.sent;

                      case 3:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })));

            case 72:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'stats')) {
                _context15.next = 80;
                break;
              }

              _context15.next = 75;
              return (0, _rateLimit.limitStats)(message);

            case 75:
              _limited3 = _context15.sent;

              if (!_limited3) {
                _context15.next = 78;
                break;
              }

              return _context15.abrupt("return");

            case 78:
              _context15.next = 80;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                var task;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return (0, _stats.discordStats)(message, filteredMessageDiscord, io, groupTask, channelTask);

                      case 2:
                        task = _context6.sent;

                      case 3:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              })));

            case 80:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context15.next = 88;
                break;
              }

              _context15.next = 83;
              return (0, _rateLimit.limitLeaderboard)(message);

            case 83:
              _limited4 = _context15.sent;

              if (!_limited4) {
                _context15.next = 86;
                break;
              }

              return _context15.abrupt("return");

            case 86:
              _context15.next = 88;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                var task;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return (0, _leaderboard.discordLeaderboard)(message, io);

                      case 2:
                        task = _context7.sent;

                      case 3:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })));

            case 88:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context15.next = 96;
                break;
              }

              _context15.next = 91;
              return (0, _rateLimit.limitPublicStats)(message);

            case 91:
              _limited5 = _context15.sent;

              if (!_limited5) {
                _context15.next = 94;
                break;
              }

              return _context15.abrupt("return");

            case 94:
              _context15.next = 96;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                var task;
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return (0, _publicstats.discordPublicStats)(message, io);

                      case 2:
                        task = _context8.sent;

                      case 3:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })));

            case 96:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context15.next = 104;
                break;
              }

              _context15.next = 99;
              return (0, _rateLimit.limitInfo)(message);

            case 99:
              _limited6 = _context15.sent;

              if (!_limited6) {
                _context15.next = 102;
                break;
              }

              return _context15.abrupt("return");

            case 102:
              _context15.next = 104;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                var task;
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return (0, _info.discordCoinInfo)(message, io);

                      case 2:
                        task = _context9.sent;

                      case 3:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })));

            case 104:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context15.next = 112;
                break;
              }

              _context15.next = 107;
              return (0, _rateLimit.limitIgnoreMe)(message);

            case 107:
              _limited7 = _context15.sent;

              if (!_limited7) {
                _context15.next = 110;
                break;
              }

              return _context15.abrupt("return");

            case 110:
              _context15.next = 112;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                var task;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return (0, _ignore.setIgnoreMe)(message, io);

                      case 2:
                        task = _context10.sent;

                      case 3:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              })));

            case 112:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context15.next = 120;
                break;
              }

              _context15.next = 115;
              return (0, _rateLimit.limitBalance)(message);

            case 115:
              _limited8 = _context15.sent;

              if (!_limited8) {
                _context15.next = 118;
                break;
              }

              return _context15.abrupt("return");

            case 118:
              _context15.next = 120;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
                var task;
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return (0, _balance.fetchDiscordWalletBalance)(message, io);

                      case 2:
                        task = _context11.sent;

                      case 3:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              })));

            case 120:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'price')) {
                _context15.next = 128;
                break;
              }

              _context15.next = 123;
              return (0, _rateLimit.limitPrice)(message);

            case 123:
              _limited9 = _context15.sent;

              if (!_limited9) {
                _context15.next = 126;
                break;
              }

              return _context15.abrupt("return");

            case 126:
              _context15.next = 128;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                var task;
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return (0, _price.discordPrice)(message, io);

                      case 2:
                        task = _context12.sent;

                      case 3:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              })));

            case 128:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context15.next = 141;
                break;
              }

              _context15.next = 131;
              return (0, _settings.discordSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 131:
              setting = _context15.sent;

              if (setting) {
                _context15.next = 134;
                break;
              }

              return _context15.abrupt("return");

            case 134:
              _context15.next = 136;
              return (0, _rateLimit.limitFaucet)(message);

            case 136:
              _limited10 = _context15.sent;

              if (!_limited10) {
                _context15.next = 139;
                break;
              }

              return _context15.abrupt("return");

            case 139:
              _context15.next = 141;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                var task;
                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return (0, _faucet.discordFaucetClaim)(message, filteredMessageDiscord, io);

                      case 2:
                        task = _context13.sent;

                      case 3:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })));

            case 141:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context15.next = 149;
                break;
              }

              _context15.next = 144;
              return (0, _rateLimit.limitDeposit)(message);

            case 144:
              _limited11 = _context15.sent;

              if (!_limited11) {
                _context15.next = 147;
                break;
              }

              return _context15.abrupt("return");

            case 147:
              _context15.next = 149;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
                var task;
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return (0, _deposit.fetchDiscordWalletDepositAddress)(message, io);

                      case 2:
                        task = _context14.sent;

                      case 3:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })));

            case 149:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context15.next = 162;
                break;
              }

              _context15.next = 152;
              return (0, _settings.discordSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 152:
              _setting = _context15.sent;

              if (_setting) {
                _context15.next = 155;
                break;
              }

              return _context15.abrupt("return");

            case 155:
              _context15.next = 157;
              return (0, _rateLimit.limitWithdraw)(message);

            case 157:
              _limited12 = _context15.sent;

              if (!_limited12) {
                _context15.next = 160;
                break;
              }

              return _context15.abrupt("return");

            case 160:
              _context15.next = 162;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting, faucetSetting);

            case 162:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@'))) {
                _context15.next = 183;
                break;
              }

              _context15.next = 165;
              return (0, _settings.discordSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 165:
              _setting2 = _context15.sent;

              if (_setting2) {
                _context15.next = 168;
                break;
              }

              return _context15.abrupt("return");

            case 168:
              _context15.next = 170;
              return (0, _rateLimit.limitTip)(message);

            case 170:
              _limited13 = _context15.sent;

              if (!_limited13) {
                _context15.next = 173;
                break;
              }

              return _context15.abrupt("return");

            case 173:
              if (!(filteredMessageDiscord[1].substr(3).slice(0, -1) === discordClient.user.id)) {
                _context15.next = 178;
                break;
              }

              _context15.next = 176;
              return (0, _executeTips.executeTipFunction)(_tip.tipCoinsToDiscordFaucet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 176:
              _context15.next = 183;
              break;

            case 178:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[AmountPosition].startsWith('<@')) {
                  AmountPositionEnded = true;
                }
              }

              _context15.next = 183;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[AmountPosition], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 183:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context15.next = 196;
                break;
              }

              _context15.next = 186;
              return (0, _settings.discordSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 186:
              _setting3 = _context15.sent;

              if (_setting3) {
                _context15.next = 189;
                break;
              }

              return _context15.abrupt("return");

            case 189:
              _context15.next = 191;
              return (0, _rateLimit.limitRain)(message);

            case 191:
              _limited14 = _context15.sent;

              if (!_limited14) {
                _context15.next = 194;
                break;
              }

              return _context15.abrupt("return");

            case 194:
              _context15.next = 196;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3, faucetSetting);

            case 196:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context15.next = 209;
                break;
              }

              _context15.next = 199;
              return (0, _settings.discordSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 199:
              _setting4 = _context15.sent;

              if (_setting4) {
                _context15.next = 202;
                break;
              }

              return _context15.abrupt("return");

            case 202:
              _context15.next = 204;
              return (0, _rateLimit.limitRain)(message);

            case 204:
              _limited15 = _context15.sent;

              if (!_limited15) {
                _context15.next = 207;
                break;
              }

              return _context15.abrupt("return");

            case 207:
              _context15.next = 209;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4, faucetSetting);

            case 209:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context15.next = 222;
                break;
              }

              _context15.next = 212;
              return (0, _settings.discordSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 212:
              _setting5 = _context15.sent;

              if (_setting5) {
                _context15.next = 215;
                break;
              }

              return _context15.abrupt("return");

            case 215:
              _context15.next = 217;
              return (0, _rateLimit.limitFlood)(message);

            case 217:
              _limited16 = _context15.sent;

              if (!_limited16) {
                _context15.next = 220;
                break;
              }

              return _context15.abrupt("return");

            case 220:
              _context15.next = 222;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5, faucetSetting);

            case 222:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context15.next = 235;
                break;
              }

              _context15.next = 225;
              return (0, _settings.discordSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 225:
              _setting6 = _context15.sent;

              if (_setting6) {
                _context15.next = 228;
                break;
              }

              return _context15.abrupt("return");

            case 228:
              _context15.next = 230;
              return (0, _rateLimit.limitThunder)(message);

            case 230:
              _limited17 = _context15.sent;

              if (!_limited17) {
                _context15.next = 233;
                break;
              }

              return _context15.abrupt("return");

            case 233:
              _context15.next = 235;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6, faucetSetting);

            case 235:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context15.next = 248;
                break;
              }

              _context15.next = 238;
              return (0, _settings.discordSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 238:
              _setting7 = _context15.sent;

              if (_setting7) {
                _context15.next = 241;
                break;
              }

              return _context15.abrupt("return");

            case 241:
              _context15.next = 243;
              return (0, _rateLimit.limitThunderStorm)(message);

            case 243:
              _limited18 = _context15.sent;

              if (!_limited18) {
                _context15.next = 246;
                break;
              }

              return _context15.abrupt("return");

            case 246:
              _context15.next = 248;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7, faucetSetting);

            case 248:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context15.next = 261;
                break;
              }

              _context15.next = 251;
              return (0, _settings.discordSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 251:
              _setting8 = _context15.sent;

              if (_setting8) {
                _context15.next = 254;
                break;
              }

              return _context15.abrupt("return");

            case 254:
              _context15.next = 256;
              return (0, _rateLimit.limitHurricane)(message);

            case 256:
              _limited19 = _context15.sent;

              if (!_limited19) {
                _context15.next = 259;
                break;
              }

              return _context15.abrupt("return");

            case 259:
              _context15.next = 261;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8, faucetSetting);

            case 261:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context15.next = 274;
                break;
              }

              _context15.next = 264;
              return (0, _settings.discordSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 264:
              _setting9 = _context15.sent;

              if (_setting9) {
                _context15.next = 267;
                break;
              }

              return _context15.abrupt("return");

            case 267:
              _context15.next = 269;
              return (0, _rateLimit.limitSoak)(message);

            case 269:
              _limited20 = _context15.sent;

              if (!_limited20) {
                _context15.next = 272;
                break;
              }

              return _context15.abrupt("return");

            case 272:
              _context15.next = 274;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9, faucetSetting);

            case 274:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context15.next = 287;
                break;
              }

              _context15.next = 277;
              return (0, _settings.discordSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 277:
              _setting10 = _context15.sent;

              if (_setting10) {
                _context15.next = 280;
                break;
              }

              return _context15.abrupt("return");

            case 280:
              _context15.next = 282;
              return (0, _rateLimit.limitSleet)(message);

            case 282:
              _limited21 = _context15.sent;

              if (!_limited21) {
                _context15.next = 285;
                break;
              }

              return _context15.abrupt("return");

            case 285:
              _context15.next = 287;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10, faucetSetting);

            case 287:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context15.next = 300;
                break;
              }

              _context15.next = 290;
              return (0, _settings.discordSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 290:
              _setting11 = _context15.sent;

              if (_setting11) {
                _context15.next = 293;
                break;
              }

              return _context15.abrupt("return");

            case 293:
              _context15.next = 295;
              return (0, _rateLimit.limitReactDrop)(message);

            case 295:
              _limited22 = _context15.sent;

              if (!_limited22) {
                _context15.next = 298;
                break;
              }

              return _context15.abrupt("return");

            case 298:
              _context15.next = 300;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11, faucetSetting);

            case 300:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'trivia')) {
                _context15.next = 313;
                break;
              }

              _context15.next = 303;
              return (0, _settings.discordSettings)(message, 'trivia', groupTaskId, channelTaskId);

            case 303:
              _setting12 = _context15.sent;

              if (_setting12) {
                _context15.next = 306;
                break;
              }

              return _context15.abrupt("return");

            case 306:
              _context15.next = 308;
              return (0, _rateLimit.limitTrivia)(message);

            case 308:
              _limited23 = _context15.sent;

              if (!_limited23) {
                _context15.next = 311;
                break;
              }

              return _context15.abrupt("return");

            case 311:
              _context15.next = 313;
              return (0, _executeTips.executeTipFunction)(_trivia.discordTrivia, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting12, faucetSetting);

            case 313:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
};

exports.discordRouter = discordRouter;