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

            if (platform === 'discord') {
              if (message.user) {
                userId = message.user.id;
              } else if (message.author) {
                userId = message.author.id;
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
              userId = message.author.id;
            }

            _context.prev = 4;

            if (!(title.toLowerCase() === 'listtransactions')) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return rateLimiterListTransactions.consume(userId, 1);

          case 8:
            return _context.abrupt("return", false);

          case 9:
            if (!(title.toLowerCase() === 'trivia')) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return rateLimiterTrivia.consume(userId, 1);

          case 12:
            return _context.abrupt("return", false);

          case 13:
            if (!(title.toLowerCase() === 'thunder')) {
              _context.next = 17;
              break;
            }

            _context.next = 16;
            return rateLimiterThunder.consume(userId, 1);

          case 16:
            return _context.abrupt("return", false);

          case 17:
            if (!(title.toLowerCase() === 'thunderstorm')) {
              _context.next = 21;
              break;
            }

            _context.next = 20;
            return rateLimiterThunderstorm.consume(userId, 1);

          case 20:
            return _context.abrupt("return", false);

          case 21:
            if (!(title.toLowerCase() === 'stats')) {
              _context.next = 25;
              break;
            }

            _context.next = 24;
            return rateLimiterStats.consume(userId, 1);

          case 24:
            return _context.abrupt("return", false);

          case 25:
            if (!(title.toLowerCase() === 'leaderboard')) {
              _context.next = 29;
              break;
            }

            _context.next = 28;
            return rateLimiterLeaderboard.consume(userId, 1);

          case 28:
            return _context.abrupt("return", false);

          case 29:
            if (!(title.toLowerCase() === 'publicstats')) {
              _context.next = 33;
              break;
            }

            _context.next = 32;
            return rateLimiterPublicStats.consume(userId, 1);

          case 32:
            return _context.abrupt("return", false);

          case 33:
            if (!(title.toLowerCase() === 'faucet')) {
              _context.next = 37;
              break;
            }

            _context.next = 36;
            return rateLimiterFaucet.consume(userId, 1);

          case 36:
            return _context.abrupt("return", false);

          case 37:
            if (!(title.toLowerCase() === 'deposit')) {
              _context.next = 41;
              break;
            }

            _context.next = 40;
            return rateLimiterDeposit.consume(userId, 1);

          case 40:
            return _context.abrupt("return", false);

          case 41:
            if (!(title.toLowerCase() === 'balance')) {
              _context.next = 45;
              break;
            }

            _context.next = 44;
            return rateLimiterBalance.consume(userId, 1);

          case 44:
            return _context.abrupt("return", false);

          case 45:
            if (!(title.toLowerCase() === 'price')) {
              _context.next = 49;
              break;
            }

            _context.next = 48;
            return rateLimiterPrice.consume(userId, 1);

          case 48:
            return _context.abrupt("return", false);

          case 49:
            if (!(title.toLowerCase() === 'tip')) {
              _context.next = 53;
              break;
            }

            _context.next = 52;
            return rateLimiterTip.consume(userId, 1);

          case 52:
            return _context.abrupt("return", false);

          case 53:
            if (!(title.toLowerCase() === 'withdraw')) {
              _context.next = 57;
              break;
            }

            _context.next = 56;
            return rateLimiterWithdraw.consume(userId, 1);

          case 56:
            return _context.abrupt("return", false);

          case 57:
            if (!(title.toLowerCase() === 'help')) {
              _context.next = 61;
              break;
            }

            _context.next = 60;
            return rateLimiterHelp.consume(userId, 1);

          case 60:
            return _context.abrupt("return", false);

          case 61:
            if (!(title.toLowerCase() === 'info')) {
              _context.next = 65;
              break;
            }

            _context.next = 64;
            return rateLimiterInfo.consume(userId, 1);

          case 64:
            return _context.abrupt("return", false);

          case 65:
            if (!(title.toLowerCase() === 'rain')) {
              _context.next = 69;
              break;
            }

            _context.next = 68;
            return rateLimiterRain.consume(userId, 1);

          case 68:
            return _context.abrupt("return", false);

          case 69:
            if (!(title.toLowerCase() === 'soak')) {
              _context.next = 73;
              break;
            }

            _context.next = 72;
            return rateLimiterSoak.consume(userId, 1);

          case 72:
            return _context.abrupt("return", false);

          case 73:
            if (!(title.toLowerCase() === 'flood')) {
              _context.next = 77;
              break;
            }

            _context.next = 76;
            return rateLimiterFlood.consume(userId, 1);

          case 76:
            return _context.abrupt("return", false);

          case 77:
            if (!(title.toLowerCase() === 'hurricane')) {
              _context.next = 81;
              break;
            }

            _context.next = 80;
            return rateLimiterHurricane.consume(userId, 1);

          case 80:
            return _context.abrupt("return", false);

          case 81:
            if (!(title.toLowerCase() === 'ignoreme')) {
              _context.next = 85;
              break;
            }

            _context.next = 84;
            return rateLimiterIgnoreMe.consume(userId, 1);

          case 84:
            return _context.abrupt("return", false);

          case 85:
            if (!(title.toLowerCase() === 'sleet')) {
              _context.next = 89;
              break;
            }

            _context.next = 88;
            return rateLimiterSleet.consume(userId, 1);

          case 88:
            return _context.abrupt("return", false);

          case 89:
            if (!(title.toLowerCase() === 'reactdrop')) {
              _context.next = 93;
              break;
            }

            _context.next = 92;
            return rateLimiterReactdrop.consume(userId, 1);

          case 92:
            return _context.abrupt("return", false);

          case 93:
            if (!(title.toLowerCase() === 'fees')) {
              _context.next = 97;
              break;
            }

            _context.next = 96;
            return rateLimiterFees.consume(userId, 1);

          case 96:
            return _context.abrupt("return", false);

          case 97:
            if (!(title.toLowerCase() === 'voicerain')) {
              _context.next = 101;
              break;
            }

            _context.next = 100;
            return rateLimiterVoiceRain.consume(userId, 1);

          case 100:
            return _context.abrupt("return", false);

          case 101:
            throw new Error("no Rate limiter could be reached");

          case 104:
            _context.prev = 104;
            _context.t0 = _context["catch"](4);
            _context.prev = 106;
            _context.next = 109;
            return errorConsumer.consume(userId, 1);

          case 109:
            notError = _context.sent;

            if (!(notError.remainingPoints > 0)) {
              _context.next = 122;
              break;
            }

            if (!(platform === 'discord')) {
              _context.next = 116;
              break;
            }

            console.log('send error message ratelimiter');
            _context.next = 115;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, title)]
            });

          case 115:
            console.log('after send reply');

          case 116:
            if (!(platform === 'telegram')) {
              _context.next = 119;
              break;
            }

            _context.next = 119;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, title)]
            });

          case 119:
            if (!(platform === 'matrix')) {
              _context.next = 122;
              break;
            }

            _context.next = 122;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, title)]
            });

          case 122:
            return _context.abrupt("return", true);

          case 125:
            _context.prev = 125;
            _context.t1 = _context["catch"](106);
            return _context.abrupt("return", true);

          case 128:
            _context.next = 135;
            break;

          case 130:
            _context.prev = 130;
            _context.t2 = _context["catch"](0);
            console.log(_context.t2);
            console.log('catching the last error');
            return _context.abrupt("return", true);

          case 135:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 130], [4, 104], [106, 125]]);
  }));

  return function myRateLimiter(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.myRateLimiter = myRateLimiter;