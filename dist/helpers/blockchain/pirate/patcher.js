"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchPirateDeposits = patchPirateDeposits;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../../../models"));

var _rclient = require("../../../services/rclient");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

(0, _dotenv.config)();

function patchPirateDeposits() {
  return _patchPirateDeposits.apply(this, arguments);
}

function _patchPirateDeposits() {
  _patchPirateDeposits = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var transactions, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2;

    return _regenerator["default"].wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _rclient.getInstance)().listTransactions(500);

          case 2:
            transactions = _context4.sent;
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context4.prev = 5;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var trans, _loop2;

              return _regenerator["default"].wrap(function _loop$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      trans = _step.value;

                      if (!(trans.received && trans.received.length > 0)) {
                        _context3.next = 30;
                        break;
                      }

                      _iteratorAbruptCompletion2 = false;
                      _didIteratorError2 = false;
                      _context3.prev = 4;
                      _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
                        var detail, address;
                        return _regenerator["default"].wrap(function _loop2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                detail = _step2.value;

                                if (!detail.address) {
                                  _context2.next = 9;
                                  break;
                                }

                                if (!(detail.address !== process.env.PIRATE_MAIN_ADDRESS)) {
                                  _context2.next = 9;
                                  break;
                                }

                                _context2.next = 5;
                                return _models["default"].address.findOne({
                                  where: {
                                    address: detail.address
                                  },
                                  include: [{
                                    model: _models["default"].wallet,
                                    as: 'wallet'
                                  }]
                                });

                              case 5:
                                address = _context2.sent;

                                if (!address) {
                                  _context2.next = 9;
                                  break;
                                }

                                _context2.next = 9;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                                    var newTrans;
                                    return _regenerator["default"].wrap(function _callee$(_context) {
                                      while (1) {
                                        switch (_context.prev = _context.next) {
                                          case 0:
                                            _context.next = 2;
                                            return _models["default"].transaction.findOrCreate({
                                              where: {
                                                txid: trans.txid,
                                                type: 'receive',
                                                userId: address.wallet.userId
                                              },
                                              defaults: {
                                                txid: trans.txid,
                                                addressId: address.id,
                                                phase: 'confirming',
                                                type: 'receive',
                                                amount: detail.value * 1e8,
                                                userId: address.wallet.userId
                                              },
                                              transaction: t,
                                              lock: t.LOCK.UPDATE
                                            });

                                          case 2:
                                            newTrans = _context.sent;
                                            t.afterCommit(function () {
                                              console.log('commited');
                                            });

                                          case 4:
                                          case "end":
                                            return _context.stop();
                                        }
                                      }
                                    }, _callee);
                                  }));

                                  return function (_x) {
                                    return _ref.apply(this, arguments);
                                  };
                                }());

                              case 9:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, _loop2);
                      });
                      _iterator2 = _asyncIterator(trans.received);

                    case 7:
                      _context3.next = 9;
                      return _iterator2.next();

                    case 9:
                      if (!(_iteratorAbruptCompletion2 = !(_step2 = _context3.sent).done)) {
                        _context3.next = 14;
                        break;
                      }

                      return _context3.delegateYield(_loop2(), "t0", 11);

                    case 11:
                      _iteratorAbruptCompletion2 = false;
                      _context3.next = 7;
                      break;

                    case 14:
                      _context3.next = 20;
                      break;

                    case 16:
                      _context3.prev = 16;
                      _context3.t1 = _context3["catch"](4);
                      _didIteratorError2 = true;
                      _iteratorError2 = _context3.t1;

                    case 20:
                      _context3.prev = 20;
                      _context3.prev = 21;

                      if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
                        _context3.next = 25;
                        break;
                      }

                      _context3.next = 25;
                      return _iterator2["return"]();

                    case 25:
                      _context3.prev = 25;

                      if (!_didIteratorError2) {
                        _context3.next = 28;
                        break;
                      }

                      throw _iteratorError2;

                    case 28:
                      return _context3.finish(25);

                    case 29:
                      return _context3.finish(20);

                    case 30:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _loop, null, [[4, 16, 20, 30], [21,, 25, 29]]);
            });
            _iterator = _asyncIterator(transactions);

          case 8:
            _context4.next = 10;
            return _iterator.next();

          case 10:
            if (!(_iteratorAbruptCompletion = !(_step = _context4.sent).done)) {
              _context4.next = 15;
              break;
            }

            return _context4.delegateYield(_loop(), "t0", 12);

          case 12:
            _iteratorAbruptCompletion = false;
            _context4.next = 8;
            break;

          case 15:
            _context4.next = 21;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t1 = _context4["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context4.t1;

          case 21:
            _context4.prev = 21;
            _context4.prev = 22;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context4.next = 26;
              break;
            }

            _context4.next = 26;
            return _iterator["return"]();

          case 26:
            _context4.prev = 26;

            if (!_didIteratorError) {
              _context4.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context4.finish(26);

          case 30:
            return _context4.finish(21);

          case 31:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee2, null, [[5, 17, 21, 31], [22,, 26, 30]]);
  }));
  return _patchPirateDeposits.apply(this, arguments);
}