"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _walletNotify = _interopRequireDefault(require("../helpers/blockchain/runebase/walletNotify"));

var _walletNotify2 = _interopRequireDefault(require("../helpers/blockchain/pirate/walletNotify"));

var _walletNotify3 = _interopRequireDefault(require("../helpers/blockchain/komodo/walletNotify"));

var _syncRunebase = require("../services/syncRunebase");

var _syncPirate = require("../services/syncPirate");

var _syncKomodo = require("../services/syncKomodo");

var _messageHandlers = require("../helpers/messageHandlers");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

var localhostOnly = function localhostOnly(req, res, next) {
  var hostmachine = req.headers.host.split(':')[0];

  if (hostmachine !== 'localhost' && hostmachine !== '127.0.0.1') {
    return res.sendStatus(401);
  }

  next();
};

var notifyRouter = function notifyRouter(app, discordClient, telegramClient, matrixClient, settings, queue) {
  app.post('/api/chaininfo/block', localhostOnly, function (req, res) {
    if (settings.coin.setting === 'Runebase') {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);
    } else if (settings.coin.setting === 'Pirate') {
      (0, _syncPirate.startPirateSync)(discordClient, telegramClient, matrixClient, queue);
    } else if (settings.coin.setting === 'Komodo') {
      (0, _syncKomodo.startKomodoSync)(discordClient, telegramClient, matrixClient, queue);
    } else {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);
    }

    res.sendStatus(200);
  });

  if (settings.coin.setting === 'Pirate') {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify2["default"], /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, detail;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!res.locals.error) {
                  _context.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context.next = 37;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.detail && res.locals.detail.length > 0)) {
                  _context.next = 37;
                  break;
                }

                console.log(res.locals.detail);
                console.log('res.local.detail after walletNotify');
                _iteratorAbruptCompletion = false;
                _didIteratorError = false;
                _context.prev = 9;
                _iterator = _asyncIterator(res.locals.detail);

              case 11:
                _context.next = 13;
                return _iterator.next();

              case 13:
                if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
                  _context.next = 21;
                  break;
                }

                detail = _step.value;

                if (!detail.amount) {
                  _context.next = 18;
                  break;
                }

                _context.next = 18;
                return (0, _messageHandlers.incomingDepositMessageHandler)(discordClient, telegramClient, matrixClient, detail);

              case 18:
                _iteratorAbruptCompletion = false;
                _context.next = 11;
                break;

              case 21:
                _context.next = 27;
                break;

              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](9);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 27:
                _context.prev = 27;
                _context.prev = 28;

                if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                  _context.next = 32;
                  break;
                }

                _context.next = 32;
                return _iterator["return"]();

              case 32:
                _context.prev = 32;

                if (!_didIteratorError) {
                  _context.next = 35;
                  break;
                }

                throw _iteratorError;

              case 35:
                return _context.finish(32);

              case 36:
                return _context.finish(27);

              case 37:
                res.sendStatus(200);

              case 38:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[9, 23, 27, 37], [28,, 32, 36]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  } else if (settings.coin.setting === 'Komodo') {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify3["default"], /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
        var _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, detail;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!res.locals.error) {
                  _context2.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context2.next = 37;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.detail && res.locals.detail.length > 0)) {
                  _context2.next = 37;
                  break;
                }

                _iteratorAbruptCompletion2 = false;
                _didIteratorError2 = false;
                _context2.prev = 7;
                _iterator2 = _asyncIterator(res.locals.detail);

              case 9:
                _context2.next = 11;
                return _iterator2.next();

              case 11:
                if (!(_iteratorAbruptCompletion2 = !(_step2 = _context2.sent).done)) {
                  _context2.next = 21;
                  break;
                }

                detail = _step2.value;
                console.log(detail);
                console.log('detail');

                if (!detail.amount) {
                  _context2.next = 18;
                  break;
                }

                _context2.next = 18;
                return (0, _messageHandlers.incomingDepositMessageHandler)(discordClient, telegramClient, matrixClient, detail);

              case 18:
                _iteratorAbruptCompletion2 = false;
                _context2.next = 9;
                break;

              case 21:
                _context2.next = 27;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2["catch"](7);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 27:
                _context2.prev = 27;
                _context2.prev = 28;

                if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
                  _context2.next = 32;
                  break;
                }

                _context2.next = 32;
                return _iterator2["return"]();

              case 32:
                _context2.prev = 32;

                if (!_didIteratorError2) {
                  _context2.next = 35;
                  break;
                }

                throw _iteratorError2;

              case 35:
                return _context2.finish(32);

              case 36:
                return _context2.finish(27);

              case 37:
                res.sendStatus(200);

              case 38:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[7, 23, 27, 37], [28,, 32, 36]]);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());
  } else if (settings.coin.setting === 'Runebase') {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify["default"], /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
        var _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, detail;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!res.locals.error) {
                  _context3.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context3.next = 35;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.detail && res.locals.detail.length > 0)) {
                  _context3.next = 35;
                  break;
                }

                _iteratorAbruptCompletion3 = false;
                _didIteratorError3 = false;
                _context3.prev = 7;
                _iterator3 = _asyncIterator(res.locals.detail);

              case 9:
                _context3.next = 11;
                return _iterator3.next();

              case 11:
                if (!(_iteratorAbruptCompletion3 = !(_step3 = _context3.sent).done)) {
                  _context3.next = 19;
                  break;
                }

                detail = _step3.value;

                if (!detail.amount) {
                  _context3.next = 16;
                  break;
                }

                _context3.next = 16;
                return (0, _messageHandlers.incomingDepositMessageHandler)(discordClient, telegramClient, matrixClient, detail);

              case 16:
                _iteratorAbruptCompletion3 = false;
                _context3.next = 9;
                break;

              case 19:
                _context3.next = 25;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t0 = _context3["catch"](7);
                _didIteratorError3 = true;
                _iteratorError3 = _context3.t0;

              case 25:
                _context3.prev = 25;
                _context3.prev = 26;

                if (!(_iteratorAbruptCompletion3 && _iterator3["return"] != null)) {
                  _context3.next = 30;
                  break;
                }

                _context3.next = 30;
                return _iterator3["return"]();

              case 30:
                _context3.prev = 30;

                if (!_didIteratorError3) {
                  _context3.next = 33;
                  break;
                }

                throw _iteratorError3;

              case 33:
                return _context3.finish(30);

              case 34:
                return _context3.finish(25);

              case 35:
                res.sendStatus(200);

              case 36:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[7, 21, 25, 35], [26,, 30, 34]]);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }());
  } else {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify["default"], /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
        var _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, detail;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!res.locals.error) {
                  _context4.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context4.next = 35;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.detail && res.locals.detail.length > 0)) {
                  _context4.next = 35;
                  break;
                }

                _iteratorAbruptCompletion4 = false;
                _didIteratorError4 = false;
                _context4.prev = 7;
                _iterator4 = _asyncIterator(res.locals.detail);

              case 9:
                _context4.next = 11;
                return _iterator4.next();

              case 11:
                if (!(_iteratorAbruptCompletion4 = !(_step4 = _context4.sent).done)) {
                  _context4.next = 19;
                  break;
                }

                detail = _step4.value;

                if (!detail.amount) {
                  _context4.next = 16;
                  break;
                }

                _context4.next = 16;
                return (0, _messageHandlers.incomingDepositMessageHandler)(discordClient, telegramClient, matrixClient, detail);

              case 16:
                _iteratorAbruptCompletion4 = false;
                _context4.next = 9;
                break;

              case 19:
                _context4.next = 25;
                break;

              case 21:
                _context4.prev = 21;
                _context4.t0 = _context4["catch"](7);
                _didIteratorError4 = true;
                _iteratorError4 = _context4.t0;

              case 25:
                _context4.prev = 25;
                _context4.prev = 26;

                if (!(_iteratorAbruptCompletion4 && _iterator4["return"] != null)) {
                  _context4.next = 30;
                  break;
                }

                _context4.next = 30;
                return _iterator4["return"]();

              case 30:
                _context4.prev = 30;

                if (!_didIteratorError4) {
                  _context4.next = 33;
                  break;
                }

                throw _iteratorError4;

              case 33:
                return _context4.finish(30);

              case 34:
                return _context4.finish(25);

              case 35:
                res.sendStatus(200);

              case 36:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[7, 21, 25, 35], [26,, 30, 34]]);
      }));

      return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
      };
    }());
  }
};

exports.notifyRouter = notifyRouter;