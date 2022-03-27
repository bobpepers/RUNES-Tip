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

var _discord = require("discord.js");

var _discord2 = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var discordFaucetClaim = /*#__PURE__*/function () {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, faucet, row, fActivity, lastFaucetTip, userId, username, dateFuture, dateNow, distance, activityT, amountToTip, faucetTip, updateFaucet, updateWallet, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, 'faucettip');

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
                        return _models["default"].faucet.findOne({
                          order: [['id', 'DESC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 11:
                        faucet = _context.sent;

                        if (faucet) {
                          _context.next = 19;
                          break;
                        }

                        _context.next = 15;
                        return _models["default"].activity.create({
                          type: 'faucettip_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        activity = _context.sent;
                        _context.next = 18;
                        return message.channel.send('faucet not found');

                      case 18:
                        return _context.abrupt("return");

                      case 19:
                        row = new _discord.MessageActionRow().addComponents(new _discord.MessageButton().setCustomId('claimFaucet').setLabel('Claim Faucet').setStyle('PRIMARY'));

                        if (!(Number(faucet.amount) < 10000)) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 23;
                        return _models["default"].activity.create({
                          type: 'faucettip_i'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 23:
                        fActivity = _context.sent;
                        activity.push(fActivity);
                        _context.next = 27;
                        return message.channel.send({
                          embeds: [(0, _discord2.dryFaucetMessage)()],
                          components: [row]
                        });

                      case 27:
                        return _context.abrupt("return");

                      case 28:
                        _context.next = 30;
                        return _models["default"].faucettip.findOne({
                          where: {
                            userId: user.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t,
                          order: [['id', 'DESC']]
                        });

                      case 30:
                        lastFaucetTip = _context.sent;
                        userId = user.user_id.replace('discord-', '');
                        username = user.ignoreMe ? "".concat(user.username) : "<@".concat(userId, ">");
                        dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + 4 * 60 * 60 * 1000;
                        dateNow = new Date().getTime();
                        distance = dateFuture && dateFuture - dateNow; // console.log(distance);

                        if (!(distance && distance > 0)) {
                          _context.next = 44;
                          break;
                        }

                        _context.next = 39;
                        return _models["default"].activity.create({
                          type: 'faucettip_t',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 39:
                        activityT = _context.sent;
                        activity.push(activityT);
                        _context.next = 43;
                        return message.channel.send({
                          embeds: [(0, _discord2.claimTooFactFaucetMessage)(username, distance)],
                          components: [row]
                        });

                      case 43:
                        return _context.abrupt("return");

                      case 44:
                        amountToTip = Number((faucet.amount / 100 * (settings.faucet / 1e2)).toFixed(0));
                        _context.next = 47;
                        return _models["default"].faucettip.create({
                          amount: amountToTip,
                          faucetId: faucet.id,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 47:
                        faucetTip = _context.sent;
                        _context.next = 50;
                        return faucet.update({
                          amount: Number(faucet.amount) - Number(amountToTip),
                          claims: faucet.claims + 1,
                          totalAmountClaimed: faucet.totalAmountClaimed + Number(amountToTip)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 50:
                        updateFaucet = _context.sent;
                        _context.next = 53;
                        return user.wallet.update({
                          available: Number(user.wallet.available) + amountToTip
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 53:
                        updateWallet = _context.sent;
                        _context.next = 56;
                        return _models["default"].activity.create({
                          type: 'faucettip_s',
                          earnerId: user.id,
                          faucettipId: faucetTip.id,
                          amount: amountToTip,
                          spender_balance: updateFaucet.amount,
                          earner_balance: updateWallet.available + updateWallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 56:
                        preActivity = _context.sent;
                        _context.next = 59;
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

                      case 59:
                        finalActivity = _context.sent;
                        activity.push(finalActivity);
                        _context.next = 63;
                        return message.channel.send({
                          embeds: [(0, _discord2.faucetClaimedMessage)(faucetTip.id, username, amountToTip)],
                          components: [row]
                        });

                      case 63:
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
                          type: 'faucet',
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

                        _logger["default"].error("faucet error: ".concat(err));

                        _context2.next = 12;
                        return message.channel.send({
                          embeds: [(0, _discord2.discordErrorMessage)("Faucet")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 12:
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

  return function discordFaucetClaim(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordFaucetClaim = discordFaucetClaim;