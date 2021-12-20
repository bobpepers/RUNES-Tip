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

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

(0, _dotenv.config)();

function patchPirateDeposits() {
  return _patchPirateDeposits.apply(this, arguments);
}

function _patchPirateDeposits() {
  _patchPirateDeposits = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var transactions, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

    return _regenerator["default"].wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _rclient.getInstance)().listTransactions(1000);

          case 2:
            transactions = _context3.sent;
            // transactions.forEach(async (trans) => {
            // eslint-disable-next-line no-restricted-syntax
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context3.prev = 5;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var trans, address;
              return _regenerator["default"].wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      trans = _step.value;
                      console.log('show transaction');
                      console.log(trans);

                      if (!(trans.received.length > 0 && trans.received[0].address && trans.received[0].address !== process.env.PIRATE_MAIN_ADDRESS)) {
                        _context2.next = 11;
                        break;
                      }

                      _context2.next = 6;
                      return _models["default"].address.findOne({
                        where: {
                          address: trans.received[0].address
                        },
                        include: [{
                          model: _models["default"].wallet,
                          as: 'wallet'
                        }]
                      });

                    case 6:
                      address = _context2.sent;

                      if (!address) {
                        console.log(trans.received[0].address);
                        console.log('address not found');
                      }

                      if (!address) {
                        _context2.next = 11;
                        break;
                      }

                      _context2.next = 11;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                          var category, newTrans;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  console.log('begin transaction');
                                  category = null;

                                  if (trans.received.length > 0) {
                                    category = 'receive';
                                  }

                                  if (trans.sent.length > 0) {
                                    category = 'send';
                                  }

                                  _context.next = 6;
                                  return _models["default"].transaction.findOrCreate({
                                    where: {
                                      txid: trans.txid,
                                      type: category
                                    },
                                    defaults: {
                                      txid: trans.txid,
                                      addressId: address.id,
                                      phase: 'confirming',
                                      type: category,
                                      amount: trans.received[0].value * 1e8
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 6:
                                  newTrans = _context.sent;
                                  t.afterCommit(function () {
                                    console.log('commited');
                                  });

                                case 8:
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

                    case 11:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop);
            });
            _iterator = _asyncIterator(transactions);

          case 8:
            _context3.next = 10;
            return _iterator.next();

          case 10:
            if (!(_iteratorAbruptCompletion = !(_step = _context3.sent).done)) {
              _context3.next = 15;
              break;
            }

            return _context3.delegateYield(_loop(), "t0", 12);

          case 12:
            _iteratorAbruptCompletion = false;
            _context3.next = 8;
            break;

          case 15:
            _context3.next = 21;
            break;

          case 17:
            _context3.prev = 17;
            _context3.t1 = _context3["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context3.t1;

          case 21:
            _context3.prev = 21;
            _context3.prev = 22;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context3.next = 26;
              break;
            }

            _context3.next = 26;
            return _iterator["return"]();

          case 26:
            _context3.prev = 26;

            if (!_didIteratorError) {
              _context3.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context3.finish(26);

          case 30:
            return _context3.finish(21);

          case 31:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, null, [[5, 17, 21, 31], [22,, 26, 30]]);
  }));
  return _patchPirateDeposits.apply(this, arguments);
}