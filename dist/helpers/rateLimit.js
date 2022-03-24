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
  points: 20,
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
  points: 5,
  duration: 120
});
var rateLimiterSleet = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 20,
  duration: 120
});
var rateLimiterBalance = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 50,
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
  points: 10,
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
var rateLimiterVoiceRain = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 180,
  duration: 120
});

var myRateLimiter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(client, message, platform, title) {
    var userId, notError;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log(message);

            if (platform === 'discord') {
              userId = message.author.id;
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
              userId = message.author.id;
            }

            _context.prev = 5;

            if (!(title.toLowerCase() === 'listtransactions')) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return rateLimiterListTransactions.consume(userId, 1);

          case 9:
            return _context.abrupt("return", false);

          case 10:
            if (!(title.toLowerCase() === 'trivia')) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return rateLimiterTrivia.consume(userId, 1);

          case 13:
            return _context.abrupt("return", false);

          case 14:
            if (!(title.toLowerCase() === 'thunder')) {
              _context.next = 18;
              break;
            }

            _context.next = 17;
            return rateLimiterThunder.consume(userId, 1);

          case 17:
            return _context.abrupt("return", false);

          case 18:
            if (!(title.toLowerCase() === 'thunderstorm')) {
              _context.next = 22;
              break;
            }

            _context.next = 21;
            return rateLimiterThunderstorm.consume(userId, 1);

          case 21:
            return _context.abrupt("return", false);

          case 22:
            if (!(title.toLowerCase() === 'stats')) {
              _context.next = 26;
              break;
            }

            _context.next = 25;
            return rateLimiterStats.consume(userId, 1);

          case 25:
            return _context.abrupt("return", false);

          case 26:
            if (!(title.toLowerCase() === 'leaderboard')) {
              _context.next = 30;
              break;
            }

            _context.next = 29;
            return rateLimiterLeaderboard.consume(userId, 1);

          case 29:
            return _context.abrupt("return", false);

          case 30:
            if (!(title.toLowerCase() === 'publicstats')) {
              _context.next = 34;
              break;
            }

            _context.next = 33;
            return rateLimiterPublicStats.consume(userId, 1);

          case 33:
            return _context.abrupt("return", false);

          case 34:
            if (!(title.toLowerCase() === 'faucet')) {
              _context.next = 38;
              break;
            }

            _context.next = 37;
            return rateLimiterFaucet.consume(userId, 1);

          case 37:
            return _context.abrupt("return", false);

          case 38:
            if (!(title.toLowerCase() === 'deposit')) {
              _context.next = 42;
              break;
            }

            _context.next = 41;
            return rateLimiterDeposit.consume(userId, 1);

          case 41:
            return _context.abrupt("return", false);

          case 42:
            if (!(title.toLowerCase() === 'balance')) {
              _context.next = 46;
              break;
            }

            _context.next = 45;
            return rateLimiterBalance.consume(userId, 1);

          case 45:
            return _context.abrupt("return", false);

          case 46:
            if (!(title.toLowerCase() === 'price')) {
              _context.next = 50;
              break;
            }

            _context.next = 49;
            return rateLimiterPrice.consume(userId, 1);

          case 49:
            return _context.abrupt("return", false);

          case 50:
            if (!(title.toLowerCase() === 'tip')) {
              _context.next = 54;
              break;
            }

            _context.next = 53;
            return rateLimiterTip.consume(userId, 1);

          case 53:
            return _context.abrupt("return", false);

          case 54:
            if (!(title.toLowerCase() === 'withdraw')) {
              _context.next = 58;
              break;
            }

            _context.next = 57;
            return rateLimiterWithdraw.consume(userId, 1);

          case 57:
            return _context.abrupt("return", false);

          case 58:
            if (!(title.toLowerCase() === 'help')) {
              _context.next = 62;
              break;
            }

            _context.next = 61;
            return rateLimiterHelp.consume(userId, 1);

          case 61:
            return _context.abrupt("return", false);

          case 62:
            if (!(title.toLowerCase() === 'info')) {
              _context.next = 66;
              break;
            }

            _context.next = 65;
            return rateLimiterInfo.consume(userId, 1);

          case 65:
            return _context.abrupt("return", false);

          case 66:
            if (!(title.toLowerCase() === 'rain')) {
              _context.next = 70;
              break;
            }

            _context.next = 69;
            return rateLimiterRain.consume(userId, 1);

          case 69:
            return _context.abrupt("return", false);

          case 70:
            if (!(title.toLowerCase() === 'soak')) {
              _context.next = 74;
              break;
            }

            _context.next = 73;
            return rateLimiterSoak.consume(userId, 1);

          case 73:
            return _context.abrupt("return", false);

          case 74:
            if (!(title.toLowerCase() === 'flood')) {
              _context.next = 78;
              break;
            }

            _context.next = 77;
            return rateLimiterFlood.consume(userId, 1);

          case 77:
            return _context.abrupt("return", false);

          case 78:
            if (!(title.toLowerCase() === 'hurricane')) {
              _context.next = 82;
              break;
            }

            _context.next = 81;
            return rateLimiterHurricane.consume(userId, 1);

          case 81:
            return _context.abrupt("return", false);

          case 82:
            if (!(title.toLowerCase() === 'ignoreme')) {
              _context.next = 86;
              break;
            }

            _context.next = 85;
            return rateLimiterIgnoreMe.consume(userId, 1);

          case 85:
            return _context.abrupt("return", false);

          case 86:
            if (!(title.toLowerCase() === 'sleet')) {
              _context.next = 90;
              break;
            }

            _context.next = 89;
            return rateLimiterSleet.consume(userId, 1);

          case 89:
            return _context.abrupt("return", false);

          case 90:
            if (!(title.toLowerCase() === 'reactdrop')) {
              _context.next = 94;
              break;
            }

            _context.next = 93;
            return rateLimiterReactdrop.consume(userId, 1);

          case 93:
            return _context.abrupt("return", false);

          case 94:
            if (!(title.toLowerCase() === 'fees')) {
              _context.next = 98;
              break;
            }

            _context.next = 97;
            return rateLimiterFees.consume(userId, 1);

          case 97:
            return _context.abrupt("return", false);

          case 98:
            if (!(title.toLowerCase() === 'voicerain')) {
              _context.next = 102;
              break;
            }

            _context.next = 101;
            return rateLimiterVoiceRain.consume(userId, 1);

          case 101:
            return _context.abrupt("return", false);

          case 102:
            throw new Error("no Rate limiter could be reached");

          case 105:
            _context.prev = 105;
            _context.t0 = _context["catch"](5);
            _context.prev = 107;
            _context.next = 110;
            return errorConsumer.consume(userId, 1);

          case 110:
            notError = _context.sent;

            if (!(notError.remainingPoints > 0)) {
              _context.next = 121;
              break;
            }

            if (!(platform === 'discord')) {
              _context.next = 115;
              break;
            }

            _context.next = 115;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, title)]
            });

          case 115:
            if (!(platform === 'telegram')) {
              _context.next = 118;
              break;
            }

            _context.next = 118;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, title)]
            });

          case 118:
            if (!(platform === 'matrix')) {
              _context.next = 121;
              break;
            }

            _context.next = 121;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, title)]
            });

          case 121:
            return _context.abrupt("return", true);

          case 124:
            _context.prev = 124;
            _context.t1 = _context["catch"](107);
            return _context.abrupt("return", true);

          case 127:
            _context.next = 133;
            break;

          case 129:
            _context.prev = 129;
            _context.t2 = _context["catch"](0);
            console.log(_context.t2);
            return _context.abrupt("return", true);

          case 133:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 129], [5, 105], [107, 124]]);
  }));

  return function myRateLimiter(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.myRateLimiter = myRateLimiter;