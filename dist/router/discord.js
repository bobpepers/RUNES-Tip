"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _sequelize = require("sequelize");

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

var _rateLimit = require("../helpers/rateLimit");

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
  discordClient.on('ready', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var counter, interval;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            counter = 0;
            interval = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
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
            console.log("Logged in as ".concat(discordClient.user.tag, "!"));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  discordClient.on('voiceStateUpdate', /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(oldMember, newMember) {
      var groupTask, channelTask;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _group.updateDiscordGroup)(discordClient, newMember);

            case 2:
              groupTask = _context3.sent;
              _context3.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context3.next = 7;
              return (0, _channel.updateDiscordChannel)(discordClient, newMember, groupTask);

            case 7:
              channelTask = _context3.sent;
              _context3.next = 10;
              return queue.add(function () {
                return channelTask;
              });

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, maintenance, walletExists, preFilteredMessageDiscord, filteredMessageDiscord, limited, task, _limited, _task, _limited2, _task2, _limited3, _task3, _limited4, _task4, _limited5, _task5, _limited6, _task6, _limited7, _task7, _limited8, _task8, setting, _limited9, _task9, _limited10, _task10, _setting, _limited11, _setting2, _limited12, AmountPosition, AmountPositionEnded, _setting3, _limited13, _setting4, _limited14, _setting5, _limited15, _setting6, _limited16, _setting7, _limited17, _setting8, _limited18, _setting9, _limited19, _setting10, _limited20, _setting11, _limited21;

      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (message.author.bot) {
                _context4.next = 30;
                break;
              }

              _context4.next = 3;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 3:
              maintenance = _context4.sent;
              _context4.next = 6;
              return queue.add(function () {
                return maintenance;
              });

            case 6:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt("return");

            case 8:
              _context4.next = 10;
              return (0, _user.createUpdateDiscordUser)(message);

            case 10:
              walletExists = _context4.sent;
              _context4.next = 13;
              return queue.add(function () {
                return walletExists;
              });

            case 13:
              _context4.next = 15;
              return (0, _group.updateDiscordGroup)(discordClient, message);

            case 15:
              groupTask = _context4.sent;
              _context4.next = 18;
              return queue.add(function () {
                return groupTask;
              });

            case 18:
              groupTaskId = groupTask && groupTask.id;
              _context4.next = 21;
              return (0, _channel.updateDiscordChannel)(discordClient, message, groupTask);

            case 21:
              channelTask = _context4.sent;
              _context4.next = 24;
              return queue.add(function () {
                return channelTask;
              });

            case 24:
              channelTaskId = channelTask && channelTask.id;
              _context4.next = 27;
              return (0, _user.updateDiscordLastSeen)(discordClient, message);

            case 27:
              lastSeenDiscordTask = _context4.sent;
              _context4.next = 30;
              return queue.add(function () {
                return lastSeenDiscordTask;
              });

            case 30:
              if (!(!message.content.startsWith(settings.bot.command.discord) || message.author.bot)) {
                _context4.next = 32;
                break;
              }

              return _context4.abrupt("return");

            case 32:
              if (!message.content.startsWith(settings.bot.command.discord)) {
                _context4.next = 45;
                break;
              }

              if (!(groupTask && groupTask.banned)) {
                _context4.next = 37;
                break;
              }

              _context4.next = 36;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              });

            case 36:
              return _context4.abrupt("return");

            case 37:
              if (!(channelTask && channelTask.banned)) {
                _context4.next = 41;
                break;
              }

              _context4.next = 40;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              });

            case 40:
              return _context4.abrupt("return");

            case 41:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context4.next = 45;
                break;
              }

              _context4.next = 44;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              });

            case 44:
              return _context4.abrupt("return");

            case 45:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context4.next = 60;
                break;
              }

              _context4.next = 50;
              return (0, _rateLimit.limitHelp)(message);

            case 50:
              limited = _context4.sent;
              _context4.next = 53;
              return queue.add(function () {
                return limited;
              });

            case 53:
              if (!limited) {
                _context4.next = 55;
                break;
              }

              return _context4.abrupt("return");

            case 55:
              _context4.next = 57;
              return (0, _help.discordHelp)(message, io);

            case 57:
              task = _context4.sent;
              _context4.next = 60;
              return queue.add(function () {
                return task;
              });

            case 60:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context4.next = 73;
                break;
              }

              _context4.next = 63;
              return (0, _rateLimit.limitHelp)(message);

            case 63:
              _limited = _context4.sent;
              _context4.next = 66;
              return queue.add(function () {
                return _limited;
              });

            case 66:
              if (!_limited) {
                _context4.next = 68;
                break;
              }

              return _context4.abrupt("return");

            case 68:
              _context4.next = 70;
              return (0, _help.discordHelp)(message, io);

            case 70:
              _task = _context4.sent;
              _context4.next = 73;
              return queue.add(function () {
                return _task;
              });

            case 73:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'fees')) {
                _context4.next = 86;
                break;
              }

              _context4.next = 76;
              return (0, _rateLimit.limitHelp)(message);

            case 76:
              _limited2 = _context4.sent;
              _context4.next = 79;
              return queue.add(function () {
                return _limited2;
              });

            case 79:
              if (!_limited2) {
                _context4.next = 81;
                break;
              }

              return _context4.abrupt("return");

            case 81:
              _context4.next = 83;
              return (0, _fees.fetchFeeSchedule)(message, io, groupTaskId, channelTaskId);

            case 83:
              _task2 = _context4.sent;
              _context4.next = 86;
              return queue.add(function () {
                return _task2;
              });

            case 86:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'stats')) {
                _context4.next = 99;
                break;
              }

              _context4.next = 89;
              return (0, _rateLimit.limitStats)(message);

            case 89:
              _limited3 = _context4.sent;
              _context4.next = 92;
              return queue.add(function () {
                return _limited3;
              });

            case 92:
              if (!_limited3) {
                _context4.next = 94;
                break;
              }

              return _context4.abrupt("return");

            case 94:
              _context4.next = 96;
              return (0, _stats.discordStats)(message, filteredMessageDiscord, io, groupTask, channelTask);

            case 96:
              _task3 = _context4.sent;
              _context4.next = 99;
              return queue.add(function () {
                return _task3;
              });

            case 99:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context4.next = 112;
                break;
              }

              _context4.next = 102;
              return (0, _rateLimit.limitLeaderboard)(message);

            case 102:
              _limited4 = _context4.sent;
              _context4.next = 105;
              return queue.add(function () {
                return _limited4;
              });

            case 105:
              if (!_limited4) {
                _context4.next = 107;
                break;
              }

              return _context4.abrupt("return");

            case 107:
              _context4.next = 109;
              return (0, _leaderboard.discordLeaderboard)(message, io);

            case 109:
              _task4 = _context4.sent;
              _context4.next = 112;
              return queue.add(function () {
                return _task4;
              });

            case 112:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context4.next = 125;
                break;
              }

              _context4.next = 115;
              return (0, _rateLimit.limitPublicStats)(message);

            case 115:
              _limited5 = _context4.sent;
              _context4.next = 118;
              return queue.add(function () {
                return _limited5;
              });

            case 118:
              if (!_limited5) {
                _context4.next = 120;
                break;
              }

              return _context4.abrupt("return");

            case 120:
              _context4.next = 122;
              return (0, _publicstats.discordPublicStats)(message, io);

            case 122:
              _task5 = _context4.sent;
              _context4.next = 125;
              return queue.add(function () {
                return _task5;
              });

            case 125:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context4.next = 138;
                break;
              }

              _context4.next = 128;
              return (0, _rateLimit.limitInfo)(message);

            case 128:
              _limited6 = _context4.sent;
              _context4.next = 131;
              return queue.add(function () {
                return _limited6;
              });

            case 131:
              if (!_limited6) {
                _context4.next = 133;
                break;
              }

              return _context4.abrupt("return");

            case 133:
              _context4.next = 135;
              return (0, _info.discordCoinInfo)(message, io);

            case 135:
              _task6 = _context4.sent;
              _context4.next = 138;
              return queue.add(function () {
                return _task6;
              });

            case 138:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context4.next = 151;
                break;
              }

              _context4.next = 141;
              return (0, _rateLimit.limitIgnoreMe)(message);

            case 141:
              _limited7 = _context4.sent;
              _context4.next = 144;
              return queue.add(function () {
                return _limited7;
              });

            case 144:
              if (!_limited7) {
                _context4.next = 146;
                break;
              }

              return _context4.abrupt("return");

            case 146:
              _context4.next = 148;
              return (0, _ignore.setIgnoreMe)(message, io);

            case 148:
              _task7 = _context4.sent;
              _context4.next = 151;
              return queue.add(function () {
                return _task7;
              });

            case 151:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context4.next = 164;
                break;
              }

              _context4.next = 154;
              return (0, _rateLimit.limitBalance)(message);

            case 154:
              _limited8 = _context4.sent;
              _context4.next = 157;
              return queue.add(function () {
                return _limited8;
              });

            case 157:
              if (!_limited8) {
                _context4.next = 159;
                break;
              }

              return _context4.abrupt("return");

            case 159:
              _context4.next = 161;
              return (0, _balance.fetchDiscordWalletBalance)(message, io);

            case 161:
              _task8 = _context4.sent;
              _context4.next = 164;
              return queue.add(function () {
                return _task8;
              });

            case 164:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context4.next = 184;
                break;
              }

              _context4.next = 167;
              return (0, _settings.discordSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 167:
              setting = _context4.sent;
              _context4.next = 170;
              return queue.add(function () {
                return setting;
              });

            case 170:
              if (setting) {
                _context4.next = 172;
                break;
              }

              return _context4.abrupt("return");

            case 172:
              _context4.next = 174;
              return (0, _rateLimit.limitFaucet)(message);

            case 174:
              _limited9 = _context4.sent;
              _context4.next = 177;
              return queue.add(function () {
                return _limited9;
              });

            case 177:
              if (!_limited9) {
                _context4.next = 179;
                break;
              }

              return _context4.abrupt("return");

            case 179:
              _context4.next = 181;
              return (0, _faucet.discordFaucetClaim)(message, filteredMessageDiscord, io);

            case 181:
              _task9 = _context4.sent;
              _context4.next = 184;
              return queue.add(function () {
                return _task9;
              });

            case 184:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context4.next = 197;
                break;
              }

              _context4.next = 187;
              return (0, _rateLimit.limitDeposit)(message);

            case 187:
              _limited10 = _context4.sent;
              _context4.next = 190;
              return queue.add(function () {
                return _limited10;
              });

            case 190:
              if (!_limited10) {
                _context4.next = 192;
                break;
              }

              return _context4.abrupt("return");

            case 192:
              _context4.next = 194;
              return (0, _deposit.fetchDiscordWalletDepositAddress)(message, io);

            case 194:
              _task10 = _context4.sent;
              _context4.next = 197;
              return queue.add(function () {
                return _task10;
              });

            case 197:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context4.next = 214;
                break;
              }

              _context4.next = 200;
              return (0, _settings.discordSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 200:
              _setting = _context4.sent;
              _context4.next = 203;
              return queue.add(function () {
                return _setting;
              });

            case 203:
              if (_setting) {
                _context4.next = 205;
                break;
              }

              return _context4.abrupt("return");

            case 205:
              _context4.next = 207;
              return (0, _rateLimit.limitWithdraw)(message);

            case 207:
              _limited11 = _context4.sent;
              _context4.next = 210;
              return queue.add(function () {
                return _limited11;
              });

            case 210:
              if (!_limited11) {
                _context4.next = 212;
                break;
              }

              return _context4.abrupt("return");

            case 212:
              _context4.next = 214;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting);

            case 214:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@'))) {
                _context4.next = 236;
                break;
              }

              _context4.next = 217;
              return (0, _settings.discordSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 217:
              _setting2 = _context4.sent;
              _context4.next = 220;
              return queue.add(function () {
                return _setting2;
              });

            case 220:
              if (_setting2) {
                _context4.next = 222;
                break;
              }

              return _context4.abrupt("return");

            case 222:
              _context4.next = 224;
              return (0, _rateLimit.limitTip)(message);

            case 224:
              _limited12 = _context4.sent;
              _context4.next = 227;
              return queue.add(function () {
                return _limited12;
              });

            case 227:
              if (!_limited12) {
                _context4.next = 229;
                break;
              }

              return _context4.abrupt("return");

            case 229:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[AmountPosition].startsWith('<@')) {
                  AmountPositionEnded = true;
                }
              }

              console.log("amount position: ".concat(AmountPosition)); //

              _context4.next = 235;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[AmountPosition], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2);

            case 235:
              console.log('done executing tips');

            case 236:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context4.next = 253;
                break;
              }

              _context4.next = 239;
              return (0, _settings.discordSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 239:
              _setting3 = _context4.sent;
              _context4.next = 242;
              return queue.add(function () {
                return _setting3;
              });

            case 242:
              if (_setting3) {
                _context4.next = 244;
                break;
              }

              return _context4.abrupt("return");

            case 244:
              _context4.next = 246;
              return (0, _rateLimit.limitRain)(message);

            case 246:
              _limited13 = _context4.sent;
              _context4.next = 249;
              return queue.add(function () {
                return _limited13;
              });

            case 249:
              if (!_limited13) {
                _context4.next = 251;
                break;
              }

              return _context4.abrupt("return");

            case 251:
              _context4.next = 253;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3);

            case 253:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context4.next = 270;
                break;
              }

              _context4.next = 256;
              return (0, _settings.discordSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 256:
              _setting4 = _context4.sent;
              _context4.next = 259;
              return queue.add(function () {
                return _setting4;
              });

            case 259:
              if (_setting4) {
                _context4.next = 261;
                break;
              }

              return _context4.abrupt("return");

            case 261:
              _context4.next = 263;
              return (0, _rateLimit.limitRain)(message);

            case 263:
              _limited14 = _context4.sent;
              _context4.next = 266;
              return queue.add(function () {
                return _limited14;
              });

            case 266:
              if (!_limited14) {
                _context4.next = 268;
                break;
              }

              return _context4.abrupt("return");

            case 268:
              _context4.next = 270;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4);

            case 270:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context4.next = 287;
                break;
              }

              _context4.next = 273;
              return (0, _settings.discordSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 273:
              _setting5 = _context4.sent;
              _context4.next = 276;
              return queue.add(function () {
                return _setting5;
              });

            case 276:
              if (_setting5) {
                _context4.next = 278;
                break;
              }

              return _context4.abrupt("return");

            case 278:
              _context4.next = 280;
              return (0, _rateLimit.limitFlood)(message);

            case 280:
              _limited15 = _context4.sent;
              _context4.next = 283;
              return queue.add(function () {
                return _limited15;
              });

            case 283:
              if (!_limited15) {
                _context4.next = 285;
                break;
              }

              return _context4.abrupt("return");

            case 285:
              _context4.next = 287;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5);

            case 287:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context4.next = 304;
                break;
              }

              _context4.next = 290;
              return (0, _settings.discordSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 290:
              _setting6 = _context4.sent;
              _context4.next = 293;
              return queue.add(function () {
                return _setting6;
              });

            case 293:
              if (_setting6) {
                _context4.next = 295;
                break;
              }

              return _context4.abrupt("return");

            case 295:
              _context4.next = 297;
              return (0, _rateLimit.limitThunder)(message);

            case 297:
              _limited16 = _context4.sent;
              _context4.next = 300;
              return queue.add(function () {
                return _limited16;
              });

            case 300:
              if (!_limited16) {
                _context4.next = 302;
                break;
              }

              return _context4.abrupt("return");

            case 302:
              _context4.next = 304;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6);

            case 304:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context4.next = 321;
                break;
              }

              _context4.next = 307;
              return (0, _settings.discordSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 307:
              _setting7 = _context4.sent;
              _context4.next = 310;
              return queue.add(function () {
                return _setting7;
              });

            case 310:
              if (_setting7) {
                _context4.next = 312;
                break;
              }

              return _context4.abrupt("return");

            case 312:
              _context4.next = 314;
              return (0, _rateLimit.limitThunderStorm)(message);

            case 314:
              _limited17 = _context4.sent;
              _context4.next = 317;
              return queue.add(function () {
                return _limited17;
              });

            case 317:
              if (!_limited17) {
                _context4.next = 319;
                break;
              }

              return _context4.abrupt("return");

            case 319:
              _context4.next = 321;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7);

            case 321:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context4.next = 338;
                break;
              }

              _context4.next = 324;
              return (0, _settings.discordSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 324:
              _setting8 = _context4.sent;
              _context4.next = 327;
              return queue.add(function () {
                return _setting8;
              });

            case 327:
              if (_setting8) {
                _context4.next = 329;
                break;
              }

              return _context4.abrupt("return");

            case 329:
              _context4.next = 331;
              return (0, _rateLimit.limitHurricane)(message);

            case 331:
              _limited18 = _context4.sent;
              _context4.next = 334;
              return queue.add(function () {
                return _limited18;
              });

            case 334:
              if (!_limited18) {
                _context4.next = 336;
                break;
              }

              return _context4.abrupt("return");

            case 336:
              _context4.next = 338;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8);

            case 338:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context4.next = 355;
                break;
              }

              _context4.next = 341;
              return (0, _settings.discordSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 341:
              _setting9 = _context4.sent;
              _context4.next = 344;
              return queue.add(function () {
                return _setting9;
              });

            case 344:
              if (_setting9) {
                _context4.next = 346;
                break;
              }

              return _context4.abrupt("return");

            case 346:
              _context4.next = 348;
              return (0, _rateLimit.limitSoak)(message);

            case 348:
              _limited19 = _context4.sent;
              _context4.next = 351;
              return queue.add(function () {
                return _limited19;
              });

            case 351:
              if (!_limited19) {
                _context4.next = 353;
                break;
              }

              return _context4.abrupt("return");

            case 353:
              _context4.next = 355;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9);

            case 355:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context4.next = 372;
                break;
              }

              _context4.next = 358;
              return (0, _settings.discordSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 358:
              _setting10 = _context4.sent;
              _context4.next = 361;
              return queue.add(function () {
                return _setting10;
              });

            case 361:
              if (_setting10) {
                _context4.next = 363;
                break;
              }

              return _context4.abrupt("return");

            case 363:
              _context4.next = 365;
              return (0, _rateLimit.limitSleet)(message);

            case 365:
              _limited20 = _context4.sent;
              _context4.next = 368;
              return queue.add(function () {
                return _limited20;
              });

            case 368:
              if (!_limited20) {
                _context4.next = 370;
                break;
              }

              return _context4.abrupt("return");

            case 370:
              _context4.next = 372;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10);

            case 372:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context4.next = 389;
                break;
              }

              _context4.next = 375;
              return (0, _settings.discordSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 375:
              _setting11 = _context4.sent;
              _context4.next = 378;
              return queue.add(function () {
                return _setting11;
              });

            case 378:
              if (_setting11) {
                _context4.next = 380;
                break;
              }

              return _context4.abrupt("return");

            case 380:
              _context4.next = 382;
              return (0, _rateLimit.limitReactDrop)(message);

            case 382:
              _limited21 = _context4.sent;
              _context4.next = 385;
              return queue.add(function () {
                return _limited21;
              });

            case 385:
              if (!_limited21) {
                _context4.next = 387;
                break;
              }

              return _context4.abrupt("return");

            case 387:
              _context4.next = 389;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11);

            case 389:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
};

exports.discordRouter = discordRouter;