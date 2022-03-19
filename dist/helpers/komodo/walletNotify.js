"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _rclient = require("../../services/rclient");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../logger"));

/**
 * Notify New Transaction From Komodo Node
 */
var walletNotifyKomodo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var txId, transaction;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            txId = req.body.payload;
            _context3.next = 3;
            return (0, _rclient.getInstance)().getTransaction(txId);

          case 3:
            transaction = _context3.sent;
            _context3.next = 6;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return Promise.all(transaction.details.map( /*#__PURE__*/function () {
                          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(detail) {
                            var address, activity;
                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    if (!(detail.category === 'receive')) {
                                      _context.next = 18;
                                      break;
                                    }

                                    _context.next = 3;
                                    return _models["default"].address.findOne({
                                      where: {
                                        address: detail.address
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

                                  case 3:
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

                                    if (address.wallet.user.user_id.startsWith('matrix')) {
                                      res.locals.platform = 'matrix';
                                      res.locals.userId = address.wallet.user.user_id.replace('matrix-', '');
                                    }

                                    console.log(transaction);
                                    _context.next = 11;
                                    return _models["default"].transaction.findOrCreate({
                                      where: {
                                        txid: transaction.txid,
                                        type: detail.category
                                      },
                                      defaults: {
                                        txid: txId,
                                        addressId: address.id,
                                        phase: 'confirming',
                                        type: detail.category,
                                        amount: detail.amount * 1e8,
                                        userId: address.wallet.userId
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
                                        amount: detail.amount * 1e8,
                                        transactionId: res.locals.transaction[0].id
                                      },
                                      transaction: t,
                                      lock: t.LOCK.UPDATE
                                    });

                                  case 15:
                                    activity = _context.sent;
                                    res.locals.amount = detail.amount;

                                  case 17:
                                    _logger["default"].info("deposit detected for addressid: ".concat(res.locals.transaction[0].addressId, " and txid: ").concat(res.locals.transaction[0].txid));

                                  case 18:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x5) {
                            return _ref3.apply(this, arguments);
                          };
                        }()));

                      case 2:
                        t.afterCommit(function () {
                          next();
                          console.log('commited');
                        });

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function walletNotifyKomodo(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = walletNotifyKomodo;
exports["default"] = _default;