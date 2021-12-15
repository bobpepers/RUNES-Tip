"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordFaucetClaim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _userWalletExist = require("../../helpers/discord/userWalletExist");

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var discordFaucetClaim = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, filteredMessage, io) {
    var user, activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, faucet, lastFaucetTip, userId, username, dateFuture, dateNow, distance, amountToTip, faucetTip, updateFaucet, updateWallet;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        activity = _yield$userWalletExis2[1];

                        if (user) {
                          _context.next = 8;
                          break;
                        }

                        return _context.abrupt("return");

                      case 8:
                        _context.next = 10;
                        return _models["default"].faucet.findOne({
                          order: [['id', 'DESC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 10:
                        faucet = _context.sent;

                        if (faucet) {
                          _context.next = 18;
                          break;
                        }

                        _context.next = 14;
                        return _models["default"].activity.create({
                          type: 'faucettip_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 14:
                        activity = _context.sent;
                        _context.next = 17;
                        return message.channel.send('faucet not found');

                      case 17:
                        return _context.abrupt("return");

                      case 18:
                        if (!(Number(faucet.amount) < 10000)) {
                          _context.next = 25;
                          break;
                        }

                        _context.next = 21;
                        return _models["default"].activity.create({
                          type: 'faucettip_i'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 21:
                        activity = _context.sent;
                        _context.next = 24;
                        return message.channel.send({
                          embeds: [(0, _discord.dryFaucetMessage)(message)]
                        });

                      case 24:
                        return _context.abrupt("return");

                      case 25:
                        _context.next = 27;
                        return _models["default"].faucettip.findOne({
                          where: {
                            userId: user.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t,
                          order: [['id', 'DESC']]
                        });

                      case 27:
                        lastFaucetTip = _context.sent;
                        userId = user.user_id.replace('discord-', '');
                        username = user.ignoreme ? "<@".concat(userId, ">") : "".concat(user.username);
                        dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + 4 * 60 * 60 * 1000;
                        dateNow = new Date().getTime();
                        distance = dateFuture && dateFuture - dateNow;
                        console.log(distance);

                        if (!(distance && distance > 0)) {
                          _context.next = 41;
                          break;
                        }

                        _context.next = 37;
                        return _models["default"].activity.create({
                          type: 'faucettip_t'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 37:
                        activity = _context.sent;
                        _context.next = 40;
                        return message.channel.send({
                          embeds: [(0, _discord.claimTooFactFaucetMessage)(message, username, distance)]
                        });

                      case 40:
                        return _context.abrupt("return");

                      case 41:
                        amountToTip = Number((faucet.amount / 100 * (settings.faucet / 1e2)).toFixed(0));
                        _context.next = 44;
                        return _models["default"].faucettip.create({
                          amount: amountToTip,
                          faucetId: faucet.id,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 44:
                        faucetTip = _context.sent;
                        _context.next = 47;
                        return faucet.update({
                          amount: Number(faucet.amount) - Number(amountToTip),
                          claims: faucet.claims + 1,
                          totalAmountClaimed: faucet.totalAmountClaimed + Number(amountToTip)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 47:
                        updateFaucet = _context.sent;
                        console.log(Number(user.wallet.available));
                        console.log(amountToTip);
                        _context.next = 52;
                        return user.wallet.update({
                          available: Number(user.wallet.available) + amountToTip
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 52:
                        updateWallet = _context.sent;
                        _context.next = 55;
                        return _models["default"].activity.create({
                          type: 'faucettip_s',
                          earnerId: user.id,
                          faucettipId: faucetTip.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 55:
                        activity = _context.sent;
                        _context.next = 58;
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

                      case 58:
                        activity = _context.sent;
                        _context.next = 61;
                        return message.channel.send({
                          embeds: [(0, _discord.faucetClaimedMessage)(message, username, amountToTip)]
                        });

                      case 61:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
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

  return function discordFaucetClaim(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordFaucetClaim = discordFaucetClaim;