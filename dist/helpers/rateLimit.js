"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myRateLimiter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var RateLimiterFlexible = _interopRequireWildcard(require("rate-limiter-flexible"));

var _discord = require("../messages/discord");

var _telegram = require("../messages/telegram");

var _matrix = require("../messages/matrix");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var errorConsumer = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 15
});
var rateLimiterReactdrop = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 4,
  // 4 messages (4 reactdrops)
  duration: 120 // every 120 seconds

});
var rateLimiterTip = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 10,
  duration: 120
});
var rateLimiterWithdraw = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 4,
  duration: 120
});
var rateLimiterHelp = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 8,
  duration: 120
});
var rateLimiterPrice = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 20,
  duration: 120
});
var rateLimiterInfo = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 20,
  duration: 120
});
var rateLimiterRain = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 50,
  duration: 120
});
var rateLimiterSoak = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 50,
  duration: 120
});
var rateLimiterFlood = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 50,
  duration: 120
});
var rateLimiterHurricane = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 50,
  duration: 120
});
var rateLimiterIgnoreMe = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 6,
  duration: 120
});
var rateLimiterSleet = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 20,
  duration: 120
});
var rateLimiterBalance = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 20,
  duration: 120
});
var rateLimiterFaucet = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 4,
  duration: 120
});
var rateLimiterDeposit = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 4,
  duration: 120
});
var rateLimiterStats = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 4,
  duration: 120
});
var rateLimiterLeaderboard = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 10,
  duration: 120
});
var rateLimiterPublicStats = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 8,
  duration: 120
});
var rateLimiterThunder = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 180,
  duration: 120
});
var rateLimiterThunderstorm = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 180,
  duration: 120
});
var rateLimiterTrivia = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 4,
  duration: 120
});
var rateLimiterListTransactions = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterFees = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterHalving = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterMining = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterVoiceRain = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 180,
  duration: 120
});

var myRateLimiter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(client, message, platform, title) {
    var userId, discordChannelId, notError, discordChannel;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (platform === 'discord') {
              if (message.user) {
                userId = message.user.id;
              } else if (message.author) {
                userId = message.author.id;
              }

              if (message.channelId) {
                discordChannelId = message.channelId;
              }
            }

            if (platform === 'telegram') {
              if (message && message.update && message.update.message && message.update.message.from && message.update.message.from.id) {
                userId = message.update.message.from.id;
              }

              if (message && message.update && message.update.callback_query && message.update.callback_query.from && message.update.callback_query.from.id) {
                userId = message.update.callback_query.from.id;
              }
            }

            if (platform === 'matrix') {
              userId = message.sender.userId;
            }

            if (userId) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", true);

          case 6:
            _context.prev = 6;

            if (!(title.toLowerCase() === 'mining')) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return rateLimiterMining.consume(userId, 1);

          case 10:
            return _context.abrupt("return", false);

          case 11:
            if (!(title.toLowerCase() === 'halving')) {
              _context.next = 15;
              break;
            }

            _context.next = 14;
            return rateLimiterHalving.consume(userId, 1);

          case 14:
            return _context.abrupt("return", false);

          case 15:
            if (!(title.toLowerCase() === 'listtransactions')) {
              _context.next = 19;
              break;
            }

            _context.next = 18;
            return rateLimiterListTransactions.consume(userId, 1);

          case 18:
            return _context.abrupt("return", false);

          case 19:
            if (!(title.toLowerCase() === 'trivia')) {
              _context.next = 23;
              break;
            }

            _context.next = 22;
            return rateLimiterTrivia.consume(userId, 1);

          case 22:
            return _context.abrupt("return", false);

          case 23:
            if (!(title.toLowerCase() === 'thunder')) {
              _context.next = 27;
              break;
            }

            _context.next = 26;
            return rateLimiterThunder.consume(userId, 1);

          case 26:
            return _context.abrupt("return", false);

          case 27:
            if (!(title.toLowerCase() === 'thunderstorm')) {
              _context.next = 31;
              break;
            }

            _context.next = 30;
            return rateLimiterThunderstorm.consume(userId, 1);

          case 30:
            return _context.abrupt("return", false);

          case 31:
            if (!(title.toLowerCase() === 'stats')) {
              _context.next = 35;
              break;
            }

            _context.next = 34;
            return rateLimiterStats.consume(userId, 1);

          case 34:
            return _context.abrupt("return", false);

          case 35:
            if (!(title.toLowerCase() === 'leaderboard')) {
              _context.next = 39;
              break;
            }

            _context.next = 38;
            return rateLimiterLeaderboard.consume(userId, 1);

          case 38:
            return _context.abrupt("return", false);

          case 39:
            if (!(title.toLowerCase() === 'publicstats')) {
              _context.next = 43;
              break;
            }

            _context.next = 42;
            return rateLimiterPublicStats.consume(userId, 1);

          case 42:
            return _context.abrupt("return", false);

          case 43:
            if (!(title.toLowerCase() === 'faucet')) {
              _context.next = 47;
              break;
            }

            _context.next = 46;
            return rateLimiterFaucet.consume(userId, 1);

          case 46:
            return _context.abrupt("return", false);

          case 47:
            if (!(title.toLowerCase() === 'deposit')) {
              _context.next = 51;
              break;
            }

            _context.next = 50;
            return rateLimiterDeposit.consume(userId, 1);

          case 50:
            return _context.abrupt("return", false);

          case 51:
            if (!(title.toLowerCase() === 'balance')) {
              _context.next = 55;
              break;
            }

            _context.next = 54;
            return rateLimiterBalance.consume(userId, 1);

          case 54:
            return _context.abrupt("return", false);

          case 55:
            if (!(title.toLowerCase() === 'price')) {
              _context.next = 59;
              break;
            }

            _context.next = 58;
            return rateLimiterPrice.consume(userId, 1);

          case 58:
            return _context.abrupt("return", false);

          case 59:
            if (!(title.toLowerCase() === 'tip')) {
              _context.next = 63;
              break;
            }

            _context.next = 62;
            return rateLimiterTip.consume(userId, 1);

          case 62:
            return _context.abrupt("return", false);

          case 63:
            if (!(title.toLowerCase() === 'withdraw')) {
              _context.next = 67;
              break;
            }

            _context.next = 66;
            return rateLimiterWithdraw.consume(userId, 1);

          case 66:
            return _context.abrupt("return", false);

          case 67:
            if (!(title.toLowerCase() === 'help')) {
              _context.next = 71;
              break;
            }

            _context.next = 70;
            return rateLimiterHelp.consume(userId, 1);

          case 70:
            return _context.abrupt("return", false);

          case 71:
            if (!(title.toLowerCase() === 'info')) {
              _context.next = 75;
              break;
            }

            _context.next = 74;
            return rateLimiterInfo.consume(userId, 1);

          case 74:
            return _context.abrupt("return", false);

          case 75:
            if (!(title.toLowerCase() === 'rain')) {
              _context.next = 79;
              break;
            }

            _context.next = 78;
            return rateLimiterRain.consume(userId, 1);

          case 78:
            return _context.abrupt("return", false);

          case 79:
            if (!(title.toLowerCase() === 'soak')) {
              _context.next = 83;
              break;
            }

            _context.next = 82;
            return rateLimiterSoak.consume(userId, 1);

          case 82:
            return _context.abrupt("return", false);

          case 83:
            if (!(title.toLowerCase() === 'flood')) {
              _context.next = 87;
              break;
            }

            _context.next = 86;
            return rateLimiterFlood.consume(userId, 1);

          case 86:
            return _context.abrupt("return", false);

          case 87:
            if (!(title.toLowerCase() === 'hurricane')) {
              _context.next = 91;
              break;
            }

            _context.next = 90;
            return rateLimiterHurricane.consume(userId, 1);

          case 90:
            return _context.abrupt("return", false);

          case 91:
            if (!(title.toLowerCase() === 'ignoreme')) {
              _context.next = 95;
              break;
            }

            _context.next = 94;
            return rateLimiterIgnoreMe.consume(userId, 1);

          case 94:
            return _context.abrupt("return", false);

          case 95:
            if (!(title.toLowerCase() === 'sleet')) {
              _context.next = 99;
              break;
            }

            _context.next = 98;
            return rateLimiterSleet.consume(userId, 1);

          case 98:
            return _context.abrupt("return", false);

          case 99:
            if (!(title.toLowerCase() === 'reactdrop')) {
              _context.next = 103;
              break;
            }

            _context.next = 102;
            return rateLimiterReactdrop.consume(userId, 1);

          case 102:
            return _context.abrupt("return", false);

          case 103:
            if (!(title.toLowerCase() === 'fees')) {
              _context.next = 107;
              break;
            }

            _context.next = 106;
            return rateLimiterFees.consume(userId, 1);

          case 106:
            return _context.abrupt("return", false);

          case 107:
            if (!(title.toLowerCase() === 'voicerain')) {
              _context.next = 111;
              break;
            }

            _context.next = 110;
            return rateLimiterVoiceRain.consume(userId, 1);

          case 110:
            return _context.abrupt("return", false);

          case 111:
            throw new Error("no Rate limiter could be reached");

          case 114:
            _context.prev = 114;
            _context.t0 = _context["catch"](6);
            _context.prev = 116;
            _context.next = 119;
            return errorConsumer.consume(userId, 1);

          case 119:
            notError = _context.sent;

            if (!(notError.remainingPoints > 0)) {
              _context.next = 139;
              break;
            }

            if (!(platform === 'discord')) {
              _context.next = 129;
              break;
            }

            console.log('send error message ratelimiter');
            _context.next = 125;
            return client.channels.fetch(discordChannelId)["catch"](function (e) {
              console.log(e);
            });

          case 125:
            discordChannel = _context.sent;

            if (!discordChannel) {
              _context.next = 129;
              break;
            }

            _context.next = 129;
            return discordChannel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(userId, title)]
            })["catch"](function (e) {
              console.log(e);
            });

          case 129:
            if (!(platform === 'telegram')) {
              _context.next = 136;
              break;
            }

            _context.t1 = message;
            _context.next = 133;
            return (0, _telegram.telegramLimitSpamMessage)(message, title);

          case 133:
            _context.t2 = _context.sent;
            _context.next = 136;
            return _context.t1.replyWithHTML.call(_context.t1, _context.t2);

          case 136:
            if (!(platform === 'matrix')) {
              _context.next = 139;
              break;
            }

            _context.next = 139;
            return client.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.matrixLimitSpamMessage)(message.sender.name, title));

          case 139:
            return _context.abrupt("return", true);

          case 142:
            _context.prev = 142;
            _context.t3 = _context["catch"](116);
            return _context.abrupt("return", true);

          case 145:
            _context.next = 150;
            break;

          case 147:
            _context.prev = 147;
            _context.t4 = _context["catch"](0);
            return _context.abrupt("return", true);

          case 150:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 147], [6, 114], [116, 142]]);
  }));

  return function myRateLimiter(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.myRateLimiter = myRateLimiter;