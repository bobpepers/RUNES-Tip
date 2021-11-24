"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _rclient = require("../../services/rclient");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../logger"));

(0, _dotenv.config)();
/**
 * Notify New Transaction From Runebase Node
 */

var walletNotifyPirate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var txId, transaction;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            txId = req.body.payload;
            _context2.next = 3;
            return (0, _rclient.getInstance)().getTransaction(txId);

          case 3:
            transaction = _context2.sent;
            console.log('transaction walletNotifyPirate');
            console.log(transaction);
            _context2.next = 8;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var address, activity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log(transaction.txid);

                        if (!(transaction.received.length > 0 && transaction.received[0].address !== process.env.PIRATE_MAIN_ADDRESS)) {
                          _context.next = 18;
                          break;
                        }

                        _context.next = 4;
                        return _models["default"].address.findOne({
                          where: {
                            address: transaction.received[0].address
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet',
                            include: [{
                              model: _models["default"].user,
                              as: 'user'
                            }]
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 4:
                        address = _context.sent;

                        if (!address) {
                          _context.next = 18;
                          break;
                        }

                        if (address.wallet.user.user_id.startsWith('discord')) {
                          res.locals.platform = 'discord';
                          res.locals.userId = address.wallet.user.user_id.replace('discord-', '');
                        }

                        if (address.wallet.user.user_id.startsWith('telegram')) {
                          res.locals.platform = 'telegram';
                          res.locals.userId = address.wallet.user.user_id.replace('telegram-', '');
                        }

                        console.log(transaction);
                        _context.next = 11;
                        return _models["default"].transaction.findOrCreate({
                          where: {
                            txid: transaction.txid,
                            type: 'receive'
                          },
                          defaults: {
                            txid: txId,
                            addressId: address.id,
                            phase: 'confirming',
                            type: 'receive',
                            amount: transaction.received[0].value * 1e8
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 11:
                        res.locals.transaction = _context.sent;

                        if (!res.locals.transaction[1]) {
                          _context.next = 17;
                          break;
                        }

                        _context.next = 15;
                        return _models["default"].activity.findOrCreate({
                          where: {
                            transactionId: res.locals.transaction[0].id
                          },
                          defaults: {
                            earnerId: address.wallet.userId,
                            type: 'depositAccepted',
                            amount: transaction.received[0].value * 1e8,
                            transactionId: res.locals.transaction[0].id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 15:
                        activity = _context.sent;
                        res.locals.amount = transaction.received[0].value;

                      case 17:
                        _logger["default"].info("deposit detected for addressid: ".concat(res.locals.transaction[0].addressId, " and txid: ").concat(res.locals.transaction[0].txid));

                      case 18:
                        t.afterCommit(function () {
                          console.log('commited');
                          next();
                        });

                      case 19:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function walletNotifyPirate(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = walletNotifyPirate;
exports["default"] = _default;