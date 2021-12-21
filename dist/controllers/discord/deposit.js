"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDiscordWalletDepositAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

var _sequelize = require("sequelize");

var _qrcode = _interopRequireDefault(require("qrcode"));

var _models = _interopRequireDefault(require("../../models"));

var _discord2 = require("../../messages/discord");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var fetchDiscordWalletDepositAddress = /*#__PURE__*/function () {
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
                var user, depositQr, depositQrFixed, userId, preActivity, finalActivity;
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

                        if (!(!user && !user.wallet && !user.wallet.addresses)) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 6;
                        return message.author.send("Deposit Address not found");

                      case 6:
                        if (!(user && user.wallet && user.wallet.addresses)) {
                          _context.next = 27;
                          break;
                        }

                        _context.next = 9;
                        return _qrcode["default"].toDataURL(user.wallet.addresses[0].address);

                      case 9:
                        depositQr = _context.sent;
                        depositQrFixed = depositQr.replace('data:image/png;base64,', '');
                        userId = user.user_id.replace('discord-', '');

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 15;
                        return message.author.send({
                          embeds: [(0, _discord2.depositAddressMessage)(userId, user)],
                          files: [new _discord.MessageAttachment(Buffer.from(depositQrFixed, 'base64'), 'qr.png')]
                        });

                      case 15:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 20;
                          break;
                        }

                        _context.next = 18;
                        return message.channel.send({
                          embeds: [(0, _discord2.warnDirectMessage)(userId, 'Balance')]
                        });

                      case 18:
                        _context.next = 20;
                        return message.author.send({
                          embeds: [(0, _discord2.depositAddressMessage)(userId, user)],
                          files: [new _discord.MessageAttachment(Buffer.from(depositQrFixed, 'base64'), 'qr.png')]
                        });

                      case 20:
                        _context.next = 22;
                        return _models["default"].activity.create({
                          type: 'deposit',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 22:
                        preActivity = _context.sent;
                        _context.next = 25;
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

                      case 25:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 27:
                        t.afterCommit(function () {
                          _logger["default"].info("Success Deposit Address Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator));
                        });

                      case 28:
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
              console.log(err);

              _logger["default"].error("Error Deposit Address Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));
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

  return function fetchDiscordWalletDepositAddress(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchDiscordWalletDepositAddress = fetchDiscordWalletDepositAddress;