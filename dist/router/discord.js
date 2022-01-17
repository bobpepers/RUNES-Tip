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
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, faucetSetting, maintenance, walletExists, preFilteredMessageDiscord, filteredMessageDiscord, limited, task, _limited, _task, _limited2, _task2, _limited3, _task3, _limited4, _task4, _limited5, _task5, _limited6, _task6, _limited7, _task7, _limited8, _task8, _limited9, _task9, setting, _limited10, _task10, _limited11, _task11, _setting, _limited12, _setting2, _limited13, AmountPosition, AmountPositionEnded, _setting3, _limited14, _setting4, _limited15, _setting5, _limited16, _setting6, _limited17, _setting7, _limited18, _setting8, _limited19, _setting9, _limited20, _setting10, _limited21, _setting11, _limited22;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (message.author.bot) {
                _context3.next = 37;
                break;
              }

              _context3.next = 3;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 3:
              maintenance = _context3.sent;
              _context3.next = 6;
              return queue.add(function () {
                return maintenance;
              });

            case 6:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return");

            case 8:
              _context3.next = 10;
              return (0, _user.createUpdateDiscordUser)(message);

            case 10:
              walletExists = _context3.sent;
              _context3.next = 13;
              return queue.add(function () {
                return walletExists;
              });

            case 13:
              _context3.next = 15;
              return (0, _group.updateDiscordGroup)(discordClient, message);

            case 15:
              groupTask = _context3.sent;
              _context3.next = 18;
              return queue.add(function () {
                return groupTask;
              });

            case 18:
              groupTaskId = groupTask && groupTask.id;
              _context3.next = 21;
              return (0, _channel.updateDiscordChannel)(discordClient, message, groupTask);

            case 21:
              channelTask = _context3.sent;
              _context3.next = 24;
              return queue.add(function () {
                return channelTask;
              });

            case 24:
              channelTaskId = channelTask && channelTask.id;
              _context3.next = 27;
              return (0, _user.updateDiscordLastSeen)(discordClient, message);

            case 27:
              lastSeenDiscordTask = _context3.sent;
              _context3.next = 30;
              return queue.add(function () {
                return lastSeenDiscordTask;
              });

            case 30:
              _context3.next = 32;
              return (0, _settings.discordwaterFaucetSettings)(groupTaskId, channelTaskId);

            case 32:
              faucetSetting = _context3.sent;
              _context3.next = 35;
              return queue.add(function () {
                return faucetSetting;
              });

            case 35:
              if (faucetSetting) {
                _context3.next = 37;
                break;
              }

              return _context3.abrupt("return");

            case 37:
              if (!(!message.content.startsWith(settings.bot.command.discord) || message.author.bot)) {
                _context3.next = 39;
                break;
              }

              return _context3.abrupt("return");

            case 39:
              if (!message.content.startsWith(settings.bot.command.discord)) {
                _context3.next = 52;
                break;
              }

              if (!(groupTask && groupTask.banned)) {
                _context3.next = 44;
                break;
              }

              _context3.next = 43;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              });

            case 43:
              return _context3.abrupt("return");

            case 44:
              if (!(channelTask && channelTask.banned)) {
                _context3.next = 48;
                break;
              }

              _context3.next = 47;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              });

            case 47:
              return _context3.abrupt("return");

            case 48:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context3.next = 52;
                break;
              }

              _context3.next = 51;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              });

            case 51:
              return _context3.abrupt("return");

            case 52:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context3.next = 67;
                break;
              }

              _context3.next = 57;
              return (0, _rateLimit.limitHelp)(message);

            case 57:
              limited = _context3.sent;
              _context3.next = 60;
              return queue.add(function () {
                return limited;
              });

            case 60:
              if (!limited) {
                _context3.next = 62;
                break;
              }

              return _context3.abrupt("return");

            case 62:
              _context3.next = 64;
              return (0, _help.discordHelp)(message, io);

            case 64:
              task = _context3.sent;
              _context3.next = 67;
              return queue.add(function () {
                return task;
              });

            case 67:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context3.next = 80;
                break;
              }

              _context3.next = 70;
              return (0, _rateLimit.limitHelp)(message);

            case 70:
              _limited = _context3.sent;
              _context3.next = 73;
              return queue.add(function () {
                return _limited;
              });

            case 73:
              if (!_limited) {
                _context3.next = 75;
                break;
              }

              return _context3.abrupt("return");

            case 75:
              _context3.next = 77;
              return (0, _help.discordHelp)(message, io);

            case 77:
              _task = _context3.sent;
              _context3.next = 80;
              return queue.add(function () {
                return _task;
              });

            case 80:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'fees')) {
                _context3.next = 93;
                break;
              }

              _context3.next = 83;
              return (0, _rateLimit.limitHelp)(message);

            case 83:
              _limited2 = _context3.sent;
              _context3.next = 86;
              return queue.add(function () {
                return _limited2;
              });

            case 86:
              if (!_limited2) {
                _context3.next = 88;
                break;
              }

              return _context3.abrupt("return");

            case 88:
              _context3.next = 90;
              return (0, _fees.fetchFeeSchedule)(message, io, groupTaskId, channelTaskId);

            case 90:
              _task2 = _context3.sent;
              _context3.next = 93;
              return queue.add(function () {
                return _task2;
              });

            case 93:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'stats')) {
                _context3.next = 106;
                break;
              }

              _context3.next = 96;
              return (0, _rateLimit.limitStats)(message);

            case 96:
              _limited3 = _context3.sent;
              _context3.next = 99;
              return queue.add(function () {
                return _limited3;
              });

            case 99:
              if (!_limited3) {
                _context3.next = 101;
                break;
              }

              return _context3.abrupt("return");

            case 101:
              _context3.next = 103;
              return (0, _stats.discordStats)(message, filteredMessageDiscord, io, groupTask, channelTask);

            case 103:
              _task3 = _context3.sent;
              _context3.next = 106;
              return queue.add(function () {
                return _task3;
              });

            case 106:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context3.next = 119;
                break;
              }

              _context3.next = 109;
              return (0, _rateLimit.limitLeaderboard)(message);

            case 109:
              _limited4 = _context3.sent;
              _context3.next = 112;
              return queue.add(function () {
                return _limited4;
              });

            case 112:
              if (!_limited4) {
                _context3.next = 114;
                break;
              }

              return _context3.abrupt("return");

            case 114:
              _context3.next = 116;
              return (0, _leaderboard.discordLeaderboard)(message, io);

            case 116:
              _task4 = _context3.sent;
              _context3.next = 119;
              return queue.add(function () {
                return _task4;
              });

            case 119:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context3.next = 132;
                break;
              }

              _context3.next = 122;
              return (0, _rateLimit.limitPublicStats)(message);

            case 122:
              _limited5 = _context3.sent;
              _context3.next = 125;
              return queue.add(function () {
                return _limited5;
              });

            case 125:
              if (!_limited5) {
                _context3.next = 127;
                break;
              }

              return _context3.abrupt("return");

            case 127:
              _context3.next = 129;
              return (0, _publicstats.discordPublicStats)(message, io);

            case 129:
              _task5 = _context3.sent;
              _context3.next = 132;
              return queue.add(function () {
                return _task5;
              });

            case 132:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context3.next = 145;
                break;
              }

              _context3.next = 135;
              return (0, _rateLimit.limitInfo)(message);

            case 135:
              _limited6 = _context3.sent;
              _context3.next = 138;
              return queue.add(function () {
                return _limited6;
              });

            case 138:
              if (!_limited6) {
                _context3.next = 140;
                break;
              }

              return _context3.abrupt("return");

            case 140:
              _context3.next = 142;
              return (0, _info.discordCoinInfo)(message, io);

            case 142:
              _task6 = _context3.sent;
              _context3.next = 145;
              return queue.add(function () {
                return _task6;
              });

            case 145:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context3.next = 158;
                break;
              }

              _context3.next = 148;
              return (0, _rateLimit.limitIgnoreMe)(message);

            case 148:
              _limited7 = _context3.sent;
              _context3.next = 151;
              return queue.add(function () {
                return _limited7;
              });

            case 151:
              if (!_limited7) {
                _context3.next = 153;
                break;
              }

              return _context3.abrupt("return");

            case 153:
              _context3.next = 155;
              return (0, _ignore.setIgnoreMe)(message, io);

            case 155:
              _task7 = _context3.sent;
              _context3.next = 158;
              return queue.add(function () {
                return _task7;
              });

            case 158:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context3.next = 171;
                break;
              }

              _context3.next = 161;
              return (0, _rateLimit.limitBalance)(message);

            case 161:
              _limited8 = _context3.sent;
              _context3.next = 164;
              return queue.add(function () {
                return _limited8;
              });

            case 164:
              if (!_limited8) {
                _context3.next = 166;
                break;
              }

              return _context3.abrupt("return");

            case 166:
              _context3.next = 168;
              return (0, _balance.fetchDiscordWalletBalance)(message, io);

            case 168:
              _task8 = _context3.sent;
              _context3.next = 171;
              return queue.add(function () {
                return _task8;
              });

            case 171:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'price')) {
                _context3.next = 184;
                break;
              }

              _context3.next = 174;
              return (0, _rateLimit.limitPrice)(message);

            case 174:
              _limited9 = _context3.sent;
              _context3.next = 177;
              return queue.add(function () {
                return _limited9;
              });

            case 177:
              if (!_limited9) {
                _context3.next = 179;
                break;
              }

              return _context3.abrupt("return");

            case 179:
              _context3.next = 181;
              return (0, _price.discordPrice)(message, io);

            case 181:
              _task9 = _context3.sent;
              _context3.next = 184;
              return queue.add(function () {
                return _task9;
              });

            case 184:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context3.next = 204;
                break;
              }

              _context3.next = 187;
              return (0, _settings.discordSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 187:
              setting = _context3.sent;
              _context3.next = 190;
              return queue.add(function () {
                return setting;
              });

            case 190:
              if (setting) {
                _context3.next = 192;
                break;
              }

              return _context3.abrupt("return");

            case 192:
              _context3.next = 194;
              return (0, _rateLimit.limitFaucet)(message);

            case 194:
              _limited10 = _context3.sent;
              _context3.next = 197;
              return queue.add(function () {
                return _limited10;
              });

            case 197:
              if (!_limited10) {
                _context3.next = 199;
                break;
              }

              return _context3.abrupt("return");

            case 199:
              _context3.next = 201;
              return (0, _faucet.discordFaucetClaim)(message, filteredMessageDiscord, io);

            case 201:
              _task10 = _context3.sent;
              _context3.next = 204;
              return queue.add(function () {
                return _task10;
              });

            case 204:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context3.next = 217;
                break;
              }

              _context3.next = 207;
              return (0, _rateLimit.limitDeposit)(message);

            case 207:
              _limited11 = _context3.sent;
              _context3.next = 210;
              return queue.add(function () {
                return _limited11;
              });

            case 210:
              if (!_limited11) {
                _context3.next = 212;
                break;
              }

              return _context3.abrupt("return");

            case 212:
              _context3.next = 214;
              return (0, _deposit.fetchDiscordWalletDepositAddress)(message, io);

            case 214:
              _task11 = _context3.sent;
              _context3.next = 217;
              return queue.add(function () {
                return _task11;
              });

            case 217:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context3.next = 234;
                break;
              }

              _context3.next = 220;
              return (0, _settings.discordSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 220:
              _setting = _context3.sent;
              _context3.next = 223;
              return queue.add(function () {
                return _setting;
              });

            case 223:
              if (_setting) {
                _context3.next = 225;
                break;
              }

              return _context3.abrupt("return");

            case 225:
              _context3.next = 227;
              return (0, _rateLimit.limitWithdraw)(message);

            case 227:
              _limited12 = _context3.sent;
              _context3.next = 230;
              return queue.add(function () {
                return _limited12;
              });

            case 230:
              if (!_limited12) {
                _context3.next = 232;
                break;
              }

              return _context3.abrupt("return");

            case 232:
              _context3.next = 234;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting, faucetSetting);

            case 234:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@'))) {
                _context3.next = 259;
                break;
              }

              _context3.next = 237;
              return (0, _settings.discordSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 237:
              _setting2 = _context3.sent;
              _context3.next = 240;
              return queue.add(function () {
                return _setting2;
              });

            case 240:
              if (_setting2) {
                _context3.next = 242;
                break;
              }

              return _context3.abrupt("return");

            case 242:
              _context3.next = 244;
              return (0, _rateLimit.limitTip)(message);

            case 244:
              _limited13 = _context3.sent;
              _context3.next = 247;
              return queue.add(function () {
                return _limited13;
              });

            case 247:
              if (!_limited13) {
                _context3.next = 249;
                break;
              }

              return _context3.abrupt("return");

            case 249:
              if (!(filteredMessageDiscord[1].substr(3).slice(0, -1) === discordClient.user.id)) {
                _context3.next = 254;
                break;
              }

              _context3.next = 252;
              return (0, _executeTips.executeTipFunction)(_tip.tipCoinsToDiscordFaucet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 252:
              _context3.next = 259;
              break;

            case 254:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[AmountPosition].startsWith('<@')) {
                  AmountPositionEnded = true;
                }
              }

              _context3.next = 259;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[AmountPosition], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2, faucetSetting);

            case 259:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context3.next = 276;
                break;
              }

              _context3.next = 262;
              return (0, _settings.discordSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 262:
              _setting3 = _context3.sent;
              _context3.next = 265;
              return queue.add(function () {
                return _setting3;
              });

            case 265:
              if (_setting3) {
                _context3.next = 267;
                break;
              }

              return _context3.abrupt("return");

            case 267:
              _context3.next = 269;
              return (0, _rateLimit.limitRain)(message);

            case 269:
              _limited14 = _context3.sent;
              _context3.next = 272;
              return queue.add(function () {
                return _limited14;
              });

            case 272:
              if (!_limited14) {
                _context3.next = 274;
                break;
              }

              return _context3.abrupt("return");

            case 274:
              _context3.next = 276;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3, faucetSetting);

            case 276:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context3.next = 293;
                break;
              }

              _context3.next = 279;
              return (0, _settings.discordSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 279:
              _setting4 = _context3.sent;
              _context3.next = 282;
              return queue.add(function () {
                return _setting4;
              });

            case 282:
              if (_setting4) {
                _context3.next = 284;
                break;
              }

              return _context3.abrupt("return");

            case 284:
              _context3.next = 286;
              return (0, _rateLimit.limitRain)(message);

            case 286:
              _limited15 = _context3.sent;
              _context3.next = 289;
              return queue.add(function () {
                return _limited15;
              });

            case 289:
              if (!_limited15) {
                _context3.next = 291;
                break;
              }

              return _context3.abrupt("return");

            case 291:
              _context3.next = 293;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4, faucetSetting);

            case 293:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context3.next = 310;
                break;
              }

              _context3.next = 296;
              return (0, _settings.discordSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 296:
              _setting5 = _context3.sent;
              _context3.next = 299;
              return queue.add(function () {
                return _setting5;
              });

            case 299:
              if (_setting5) {
                _context3.next = 301;
                break;
              }

              return _context3.abrupt("return");

            case 301:
              _context3.next = 303;
              return (0, _rateLimit.limitFlood)(message);

            case 303:
              _limited16 = _context3.sent;
              _context3.next = 306;
              return queue.add(function () {
                return _limited16;
              });

            case 306:
              if (!_limited16) {
                _context3.next = 308;
                break;
              }

              return _context3.abrupt("return");

            case 308:
              _context3.next = 310;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5, faucetSetting);

            case 310:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context3.next = 327;
                break;
              }

              _context3.next = 313;
              return (0, _settings.discordSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 313:
              _setting6 = _context3.sent;
              _context3.next = 316;
              return queue.add(function () {
                return _setting6;
              });

            case 316:
              if (_setting6) {
                _context3.next = 318;
                break;
              }

              return _context3.abrupt("return");

            case 318:
              _context3.next = 320;
              return (0, _rateLimit.limitThunder)(message);

            case 320:
              _limited17 = _context3.sent;
              _context3.next = 323;
              return queue.add(function () {
                return _limited17;
              });

            case 323:
              if (!_limited17) {
                _context3.next = 325;
                break;
              }

              return _context3.abrupt("return");

            case 325:
              _context3.next = 327;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6, faucetSetting);

            case 327:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context3.next = 344;
                break;
              }

              _context3.next = 330;
              return (0, _settings.discordSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 330:
              _setting7 = _context3.sent;
              _context3.next = 333;
              return queue.add(function () {
                return _setting7;
              });

            case 333:
              if (_setting7) {
                _context3.next = 335;
                break;
              }

              return _context3.abrupt("return");

            case 335:
              _context3.next = 337;
              return (0, _rateLimit.limitThunderStorm)(message);

            case 337:
              _limited18 = _context3.sent;
              _context3.next = 340;
              return queue.add(function () {
                return _limited18;
              });

            case 340:
              if (!_limited18) {
                _context3.next = 342;
                break;
              }

              return _context3.abrupt("return");

            case 342:
              _context3.next = 344;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7, faucetSetting);

            case 344:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context3.next = 361;
                break;
              }

              _context3.next = 347;
              return (0, _settings.discordSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 347:
              _setting8 = _context3.sent;
              _context3.next = 350;
              return queue.add(function () {
                return _setting8;
              });

            case 350:
              if (_setting8) {
                _context3.next = 352;
                break;
              }

              return _context3.abrupt("return");

            case 352:
              _context3.next = 354;
              return (0, _rateLimit.limitHurricane)(message);

            case 354:
              _limited19 = _context3.sent;
              _context3.next = 357;
              return queue.add(function () {
                return _limited19;
              });

            case 357:
              if (!_limited19) {
                _context3.next = 359;
                break;
              }

              return _context3.abrupt("return");

            case 359:
              _context3.next = 361;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8, faucetSetting);

            case 361:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context3.next = 378;
                break;
              }

              _context3.next = 364;
              return (0, _settings.discordSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 364:
              _setting9 = _context3.sent;
              _context3.next = 367;
              return queue.add(function () {
                return _setting9;
              });

            case 367:
              if (_setting9) {
                _context3.next = 369;
                break;
              }

              return _context3.abrupt("return");

            case 369:
              _context3.next = 371;
              return (0, _rateLimit.limitSoak)(message);

            case 371:
              _limited20 = _context3.sent;
              _context3.next = 374;
              return queue.add(function () {
                return _limited20;
              });

            case 374:
              if (!_limited20) {
                _context3.next = 376;
                break;
              }

              return _context3.abrupt("return");

            case 376:
              _context3.next = 378;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9, faucetSetting);

            case 378:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context3.next = 395;
                break;
              }

              _context3.next = 381;
              return (0, _settings.discordSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 381:
              _setting10 = _context3.sent;
              _context3.next = 384;
              return queue.add(function () {
                return _setting10;
              });

            case 384:
              if (_setting10) {
                _context3.next = 386;
                break;
              }

              return _context3.abrupt("return");

            case 386:
              _context3.next = 388;
              return (0, _rateLimit.limitSleet)(message);

            case 388:
              _limited21 = _context3.sent;
              _context3.next = 391;
              return queue.add(function () {
                return _limited21;
              });

            case 391:
              if (!_limited21) {
                _context3.next = 393;
                break;
              }

              return _context3.abrupt("return");

            case 393:
              _context3.next = 395;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10, faucetSetting);

            case 395:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context3.next = 412;
                break;
              }

              _context3.next = 398;
              return (0, _settings.discordSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 398:
              _setting11 = _context3.sent;
              _context3.next = 401;
              return queue.add(function () {
                return _setting11;
              });

            case 401:
              if (_setting11) {
                _context3.next = 403;
                break;
              }

              return _context3.abrupt("return");

            case 403:
              _context3.next = 405;
              return (0, _rateLimit.limitReactDrop)(message);

            case 405:
              _limited22 = _context3.sent;
              _context3.next = 408;
              return queue.add(function () {
                return _limited22;
              });

            case 408:
              if (!_limited22) {
                _context3.next = 410;
                break;
              }

              return _context3.abrupt("return");

            case 410:
              _context3.next = 412;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11, faucetSetting);

            case 412:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
};

exports.discordRouter = discordRouter;