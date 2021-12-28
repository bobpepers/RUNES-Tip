"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchKomodoDeposits = patchKomodoDeposits;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

function patchKomodoDeposits() {
  return _patchKomodoDeposits.apply(this, arguments);
}

function _patchKomodoDeposits() {
  _patchKomodoDeposits = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var transactions, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

    return _regenerator["default"].wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('start patch deposits');
            _context3.next = 3;
            return (0, _rclient.getInstance)().listTransactions(1000);

          case 3:
            transactions = _context3.sent;
            console.log('after await instance listtransactions');
            console.log(transactions); // transactions.forEach(async (trans) => {
            // eslint-disable-next-line no-restricted-syntax

            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context3.prev = 8;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var trans, address;
              return _regenerator["default"].wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      trans = _step.value;
                      console.log(trans);

                      if (!trans.address) {
                        _context2.next = 12;
                        break;
                      }

                      _context2.next = 5;
                      return _models["default"].address.findOne({
                        where: {
                          address: trans.address
                        },
                        include: [{
                          model: _models["default"].wallet,
                          as: 'wallet'
                        }]
                      });

                    case 5:
                      address = _context2.sent;

                      if (!address) {
                        console.log(trans.address);
                        console.log('address not found');
                      }

                      if (!address) {
                        _context2.next = 12;
                        break;
                      }

                      console.log(trans);
                      console.log(address); // eslint-disable-next-line no-await-in-loop

                      _context2.next = 12;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                          var newTrans;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  console.log('begin transaction');
                                  _context.next = 3;
                                  return _models["default"].transaction.findOrCreate({
                                    where: {
                                      txid: trans.txid,
                                      type: trans.category
                                    },
                                    defaults: {
                                      txid: trans.txid,
                                      addressId: address.id,
                                      phase: 'confirming',
                                      type: trans.category,
                                      amount: trans.amount * 1e8
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 3:
                                  newTrans = _context.sent;
                                  console.log('newTrans');
                                  console.log(newTrans);
                                  t.afterCommit(function () {
                                    console.log('commited');
                                  });

                                case 7:
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

                    case 12:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop);
            });
            _iterator = _asyncIterator(transactions);

          case 11:
            _context3.next = 13;
            return _iterator.next();

          case 13:
            if (!(_iteratorAbruptCompletion = !(_step = _context3.sent).done)) {
              _context3.next = 18;
              break;
            }

            return _context3.delegateYield(_loop(), "t0", 15);

          case 15:
            _iteratorAbruptCompletion = false;
            _context3.next = 11;
            break;

          case 18:
            _context3.next = 24;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t1 = _context3["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context3.t1;

          case 24:
            _context3.prev = 24;
            _context3.prev = 25;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context3.next = 29;
              break;
            }

            _context3.next = 29;
            return _iterator["return"]();

          case 29:
            _context3.prev = 29;

            if (!_didIteratorError) {
              _context3.next = 32;
              break;
            }

            throw _iteratorError;

          case 32:
            return _context3.finish(29);

          case 33:
            return _context3.finish(24);

          case 34:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, null, [[8, 20, 24, 34], [25,, 29, 33]]);
  }));
  return _patchKomodoDeposits.apply(this, arguments);
}