"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _rclient = require("../../../services/rclient");

var _models = _interopRequireDefault(require("../../../models"));

var _logger = _interopRequireDefault(require("../../logger"));

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

/**
 * Notify New Transaction From Runebase Node
 */
var walletNotifyRunebase = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var txId, transaction;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.locals.activity = [];
            txId = req.body.payload;
            _context2.next = 4;
            return (0, _rclient.getInstance)().getTransaction(txId);

          case 4:
            transaction = _context2.sent;
            _context2.next = 7;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var i, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, detail, address, activity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        i = 0;
                        res.locals.detail = [];

                        if (!(transaction.details && transaction.details.length > 0)) {
                          _context.next = 51;
                          break;
                        }

                        _iteratorAbruptCompletion = false;
                        _didIteratorError = false;
                        _context.prev = 5;
                        _iterator = _asyncIterator(transaction.details);

                      case 7:
                        _context.next = 9;
                        return _iterator.next();

                      case 9:
                        if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
                          _context.next = 35;
                          break;
                        }

                        detail = _step.value;

                        if (!(detail.address !== process.env.RUNEBASE_CONSOLIDATION_ADDRESS)) {
                          _context.next = 32;
                          break;
                        }

                        if (!(detail.category === 'receive')) {
                          _context.next = 32;
                          break;
                        }

                        _context.next = 15;
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

                      case 15:
                        address = _context.sent;

                        if (!address) {
                          _context.next = 32;
                          break;
                        }

                        res.locals.detail[parseInt(i, 10)] = {};

                        if (address.wallet.user.user_id.startsWith('discord')) {
                          res.locals.detail[parseInt(i, 10)].platform = 'discord';
                          res.locals.detail[parseInt(i, 10)].userId = address.wallet.user.user_id.replace('discord-', '');
                        }

                        if (address.wallet.user.user_id.startsWith('telegram')) {
                          res.locals.detail[parseInt(i, 10)].platform = 'telegram';
                          res.locals.detail[parseInt(i, 10)].userId = address.wallet.user.user_id.replace('telegram-', '');
                        }

                        if (address.wallet.user.user_id.startsWith('matrix')) {
                          res.locals.detail[parseInt(i, 10)].platform = 'matrix';
                          res.locals.detail[parseInt(i, 10)].userId = address.wallet.user.user_id.replace('matrix-', '');
                        }

                        _context.next = 23;
                        return _models["default"].transaction.findOrCreate({
                          where: {
                            txid: transaction.txid,
                            type: detail.category,
                            userId: address.wallet.userId
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

                      case 23:
                        res.locals.detail[parseInt(i, 10)].transaction = _context.sent;

                        if (!res.locals.detail[parseInt(i, 10)].transaction[1]) {
                          _context.next = 31;
                          break;
                        }

                        _context.next = 27;
                        return _models["default"].activity.findOrCreate({
                          where: {
                            transactionId: res.locals.detail[parseInt(i, 10)].transaction[0].id
                          },
                          defaults: {
                            earnerId: address.wallet.userId,
                            type: 'depositAccepted',
                            amount: detail.amount * 1e8,
                            transactionId: res.locals.detail[parseInt(i, 10)].transaction[0].id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 27:
                        activity = _context.sent;
                        res.locals.activity.unshift(activity[0]);
                        res.locals.detail[parseInt(i, 10)].amount = detail.amount;

                        _logger["default"].info("deposit detected for addressid: ".concat(res.locals.detail[parseInt(i, 10)].transaction[0].addressId, " and txid: ").concat(res.locals.detail[parseInt(i, 10)].transaction[0].txid));

                      case 31:
                        i += 1;

                      case 32:
                        _iteratorAbruptCompletion = false;
                        _context.next = 7;
                        break;

                      case 35:
                        _context.next = 41;
                        break;

                      case 37:
                        _context.prev = 37;
                        _context.t0 = _context["catch"](5);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                      case 41:
                        _context.prev = 41;
                        _context.prev = 42;

                        if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                          _context.next = 46;
                          break;
                        }

                        _context.next = 46;
                        return _iterator["return"]();

                      case 46:
                        _context.prev = 46;

                        if (!_didIteratorError) {
                          _context.next = 49;
                          break;
                        }

                        throw _iteratorError;

                      case 49:
                        return _context.finish(46);

                      case 50:
                        return _context.finish(41);

                      case 51:
                        t.afterCommit(function () {
                          console.log('commited');
                          next();
                        });

                      case 52:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[5, 37, 41, 51], [42,, 46, 50]]);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function walletNotifyRunebase(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = walletNotifyRunebase;
exports["default"] = _default;