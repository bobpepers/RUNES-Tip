"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disallowDirectMessage = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../../models"));

var _logger = _interopRequireDefault(require("../../logger"));

var _discord = require("../../../messages/discord");

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

var disallowDirectMessage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message, user, functionType, io) {
    var activity, disallow;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            disallow = false;
            _context3.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var notDirectActivity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(message.channel.type === 'DM')) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 3;
                        return _models["default"].activity.create({
                          type: "".concat(functionType, "_f"),
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 3:
                        notDirectActivity = _context.sent;
                        activity.unshift(notDirectActivity);
                        _context.next = 7;
                        return message.channel.send({
                          embeds: [(0, _discord.NotInDirectMessage)(message, capitalize(functionType))]
                        });

                      case 7:
                        disallow = true;

                      case 8:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x5) {
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
                          type: functionType,
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

                        _logger["default"].error("".concat(functionType, " error: ").concat(err));

                        _context2.prev = 10;
                        _context2.next = 13;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)(capitalize(functionType))]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 13:
                        _context2.next = 18;
                        break;

                      case 15:
                        _context2.prev = 15;
                        _context2.t1 = _context2["catch"](10);
                        console.log(_context2.t1);

                      case 18:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 15]]);
              }));

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 4:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

            return _context3.abrupt("return", disallow);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function disallowDirectMessage(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.disallowDirectMessage = disallowDirectMessage;