"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordFaucetClaim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

/* eslint-disable import/prefer-default-export */
var discordFaucetClaim = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var user, faucet, lastFaucetTip, userId, username, dateFuture, dateNow, distance, amountToTip, faucetTip, updateFaucet, updateWallet;
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
                            required: true,
                            include: [{
                              model: _models["default"].address,
                              as: 'addresses',
                              required: true
                            }]
                          }],
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
                          type: 'faucettip_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context.sent;
                        _context.next = 9;
                        return message.channel.send({
                          embeds: [(0, _discord.walletNotFoundMessage)(message, 'Faucet')]
                        });

                      case 9:
                        return _context.abrupt("return");

                      case 10:
                        _context.next = 12;
                        return _models["default"].faucet.findOne({
                          order: [['id', 'DESC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 12:
                        faucet = _context.sent;

                        if (faucet) {
                          _context.next = 20;
                          break;
                        }

                        _context.next = 16;
                        return _models["default"].activity.create({
                          type: 'faucettip_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 16:
                        activity = _context.sent;
                        _context.next = 19;
                        return message.channel.send('faucet not found');

                      case 19:
                        return _context.abrupt("return");

                      case 20:
                        console.log(Number(_settings["default"].fee.withdrawal));
                        console.log(Number(faucet.amount));

                        if (!(Number(faucet.amount) < Number(_settings["default"].fee.withdrawal))) {
                          _context.next = 29;
                          break;
                        }

                        _context.next = 25;
                        return _models["default"].activity.create({
                          type: 'faucettip_i'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 25:
                        activity = _context.sent;
                        _context.next = 28;
                        return message.channel.send({
                          embeds: [(0, _discord.dryFaucetMessage)(message)]
                        });

                      case 28:
                        return _context.abrupt("return");

                      case 29:
                        _context.next = 31;
                        return _models["default"].faucettip.findOne({
                          lock: t.LOCK.UPDATE,
                          transaction: t,
                          order: [['id', 'DESC']]
                        });

                      case 31:
                        lastFaucetTip = _context.sent;
                        userId = user.user_id.replace('discord-', '');
                        username = user.ignoreme ? "<@".concat(userId, ">") : "".concat(user.username);
                        dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + 4 * 60 * 60 * 1000;
                        dateNow = new Date().getTime();
                        distance = dateFuture && dateFuture - dateNow;
                        console.log(distance);

                        if (!(distance && distance > 0)) {
                          _context.next = 45;
                          break;
                        }

                        _context.next = 41;
                        return _models["default"].activity.create({
                          type: 'faucettip_t'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 41:
                        activity = _context.sent;
                        _context.next = 44;
                        return message.channel.send({
                          embeds: [(0, _discord.claimTooFactFaucetMessage)(message, username, distance)]
                        });

                      case 44:
                        return _context.abrupt("return");

                      case 45:
                        amountToTip = Number((faucet.amount / 100 * _settings["default"].faucet).toFixed(0));
                        _context.next = 48;
                        return _models["default"].faucettip.create({
                          amount: amountToTip,
                          faucetId: faucet.id,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 48:
                        faucetTip = _context.sent;
                        _context.next = 51;
                        return faucet.update({
                          amount: Number(faucet.amount) - amountToTip
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 51:
                        updateFaucet = _context.sent;
                        console.log(Number(user.wallet.available));
                        console.log(amountToTip);
                        _context.next = 56;
                        return user.wallet.update({
                          available: Number(user.wallet.available) + amountToTip
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 56:
                        updateWallet = _context.sent;
                        _context.next = 59;
                        return _models["default"].activity.create({
                          type: 'faucettip_s',
                          earnerId: user.id,
                          faucettipId: faucetTip.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 59:
                        activity = _context.sent;
                        _context.next = 62;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 62:
                        activity = _context.sent;
                        _context.next = 65;
                        return message.channel.send({
                          embeds: [(0, _discord.faucetClaimedMessage)(message, username, amountToTip)]
                        });

                      case 65:
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
              message.channel.send('something went wrong');
            });

          case 2:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });
            return _context2.abrupt("return", true);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function discordFaucetClaim(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordFaucetClaim = discordFaucetClaim;