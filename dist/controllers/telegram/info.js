"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchInfo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _telegram = require("../../messages/telegram");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _rclient = require("../../services/rclient");

/* eslint-disable import/prefer-default-export */
var fetchInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(ctx, io) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, walletInfo, blockHeight, priceInfo, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'info');

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
                        return (0, _rclient.getInstance)().getWalletInfo();

                      case 11:
                        walletInfo = _context.sent;
                        _context.next = 14;
                        return _models["default"].block.findOne({
                          order: [['id', 'DESC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 14:
                        blockHeight = _context.sent;
                        _context.next = 17;
                        return _models["default"].currency.findOne({
                          order: [['id', 'ASC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 17:
                        priceInfo = _context.sent;
                        _context.next = 20;
                        return _models["default"].activity.create({
                          type: 'info_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 20:
                        preActivity = _context.sent;
                        _context.next = 23;
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

                      case 23:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        _context.t0 = ctx;
                        _context.next = 28;
                        return (0, _telegram.InfoMessage)(blockHeight.id, priceInfo, walletInfo.walletversion);

                      case 28:
                        _context.t1 = _context.sent;
                        _context.next = 31;
                        return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

                      case 31:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 32:
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
                          type: 'info',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Telegram: ".concat(_context2.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("info error: ".concat(err));

                        _context2.prev = 10;
                        _context2.t1 = ctx;
                        _context2.next = 14;
                        return (0, _telegram.errorMessage)('Info');

                      case 14:
                        _context2.t2 = _context2.sent;
                        _context2.next = 17;
                        return _context2.t1.replyWithHTML.call(_context2.t1, _context2.t2);

                      case 17:
                        _context2.next = 22;
                        break;

                      case 19:
                        _context2.prev = 19;
                        _context2.t3 = _context2["catch"](10);
                        console.log(_context2.t3);

                      case 22:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 19]]);
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

  return function fetchInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchInfo = fetchInfo;