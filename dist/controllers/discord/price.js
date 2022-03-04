"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordPrice = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var discordPrice = /*#__PURE__*/function () {
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
                var user, priceInfo, userId, priceRecord, replyString, createActivity, findActivity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet',
                            include: [{
                              model: _models["default"].address,
                              as: 'addresses'
                            }]
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;
                        _context.next = 5;
                        return _models["default"].priceInfo.findOne({
                          where: {
                            currency: 'USD'
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 5:
                        priceInfo = _context.sent;

                        if (!(!user && !user.wallet)) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 9;
                        return message.author.send("Wallet not found");

                      case 9:
                        if (!(user && user.wallet)) {
                          _context.next = 35;
                          break;
                        }

                        userId = user.user_id.replace('discord-', '');
                        _context.prev = 11;
                        _context.next = 14;
                        return _models["default"].priceInfo.findAll({});

                      case 14:
                        priceRecord = _context.sent;
                        replyString = "";
                        replyString += priceRecord.map(function (a) {
                          return "".concat(a.currency, ": ").concat(a.price);
                        }).join('\n');

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 20;
                          break;
                        }

                        _context.next = 20;
                        return message.author.send({
                          embeds: [(0, _discord.priceMessage)(replyString)]
                        });

                      case 20:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 23;
                          break;
                        }

                        _context.next = 23;
                        return message.channel.send({
                          embeds: [(0, _discord.priceMessage)(replyString)]
                        });

                      case 23:
                        _context.next = 28;
                        break;

                      case 25:
                        _context.prev = 25;
                        _context.t0 = _context["catch"](11);
                        console.log(_context.t0);

                      case 28:
                        _context.next = 30;
                        return _models["default"].activity.create({
                          type: 'price',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        createActivity = _context.sent;
                        _context.next = 33;
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

                      case 33:
                        findActivity = _context.sent;
                        activity.unshift(findActivity);

                      case 35:
                        t.afterCommit(function () {
                          console.log('done price request'); // logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
                        });

                      case 36:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[11, 25]]);
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
                          type: 'price',
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
                        _logger["default"].error("Error Discord Balance Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));

                        message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Price")]
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

  return function discordPrice(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordPrice = discordPrice;