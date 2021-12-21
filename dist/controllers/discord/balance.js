"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDiscordWalletBalance = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var fetchDiscordWalletBalance = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            activity = [];
            _context2.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var user, priceInfo, userId, createActivity, findActivity;
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
                          _context.next = 26;
                          break;
                        }

                        userId = user.user_id.replace('discord-', '');

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 14;
                        return message.author.send({
                          embeds: [(0, _discord.balanceMessage)(userId, user, priceInfo)]
                        });

                      case 14:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 19;
                          break;
                        }

                        _context.next = 17;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Balance')]
                        });

                      case 17:
                        _context.next = 19;
                        return message.author.send({
                          embeds: [(0, _discord.balanceMessage)(userId, user, priceInfo)]
                        });

                      case 19:
                        _context.next = 21;
                        return _models["default"].activity.create({
                          type: 'balance',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 21:
                        createActivity = _context.sent;
                        _context.next = 24;
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

                      case 24:
                        findActivity = _context.sent;
                        activity.unshift(findActivity);

                      case 26:
                        t.afterCommit(function () {
                          _logger["default"].info("Success Discord Balance Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator));
                        });

                      case 27:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              _logger["default"].error("Error Discord Balance Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));
            });

          case 3:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchDiscordWalletBalance(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchDiscordWalletBalance = fetchDiscordWalletBalance;