"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordCoinInfo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

/* eslint-disable import/prefer-default-export */
var discordCoinInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message, io) {
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
                var blockHeight, priceInfo, user, preActivity, finalActivity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].block.findOne({
                          order: [['id', 'DESC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        blockHeight = _context.sent;
                        _context.next = 5;
                        return _models["default"].priceInfo.findOne({
                          order: [['id', 'ASC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 5:
                        priceInfo = _context.sent;

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 9;
                        return message.author.send({
                          embeds: [(0, _discord.coinInfoMessage)(blockHeight.id, priceInfo)]
                        });

                      case 9:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 12;
                        return message.author.send({
                          embeds: [(0, _discord.coinInfoMessage)(blockHeight.id, priceInfo)]
                        });

                      case 12:
                        _context.next = 14;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(message.author.id, 'Coin Info')]
                        });

                      case 14:
                        _context.next = 16;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 16:
                        user = _context.sent;
                        _context.next = 19;
                        return _models["default"].activity.create({
                          type: 'info',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 19:
                        preActivity = _context.sent;
                        _context.next = 22;
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

                      case 22:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 25:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
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
                          type: 'info',
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
                        console.log(err);

                        _logger["default"].error("info error: ".concat(err));

                        if (!(err.code && err.code === 50007)) {
                          _context2.next = 15;
                          break;
                        }

                        _context2.next = 13;
                        return message.channel.send({
                          embeds: [(0, _discord.cannotSendMessageUser)("Coin Info", message)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 13:
                        _context2.next = 17;
                        break;

                      case 15:
                        _context2.next = 17;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Coin Info")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 17:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x4) {
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

  return function discordCoinInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordCoinInfo = discordCoinInfo;