"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.limitWithdraw = exports.limitTip = exports.limitThunderStorm = exports.limitThunder = exports.limitStats = exports.limitSoak = exports.limitSleet = exports.limitReactDrop = exports.limitRain = exports.limitPublicStats = exports.limitPrice = exports.limitLeaderboard = exports.limitInfo = exports.limitIgnoreMe = exports.limitHurricane = exports.limitHelp = exports.limitFlood = exports.limitFaucet = exports.limitDeposit = exports.limitBalance = void 0;

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

var limitThunder = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return rateLimiterThunder.consume(message.author.id, 1);

          case 3:
            limited = _context.sent;
            return _context.abrupt("return", false);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            _context.prev = 9;
            _context.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context.sent;

            if (!(notError.remainingPoints > 0)) {
              _context.next = 16;
              break;
            }

            _context.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Thunder')]
            });

          case 16:
            return _context.abrupt("return", true);

          case 19:
            _context.prev = 19;
            _context.t1 = _context["catch"](9);
            return _context.abrupt("return", true);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7], [9, 19]]);
  }));

  return function limitThunder(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.limitThunder = limitThunder;

var limitThunderStorm = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return rateLimiterThunderstorm.consume(message.author.id, 1);

          case 3:
            limited = _context2.sent;
            return _context2.abrupt("return", false);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            _context2.prev = 9;
            _context2.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context2.sent;

            if (!(notError.remainingPoints > 0)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Thunderstorm')]
            });

          case 16:
            return _context2.abrupt("return", true);

          case 19:
            _context2.prev = 19;
            _context2.t1 = _context2["catch"](9);
            return _context2.abrupt("return", true);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7], [9, 19]]);
  }));

  return function limitThunderStorm(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.limitThunderStorm = limitThunderStorm;

var limitStats = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return rateLimiterStats.consume(message.author.id, 1);

          case 3:
            limited = _context3.sent;
            return _context3.abrupt("return", false);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            _context3.prev = 9;
            _context3.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context3.sent;

            if (!(notError.remainingPoints > 0)) {
              _context3.next = 16;
              break;
            }

            _context3.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Tip')]
            });

          case 16:
            return _context3.abrupt("return", true);

          case 19:
            _context3.prev = 19;
            _context3.t1 = _context3["catch"](9);
            return _context3.abrupt("return", true);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7], [9, 19]]);
  }));

  return function limitStats(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.limitStats = limitStats;

var limitLeaderboard = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return rateLimiterLeaderboard.consume(message.author.id, 1);

          case 3:
            limited = _context4.sent;
            return _context4.abrupt("return", false);

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            _context4.prev = 9;
            _context4.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context4.sent;

            if (!(notError.remainingPoints > 0)) {
              _context4.next = 16;
              break;
            }

            _context4.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Tip')]
            });

          case 16:
            return _context4.abrupt("return", true);

          case 19:
            _context4.prev = 19;
            _context4.t1 = _context4["catch"](9);
            return _context4.abrupt("return", true);

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7], [9, 19]]);
  }));

  return function limitLeaderboard(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.limitLeaderboard = limitLeaderboard;

var limitPublicStats = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return rateLimiterPublicStats.consume(message.author.id, 1);

          case 3:
            limited = _context5.sent;
            return _context5.abrupt("return", false);

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            _context5.prev = 9;
            _context5.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context5.sent;

            if (!(notError.remainingPoints > 0)) {
              _context5.next = 16;
              break;
            }

            _context5.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Tip')]
            });

          case 16:
            return _context5.abrupt("return", true);

          case 19:
            _context5.prev = 19;
            _context5.t1 = _context5["catch"](9);
            return _context5.abrupt("return", true);

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7], [9, 19]]);
  }));

  return function limitPublicStats(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

exports.limitPublicStats = limitPublicStats;

var limitFaucet = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return rateLimiterFaucet.consume(message.author.id, 1);

          case 3:
            limited = _context6.sent;
            return _context6.abrupt("return", false);

          case 7:
            _context6.prev = 7;
            _context6.t0 = _context6["catch"](0);
            _context6.prev = 9;
            _context6.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context6.sent;

            if (!(notError.remainingPoints > 0)) {
              _context6.next = 16;
              break;
            }

            _context6.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Tip')]
            });

          case 16:
            return _context6.abrupt("return", true);

          case 19:
            _context6.prev = 19;
            _context6.t1 = _context6["catch"](9);
            return _context6.abrupt("return", true);

          case 22:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 7], [9, 19]]);
  }));

  return function limitFaucet(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

exports.limitFaucet = limitFaucet;

var limitDeposit = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return rateLimiterDeposit.consume(message.author.id, 1);

          case 3:
            limited = _context7.sent;
            return _context7.abrupt("return", false);

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](0);
            _context7.prev = 9;
            _context7.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context7.sent;

            if (!(notError.remainingPoints > 0)) {
              _context7.next = 16;
              break;
            }

            _context7.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Tip')]
            });

          case 16:
            return _context7.abrupt("return", true);

          case 19:
            _context7.prev = 19;
            _context7.t1 = _context7["catch"](9);
            return _context7.abrupt("return", true);

          case 22:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 7], [9, 19]]);
  }));

  return function limitDeposit(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

exports.limitDeposit = limitDeposit;

var limitBalance = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return rateLimiterBalance.consume(message.author.id, 1);

          case 3:
            limited = _context8.sent;
            return _context8.abrupt("return", false);

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8["catch"](0);
            _context8.prev = 9;
            _context8.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context8.sent;

            if (!(notError.remainingPoints > 0)) {
              _context8.next = 16;
              break;
            }

            _context8.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Tip')]
            });

          case 16:
            return _context8.abrupt("return", true);

          case 19:
            _context8.prev = 19;
            _context8.t1 = _context8["catch"](9);
            return _context8.abrupt("return", true);

          case 22:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 7], [9, 19]]);
  }));

  return function limitBalance(_x8) {
    return _ref8.apply(this, arguments);
  };
}();

exports.limitBalance = limitBalance;

var limitPrice = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return rateLimiterPrice.consume(message.author.id, 1);

          case 3:
            limited = _context9.sent;
            return _context9.abrupt("return", false);

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](0);
            _context9.prev = 9;
            _context9.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context9.sent;

            if (!(notError.remainingPoints > 0)) {
              _context9.next = 16;
              break;
            }

            _context9.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Price')]
            });

          case 16:
            return _context9.abrupt("return", true);

          case 19:
            _context9.prev = 19;
            _context9.t1 = _context9["catch"](9);
            return _context9.abrupt("return", true);

          case 22:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 7], [9, 19]]);
  }));

  return function limitPrice(_x9) {
    return _ref9.apply(this, arguments);
  };
}();

exports.limitPrice = limitPrice;

var limitTip = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return rateLimiterTip.consume(message.author.id, 1);

          case 3:
            limited = _context10.sent;
            return _context10.abrupt("return", false);

          case 7:
            _context10.prev = 7;
            _context10.t0 = _context10["catch"](0);
            _context10.prev = 9;
            _context10.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context10.sent;

            if (!(notError.remainingPoints > 0)) {
              _context10.next = 16;
              break;
            }

            _context10.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Tip')]
            });

          case 16:
            return _context10.abrupt("return", true);

          case 19:
            _context10.prev = 19;
            _context10.t1 = _context10["catch"](9);
            return _context10.abrupt("return", true);

          case 22:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 7], [9, 19]]);
  }));

  return function limitTip(_x10) {
    return _ref10.apply(this, arguments);
  };
}();

exports.limitTip = limitTip;

var limitWithdraw = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return rateLimiterWithdraw.consume(message.author.id, 1);

          case 3:
            limited = _context11.sent;
            return _context11.abrupt("return", false);

          case 7:
            _context11.prev = 7;
            _context11.t0 = _context11["catch"](0);
            _context11.prev = 9;
            _context11.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context11.sent;

            if (!(notError.remainingPoints > 0)) {
              _context11.next = 16;
              break;
            }

            _context11.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Withdraw')]
            });

          case 16:
            return _context11.abrupt("return", true);

          case 19:
            _context11.prev = 19;
            _context11.t1 = _context11["catch"](9);
            return _context11.abrupt("return", true);

          case 22:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 7], [9, 19]]);
  }));

  return function limitWithdraw(_x11) {
    return _ref11.apply(this, arguments);
  };
}();

exports.limitWithdraw = limitWithdraw;

var limitHelp = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return rateLimiterHelp.consume(message.author.id, 1);

          case 3:
            limited = _context12.sent;
            return _context12.abrupt("return", false);

          case 7:
            _context12.prev = 7;
            _context12.t0 = _context12["catch"](0);
            _context12.prev = 9;
            _context12.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context12.sent;

            if (!(notError.remainingPoints > 0)) {
              _context12.next = 16;
              break;
            }

            _context12.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Help')]
            });

          case 16:
            return _context12.abrupt("return", true);

          case 19:
            _context12.prev = 19;
            _context12.t1 = _context12["catch"](9);
            return _context12.abrupt("return", true);

          case 22:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 7], [9, 19]]);
  }));

  return function limitHelp(_x12) {
    return _ref12.apply(this, arguments);
  };
}();

exports.limitHelp = limitHelp;

var limitInfo = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return rateLimiterInfo.consume(message.author.id, 1);

          case 3:
            limited = _context13.sent;
            return _context13.abrupt("return", false);

          case 7:
            _context13.prev = 7;
            _context13.t0 = _context13["catch"](0);
            _context13.prev = 9;
            _context13.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context13.sent;

            if (!(notError.remainingPoints > 0)) {
              _context13.next = 16;
              break;
            }

            _context13.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Info')]
            });

          case 16:
            return _context13.abrupt("return", true);

          case 19:
            _context13.prev = 19;
            _context13.t1 = _context13["catch"](9);
            return _context13.abrupt("return", true);

          case 22:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 7], [9, 19]]);
  }));

  return function limitInfo(_x13) {
    return _ref13.apply(this, arguments);
  };
}();

exports.limitInfo = limitInfo;

var limitRain = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            _context14.next = 3;
            return rateLimiterRain.consume(message.author.id, 1);

          case 3:
            limited = _context14.sent;
            return _context14.abrupt("return", false);

          case 7:
            _context14.prev = 7;
            _context14.t0 = _context14["catch"](0);
            _context14.prev = 9;
            _context14.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context14.sent;

            if (!(notError.remainingPoints > 0)) {
              _context14.next = 16;
              break;
            }

            _context14.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Rain')]
            });

          case 16:
            return _context14.abrupt("return", true);

          case 19:
            _context14.prev = 19;
            _context14.t1 = _context14["catch"](9);
            return _context14.abrupt("return", true);

          case 22:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 7], [9, 19]]);
  }));

  return function limitRain(_x14) {
    return _ref14.apply(this, arguments);
  };
}();

exports.limitRain = limitRain;

var limitSoak = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return rateLimiterSoak.consume(message.author.id, 1);

          case 3:
            limited = _context15.sent;
            return _context15.abrupt("return", false);

          case 7:
            _context15.prev = 7;
            _context15.t0 = _context15["catch"](0);
            _context15.prev = 9;
            _context15.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context15.sent;

            if (!(notError.remainingPoints > 0)) {
              _context15.next = 16;
              break;
            }

            _context15.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Soak')]
            });

          case 16:
            return _context15.abrupt("return", true);

          case 19:
            _context15.prev = 19;
            _context15.t1 = _context15["catch"](9);
            return _context15.abrupt("return", true);

          case 22:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 7], [9, 19]]);
  }));

  return function limitSoak(_x15) {
    return _ref15.apply(this, arguments);
  };
}();

exports.limitSoak = limitSoak;

var limitFlood = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return rateLimiterFlood.consume(message.author.id, 1);

          case 3:
            limited = _context16.sent;
            return _context16.abrupt("return", false);

          case 7:
            _context16.prev = 7;
            _context16.t0 = _context16["catch"](0);
            _context16.prev = 9;
            _context16.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context16.sent;

            if (!(notError.remainingPoints > 0)) {
              _context16.next = 16;
              break;
            }

            _context16.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Flood')]
            });

          case 16:
            return _context16.abrupt("return", true);

          case 19:
            _context16.prev = 19;
            _context16.t1 = _context16["catch"](9);
            return _context16.abrupt("return", true);

          case 22:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 7], [9, 19]]);
  }));

  return function limitFlood(_x16) {
    return _ref16.apply(this, arguments);
  };
}();

exports.limitFlood = limitFlood;

var limitHurricane = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return rateLimiterHurricane.consume(message.author.id, 1);

          case 3:
            limited = _context17.sent;
            return _context17.abrupt("return", false);

          case 7:
            _context17.prev = 7;
            _context17.t0 = _context17["catch"](0);
            _context17.prev = 9;
            _context17.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context17.sent;

            if (!(notError.remainingPoints > 0)) {
              _context17.next = 16;
              break;
            }

            _context17.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Hurricane')]
            });

          case 16:
            return _context17.abrupt("return", true);

          case 19:
            _context17.prev = 19;
            _context17.t1 = _context17["catch"](9);
            return _context17.abrupt("return", true);

          case 22:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 7], [9, 19]]);
  }));

  return function limitHurricane(_x17) {
    return _ref17.apply(this, arguments);
  };
}();

exports.limitHurricane = limitHurricane;

var limitIgnoreMe = /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            _context18.next = 3;
            return rateLimiterIgnoreMe.consume(message.author.id, 1);

          case 3:
            limited = _context18.sent;
            return _context18.abrupt("return", false);

          case 7:
            _context18.prev = 7;
            _context18.t0 = _context18["catch"](0);
            _context18.prev = 9;
            _context18.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context18.sent;

            if (!(notError.remainingPoints > 0)) {
              _context18.next = 16;
              break;
            }

            _context18.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'IgnoreMe')]
            });

          case 16:
            return _context18.abrupt("return", true);

          case 19:
            _context18.prev = 19;
            _context18.t1 = _context18["catch"](9);
            return _context18.abrupt("return", true);

          case 22:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 7], [9, 19]]);
  }));

  return function limitIgnoreMe(_x18) {
    return _ref18.apply(this, arguments);
  };
}();

exports.limitIgnoreMe = limitIgnoreMe;

var limitSleet = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            _context19.next = 3;
            return rateLimiterSleet.consume(message.author.id, 1);

          case 3:
            limited = _context19.sent;
            return _context19.abrupt("return", false);

          case 7:
            _context19.prev = 7;
            _context19.t0 = _context19["catch"](0);
            _context19.prev = 9;
            _context19.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context19.sent;

            if (!(notError.remainingPoints > 0)) {
              _context19.next = 16;
              break;
            }

            _context19.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'Sleet')]
            });

          case 16:
            return _context19.abrupt("return", true);

          case 19:
            _context19.prev = 19;
            _context19.t1 = _context19["catch"](9);
            return _context19.abrupt("return", true);

          case 22:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[0, 7], [9, 19]]);
  }));

  return function limitSleet(_x19) {
    return _ref19.apply(this, arguments);
  };
}();

exports.limitSleet = limitSleet;

var limitReactDrop = /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(message) {
    var limited, notError;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.prev = 0;
            _context20.next = 3;
            return rateLimiterReactdrop.consume(message.author.id, 1);

          case 3:
            limited = _context20.sent;
            return _context20.abrupt("return", false);

          case 7:
            _context20.prev = 7;
            _context20.t0 = _context20["catch"](0);
            _context20.prev = 9;
            _context20.next = 12;
            return errorConsumer.consume(message.author.id, 1);

          case 12:
            notError = _context20.sent;

            if (!(notError.remainingPoints > 0)) {
              _context20.next = 16;
              break;
            }

            _context20.next = 16;
            return message.channel.send({
              embeds: [(0, _discord.discordLimitSpamMessage)(message, 'ReactDrop')]
            });

          case 16:
            return _context20.abrupt("return", true);

          case 19:
            _context20.prev = 19;
            _context20.t1 = _context20["catch"](9);
            return _context20.abrupt("return", true);

          case 22:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[0, 7], [9, 19]]);
  }));

  return function limitReactDrop(_x20) {
    return _ref20.apply(this, arguments);
  };
}();

exports.limitReactDrop = limitReactDrop;