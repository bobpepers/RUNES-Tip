"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordHalving = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _rclient = require("../../services/rclient");

/* eslint-disable import/prefer-default-export */
var discordHalving = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message, halvingData, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, currentBlockHeight, nextBlockHalving, currentBlockReward, blockLeftUntilNextHalving, CoinsLeftToMineUntilNextHalving, title, dateNow, nextHalvingDate, distance, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, 'halving');

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        _context.next = 11;
                        return (0, _rclient.getInstance)().getBlockCount();

                      case 11:
                        currentBlockHeight = _context.sent;
                        nextBlockHalving = 0;
                        currentBlockReward = halvingData.initialBlockReward;

                        do {
                          nextBlockHalving += halvingData.every;
                          currentBlockReward /= 2;
                        } while (nextBlockHalving < currentBlockHeight);

                        currentBlockReward *= 2;
                        blockLeftUntilNextHalving = nextBlockHalving - currentBlockHeight;
                        CoinsLeftToMineUntilNextHalving = blockLeftUntilNextHalving * currentBlockReward;
                        title = 'Privatebay Powder Monkey';
                        dateNow = new Date();
                        nextHalvingDate = new Date(dateNow.getTime() + blockLeftUntilNextHalving * (halvingData.blockTime * 1000));
                        distance = new Date(nextHalvingDate.getTime() - dateNow.getTime());
                        _context.next = 24;
                        return message.channel.send({
                          embeds: [(0, _discord.halvingMessage)(title, currentBlockHeight, nextBlockHalving, CoinsLeftToMineUntilNextHalving, nextHalvingDate, distance)]
                        });

                      case 24:
                        _context.next = 26;
                        return _models["default"].activity.create({
                          type: 'halving_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 26:
                        preActivity = _context.sent;
                        _context.next = 29;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 31:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _models["default"].error.create({
                          type: 'halving',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 8:
                        _logger["default"].error("Error Discord Halving Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));

                        _context2.next = 11;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Halving")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function discordHalving(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordHalving = discordHalving;