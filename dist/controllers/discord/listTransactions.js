"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDiscordListTransactions = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var fetchDiscordListTransactions = /*#__PURE__*/function () {
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
                var user, createFailActivity, userId, transactions, createActivity, findActivity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;

                        if (user) {
                          _context.next = 10;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].activity.create({
                          type: 'listtransactions_f',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        createFailActivity = _context.sent;
                        activity.unshift(createFailActivity);
                        _context.next = 10;
                        return message.author.send("User not found");

                      case 10:
                        if (!user) {
                          _context.next = 30;
                          break;
                        }

                        userId = user.user_id.replace('discord-', '');
                        _context.next = 14;
                        return _models["default"].transaction.findAll({
                          where: {
                            userId: user.id
                          },
                          order: [['id', 'DESC']],
                          limit: 10,
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 14:
                        transactions = _context.sent;

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 18;
                          break;
                        }

                        _context.next = 18;
                        return message.author.send({
                          embeds: [(0, _discord.listTransactionsMessage)(userId, user, transactions)]
                        });

                      case 18:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 23;
                          break;
                        }

                        _context.next = 21;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Balance')]
                        });

                      case 21:
                        _context.next = 23;
                        return message.author.send({
                          embeds: [(0, _discord.listTransactionsMessage)(userId, user, transactions)]
                        });

                      case 23:
                        _context.next = 25;
                        return _models["default"].activity.create({
                          type: 'listtransactions_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 25:
                        createActivity = _context.sent;
                        _context.next = 28;
                        return _models["default"].activity.findOne({
                          where: {
                            id: createActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 28:
                        findActivity = _context.sent;
                        activity.unshift(findActivity);

                      case 30:
                        t.afterCommit(function () {
                          // logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
                          console.log('done list transactions request');
                        });

                      case 31:
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
                          type: 'listTransactions',
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
                        _logger["default"].error("Error Discord List Transactions Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));

                        message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("List transactions")]
                        });

                      case 10:
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
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetchDiscordListTransactions(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchDiscordListTransactions = fetchDiscordListTransactions;