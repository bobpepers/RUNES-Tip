"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _pQueue = _interopRequireDefault(require("p-queue"));

var _balance = require("../controllers/discord/balance");

var _deposit = require("../controllers/discord/deposit");

var _withdraw = require("../controllers/discord/withdraw");

var _voicerain = require("../controllers/discord/voicerain");

var _rain = require("../controllers/discord/rain");

var _sleet = require("../controllers/discord/sleet");

var _flood = require("../controllers/discord/flood");

var _tip = require("../controllers/discord/tip");

var _user = require("../controllers/discord/user");

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

var _discord = require("../messages/discord");

var _stats = require("../controllers/discord/stats");

var _publicstats = require("../controllers/discord/publicstats");

var _leaderboard = require("../controllers/discord/leaderboard");

var _settings = _interopRequireDefault(require("../config/settings"));

var _settings2 = require("../controllers/discord/settings");

var _executeTips = require("../helpers/discord/executeTips");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

(0, _dotenv.config)();
var queue = new _pQueue["default"]({
  concurrency: 1
});

var discordRouter = function discordRouter(discordClient, io) {
  discordClient.on('ready', function () {
    console.log("Logged in as ".concat(discordClient.user.tag, "!"));
  });
  discordClient.on('voiceStateUpdate', /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(oldMember, newMember) {
      var groupTask, channelTask;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _group.updateDiscordGroup)(discordClient, newMember);

            case 2:
              groupTask = _context.sent;
              _context.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context.next = 7;
              return (0, _channel.updateDiscordChannel)(discordClient, newMember, groupTask);

            case 7:
              channelTask = _context.sent;
              _context.next = 10;
              return queue.add(function () {
                return channelTask;
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, maintenance, walletExists, preFilteredMessageDiscord, filteredMessageDiscord, limited, task, _limited, _task, _limited2, _task2, _limited3, _task3, _limited4, _task4, _limited5, _task5, _limited6, _task6, _limited7, _task7, setting, _limited8, _task8, _limited9, _task9, _setting, _limited10, _setting2, _limited11, AmountPosition, AmountPositionEnded, _setting3, _limited12, _setting4, _limited13, _setting5, _limited14, _setting6, _limited15, _setting7, _limited16, _setting8, _limited17, _setting9, _limited18, _setting10, _limited19, _setting11, _limited20;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (message.author.bot) {
                _context2.next = 30;
                break;
              }

              _context2.next = 3;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 3:
              maintenance = _context2.sent;
              _context2.next = 6;
              return queue.add(function () {
                return maintenance;
              });

            case 6:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return");

            case 8:
              _context2.next = 10;
              return (0, _user.createUpdateDiscordUser)(message);

            case 10:
              walletExists = _context2.sent;
              _context2.next = 13;
              return queue.add(function () {
                return walletExists;
              });

            case 13:
              _context2.next = 15;
              return (0, _group.updateDiscordGroup)(discordClient, message);

            case 15:
              groupTask = _context2.sent;
              _context2.next = 18;
              return queue.add(function () {
                return groupTask;
              });

            case 18:
              groupTaskId = groupTask && groupTask.id;
              _context2.next = 21;
              return (0, _channel.updateDiscordChannel)(discordClient, message, groupTask);

            case 21:
              channelTask = _context2.sent;
              _context2.next = 24;
              return queue.add(function () {
                return channelTask;
              });

            case 24:
              channelTaskId = channelTask && channelTask.id;
              _context2.next = 27;
              return (0, _user.updateDiscordLastSeen)(discordClient, message);

            case 27:
              lastSeenDiscordTask = _context2.sent;
              _context2.next = 30;
              return queue.add(function () {
                return lastSeenDiscordTask;
              });

            case 30:
              if (!(!message.content.startsWith(_settings["default"].bot.command.discord) || message.author.bot)) {
                _context2.next = 32;
                break;
              }

              return _context2.abrupt("return");

            case 32:
              if (!message.content.startsWith(_settings["default"].bot.command.discord)) {
                _context2.next = 45;
                break;
              }

              if (!(groupTask && groupTask.banned)) {
                _context2.next = 37;
                break;
              }

              _context2.next = 36;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              });

            case 36:
              return _context2.abrupt("return");

            case 37:
              if (!(channelTask && channelTask.banned)) {
                _context2.next = 41;
                break;
              }

              _context2.next = 40;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              });

            case 40:
              return _context2.abrupt("return");

            case 41:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context2.next = 45;
                break;
              }

              _context2.next = 44;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              });

            case 44:
              return _context2.abrupt("return");

            case 45:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord[1] === undefined)) {
                _context2.next = 60;
                break;
              }

              _context2.next = 50;
              return (0, _rateLimit.limitHelp)(message);

            case 50:
              limited = _context2.sent;
              _context2.next = 53;
              return queue.add(function () {
                return limited;
              });

            case 53:
              if (!limited) {
                _context2.next = 55;
                break;
              }

              return _context2.abrupt("return");

            case 55:
              _context2.next = 57;
              return (0, _help.discordHelp)(message, io);

            case 57:
              task = _context2.sent;
              _context2.next = 60;
              return queue.add(function () {
                return task;
              });

            case 60:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context2.next = 73;
                break;
              }

              _context2.next = 63;
              return (0, _rateLimit.limitHelp)(message);

            case 63:
              _limited = _context2.sent;
              _context2.next = 66;
              return queue.add(function () {
                return _limited;
              });

            case 66:
              if (!_limited) {
                _context2.next = 68;
                break;
              }

              return _context2.abrupt("return");

            case 68:
              _context2.next = 70;
              return (0, _help.discordHelp)(message, io);

            case 70:
              _task = _context2.sent;
              _context2.next = 73;
              return queue.add(function () {
                return _task;
              });

            case 73:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'stats')) {
                _context2.next = 86;
                break;
              }

              _context2.next = 76;
              return (0, _rateLimit.limitStats)(message);

            case 76:
              _limited2 = _context2.sent;
              _context2.next = 79;
              return queue.add(function () {
                return _limited2;
              });

            case 79:
              if (!_limited2) {
                _context2.next = 81;
                break;
              }

              return _context2.abrupt("return");

            case 81:
              _context2.next = 83;
              return (0, _stats.discordStats)(message, filteredMessageDiscord, io, groupTask, channelTask);

            case 83:
              _task2 = _context2.sent;
              _context2.next = 86;
              return queue.add(function () {
                return _task2;
              });

            case 86:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context2.next = 99;
                break;
              }

              _context2.next = 89;
              return (0, _rateLimit.limitLeaderboard)(message);

            case 89:
              _limited3 = _context2.sent;
              _context2.next = 92;
              return queue.add(function () {
                return _limited3;
              });

            case 92:
              if (!_limited3) {
                _context2.next = 94;
                break;
              }

              return _context2.abrupt("return");

            case 94:
              _context2.next = 96;
              return (0, _leaderboard.discordLeaderboard)(message, io);

            case 96:
              _task3 = _context2.sent;
              _context2.next = 99;
              return queue.add(function () {
                return _task3;
              });

            case 99:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'publicstats')) {
                _context2.next = 112;
                break;
              }

              _context2.next = 102;
              return (0, _rateLimit.limitPublicStats)(message);

            case 102:
              _limited4 = _context2.sent;
              _context2.next = 105;
              return queue.add(function () {
                return _limited4;
              });

            case 105:
              if (!_limited4) {
                _context2.next = 107;
                break;
              }

              return _context2.abrupt("return");

            case 107:
              _context2.next = 109;
              return (0, _publicstats.discordPublicStats)(message, io);

            case 109:
              _task4 = _context2.sent;
              _context2.next = 112;
              return queue.add(function () {
                return _task4;
              });

            case 112:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context2.next = 125;
                break;
              }

              _context2.next = 115;
              return (0, _rateLimit.limitInfo)(message);

            case 115:
              _limited5 = _context2.sent;
              _context2.next = 118;
              return queue.add(function () {
                return _limited5;
              });

            case 118:
              if (!_limited5) {
                _context2.next = 120;
                break;
              }

              return _context2.abrupt("return");

            case 120:
              _context2.next = 122;
              return (0, _info.discordCoinInfo)(message, io);

            case 122:
              _task5 = _context2.sent;
              _context2.next = 125;
              return queue.add(function () {
                return _task5;
              });

            case 125:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context2.next = 138;
                break;
              }

              _context2.next = 128;
              return (0, _rateLimit.limitIgnoreMe)(message);

            case 128:
              _limited6 = _context2.sent;
              _context2.next = 131;
              return queue.add(function () {
                return _limited6;
              });

            case 131:
              if (!_limited6) {
                _context2.next = 133;
                break;
              }

              return _context2.abrupt("return");

            case 133:
              _context2.next = 135;
              return (0, _ignore.setIgnoreMe)(message, io);

            case 135:
              _task6 = _context2.sent;
              _context2.next = 138;
              return queue.add(function () {
                return _task6;
              });

            case 138:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context2.next = 151;
                break;
              }

              _context2.next = 141;
              return (0, _rateLimit.limitBalance)(message);

            case 141:
              _limited7 = _context2.sent;
              _context2.next = 144;
              return queue.add(function () {
                return _limited7;
              });

            case 144:
              if (!_limited7) {
                _context2.next = 146;
                break;
              }

              return _context2.abrupt("return");

            case 146:
              _context2.next = 148;
              return (0, _balance.fetchDiscordWalletBalance)(message, io);

            case 148:
              _task7 = _context2.sent;
              _context2.next = 151;
              return queue.add(function () {
                return _task7;
              });

            case 151:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context2.next = 171;
                break;
              }

              _context2.next = 154;
              return (0, _settings2.discordSettings)(message, 'faucet', groupTaskId, channelTaskId);

            case 154:
              setting = _context2.sent;
              _context2.next = 157;
              return queue.add(function () {
                return setting;
              });

            case 157:
              if (setting) {
                _context2.next = 159;
                break;
              }

              return _context2.abrupt("return");

            case 159:
              _context2.next = 161;
              return (0, _rateLimit.limitFaucet)(message);

            case 161:
              _limited8 = _context2.sent;
              _context2.next = 164;
              return queue.add(function () {
                return _limited8;
              });

            case 164:
              if (!_limited8) {
                _context2.next = 166;
                break;
              }

              return _context2.abrupt("return");

            case 166:
              _context2.next = 168;
              return (0, _faucet.discordFaucetClaim)(message, io, groupTask, channelTask);

            case 168:
              _task8 = _context2.sent;
              _context2.next = 171;
              return queue.add(function () {
                return _task8;
              });

            case 171:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context2.next = 184;
                break;
              }

              _context2.next = 174;
              return (0, _rateLimit.limitDeposit)(message);

            case 174:
              _limited9 = _context2.sent;
              _context2.next = 177;
              return queue.add(function () {
                return _limited9;
              });

            case 177:
              if (!_limited9) {
                _context2.next = 179;
                break;
              }

              return _context2.abrupt("return");

            case 179:
              _context2.next = 181;
              return (0, _deposit.fetchDiscordWalletDepositAddress)(message, io);

            case 181:
              _task9 = _context2.sent;
              _context2.next = 184;
              return queue.add(function () {
                return _task9;
              });

            case 184:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context2.next = 201;
                break;
              }

              _context2.next = 187;
              return (0, _settings2.discordSettings)(message, 'withdraw', groupTaskId, channelTaskId);

            case 187:
              _setting = _context2.sent;
              _context2.next = 190;
              return queue.add(function () {
                return _setting;
              });

            case 190:
              if (_setting) {
                _context2.next = 192;
                break;
              }

              return _context2.abrupt("return");

            case 192:
              _context2.next = 194;
              return (0, _rateLimit.limitWithdraw)(message);

            case 194:
              _limited10 = _context2.sent;
              _context2.next = 197;
              return queue.add(function () {
                return _limited10;
              });

            case 197:
              if (!_limited10) {
                _context2.next = 199;
                break;
              }

              return _context2.abrupt("return");

            case 199:
              _context2.next = 201;
              return (0, _executeTips.executeTipFunction)(_withdraw.withdrawDiscordCreate, queue, filteredMessageDiscord[3], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting);

            case 201:
              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@!'))) {
                _context2.next = 221;
                break;
              }

              _context2.next = 204;
              return (0, _settings2.discordSettings)(message, 'tip', groupTaskId, channelTaskId);

            case 204:
              _setting2 = _context2.sent;
              _context2.next = 207;
              return queue.add(function () {
                return _setting2;
              });

            case 207:
              if (_setting2) {
                _context2.next = 209;
                break;
              }

              return _context2.abrupt("return");

            case 209:
              _context2.next = 211;
              return (0, _rateLimit.limitTip)(message);

            case 211:
              _limited11 = _context2.sent;
              _context2.next = 214;
              return queue.add(function () {
                return _limited11;
              });

            case 214:
              if (!_limited11) {
                _context2.next = 216;
                break;
              }

              return _context2.abrupt("return");

            case 216:
              AmountPosition = 1;
              AmountPositionEnded = false;

              while (!AmountPositionEnded) {
                AmountPosition += 1;

                if (!filteredMessageDiscord[AmountPosition].startsWith('<@!')) {
                  AmountPositionEnded = true;
                }
              } //


              _context2.next = 221;
              return (0, _executeTips.executeTipFunction)(_tip.tipRunesToDiscordUser, queue, filteredMessageDiscord[AmountPosition], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting2);

            case 221:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'voicerain')) {
                _context2.next = 238;
                break;
              }

              _context2.next = 224;
              return (0, _settings2.discordSettings)(message, 'voicerain', groupTaskId, channelTaskId);

            case 224:
              _setting3 = _context2.sent;
              _context2.next = 227;
              return queue.add(function () {
                return _setting3;
              });

            case 227:
              if (_setting3) {
                _context2.next = 229;
                break;
              }

              return _context2.abrupt("return");

            case 229:
              _context2.next = 231;
              return (0, _rateLimit.limitRain)(message);

            case 231:
              _limited12 = _context2.sent;
              _context2.next = 234;
              return queue.add(function () {
                return _limited12;
              });

            case 234:
              if (!_limited12) {
                _context2.next = 236;
                break;
              }

              return _context2.abrupt("return");

            case 236:
              _context2.next = 238;
              return (0, _executeTips.executeTipFunction)(_voicerain.discordVoiceRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting3);

            case 238:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context2.next = 255;
                break;
              }

              _context2.next = 241;
              return (0, _settings2.discordSettings)(message, 'rain', groupTaskId, channelTaskId);

            case 241:
              _setting4 = _context2.sent;
              _context2.next = 244;
              return queue.add(function () {
                return _setting4;
              });

            case 244:
              if (_setting4) {
                _context2.next = 246;
                break;
              }

              return _context2.abrupt("return");

            case 246:
              _context2.next = 248;
              return (0, _rateLimit.limitRain)(message);

            case 248:
              _limited13 = _context2.sent;
              _context2.next = 251;
              return queue.add(function () {
                return _limited13;
              });

            case 251:
              if (!_limited13) {
                _context2.next = 253;
                break;
              }

              return _context2.abrupt("return");

            case 253:
              _context2.next = 255;
              return (0, _executeTips.executeTipFunction)(_rain.discordRain, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting4);

            case 255:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context2.next = 272;
                break;
              }

              _context2.next = 258;
              return (0, _settings2.discordSettings)(message, 'flood', groupTaskId, channelTaskId);

            case 258:
              _setting5 = _context2.sent;
              _context2.next = 261;
              return queue.add(function () {
                return _setting5;
              });

            case 261:
              if (_setting5) {
                _context2.next = 263;
                break;
              }

              return _context2.abrupt("return");

            case 263:
              _context2.next = 265;
              return (0, _rateLimit.limitFlood)(message);

            case 265:
              _limited14 = _context2.sent;
              _context2.next = 268;
              return queue.add(function () {
                return _limited14;
              });

            case 268:
              if (!_limited14) {
                _context2.next = 270;
                break;
              }

              return _context2.abrupt("return");

            case 270:
              _context2.next = 272;
              return (0, _executeTips.executeTipFunction)(_flood.discordFlood, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting5);

            case 272:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context2.next = 289;
                break;
              }

              _context2.next = 275;
              return (0, _settings2.discordSettings)(message, 'thunder', groupTaskId, channelTaskId);

            case 275:
              _setting6 = _context2.sent;
              _context2.next = 278;
              return queue.add(function () {
                return _setting6;
              });

            case 278:
              if (_setting6) {
                _context2.next = 280;
                break;
              }

              return _context2.abrupt("return");

            case 280:
              _context2.next = 282;
              return (0, _rateLimit.limitThunder)(message);

            case 282:
              _limited15 = _context2.sent;
              _context2.next = 285;
              return queue.add(function () {
                return _limited15;
              });

            case 285:
              if (!_limited15) {
                _context2.next = 287;
                break;
              }

              return _context2.abrupt("return");

            case 287:
              _context2.next = 289;
              return (0, _executeTips.executeTipFunction)(_thunder.discordThunder, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting6);

            case 289:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context2.next = 306;
                break;
              }

              _context2.next = 292;
              return (0, _settings2.discordSettings)(message, 'thunderstorm', groupTaskId, channelTaskId);

            case 292:
              _setting7 = _context2.sent;
              _context2.next = 295;
              return queue.add(function () {
                return _setting7;
              });

            case 295:
              if (_setting7) {
                _context2.next = 297;
                break;
              }

              return _context2.abrupt("return");

            case 297:
              _context2.next = 299;
              return (0, _rateLimit.limitThunderStorm)(message);

            case 299:
              _limited16 = _context2.sent;
              _context2.next = 302;
              return queue.add(function () {
                return _limited16;
              });

            case 302:
              if (!_limited16) {
                _context2.next = 304;
                break;
              }

              return _context2.abrupt("return");

            case 304:
              _context2.next = 306;
              return (0, _executeTips.executeTipFunction)(_thunderstorm.discordThunderStorm, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting7);

            case 306:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context2.next = 323;
                break;
              }

              _context2.next = 309;
              return (0, _settings2.discordSettings)(message, 'hurricane', groupTaskId, channelTaskId);

            case 309:
              _setting8 = _context2.sent;
              _context2.next = 312;
              return queue.add(function () {
                return _setting8;
              });

            case 312:
              if (_setting8) {
                _context2.next = 314;
                break;
              }

              return _context2.abrupt("return");

            case 314:
              _context2.next = 316;
              return (0, _rateLimit.limitHurricane)(message);

            case 316:
              _limited17 = _context2.sent;
              _context2.next = 319;
              return queue.add(function () {
                return _limited17;
              });

            case 319:
              if (!_limited17) {
                _context2.next = 321;
                break;
              }

              return _context2.abrupt("return");

            case 321:
              _context2.next = 323;
              return (0, _executeTips.executeTipFunction)(_hurricane.discordHurricane, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting8);

            case 323:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context2.next = 340;
                break;
              }

              _context2.next = 326;
              return (0, _settings2.discordSettings)(message, 'soak', groupTaskId, channelTaskId);

            case 326:
              _setting9 = _context2.sent;
              _context2.next = 329;
              return queue.add(function () {
                return _setting9;
              });

            case 329:
              if (_setting9) {
                _context2.next = 331;
                break;
              }

              return _context2.abrupt("return");

            case 331:
              _context2.next = 333;
              return (0, _rateLimit.limitSoak)(message);

            case 333:
              _limited18 = _context2.sent;
              _context2.next = 336;
              return queue.add(function () {
                return _limited18;
              });

            case 336:
              if (!_limited18) {
                _context2.next = 338;
                break;
              }

              return _context2.abrupt("return");

            case 338:
              _context2.next = 340;
              return (0, _executeTips.executeTipFunction)(_soak.discordSoak, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting9);

            case 340:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context2.next = 357;
                break;
              }

              _context2.next = 343;
              return (0, _settings2.discordSettings)(message, 'sleet', groupTaskId, channelTaskId);

            case 343:
              _setting10 = _context2.sent;
              _context2.next = 346;
              return queue.add(function () {
                return _setting10;
              });

            case 346:
              if (_setting10) {
                _context2.next = 348;
                break;
              }

              return _context2.abrupt("return");

            case 348:
              _context2.next = 350;
              return (0, _rateLimit.limitSleet)(message);

            case 350:
              _limited19 = _context2.sent;
              _context2.next = 353;
              return queue.add(function () {
                return _limited19;
              });

            case 353:
              if (!_limited19) {
                _context2.next = 355;
                break;
              }

              return _context2.abrupt("return");

            case 355:
              _context2.next = 357;
              return (0, _executeTips.executeTipFunction)(_sleet.discordSleet, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting10);

            case 357:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context2.next = 374;
                break;
              }

              _context2.next = 360;
              return (0, _settings2.discordSettings)(message, 'reactdrop', groupTaskId, channelTaskId);

            case 360:
              _setting11 = _context2.sent;
              _context2.next = 363;
              return queue.add(function () {
                return _setting11;
              });

            case 363:
              if (_setting11) {
                _context2.next = 365;
                break;
              }

              return _context2.abrupt("return");

            case 365:
              _context2.next = 367;
              return (0, _rateLimit.limitReactDrop)(message);

            case 367:
              _limited20 = _context2.sent;
              _context2.next = 370;
              return queue.add(function () {
                return _limited20;
              });

            case 370:
              if (!_limited20) {
                _context2.next = 372;
                break;
              }

              return _context2.abrupt("return");

            case 372:
              _context2.next = 374;
              return (0, _executeTips.executeTipFunction)(_reactdrop.discordReactDrop, queue, filteredMessageDiscord[2], discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, _setting11);

            case 374:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }());
};

exports.discordRouter = discordRouter;