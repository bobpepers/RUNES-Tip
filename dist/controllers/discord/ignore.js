"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setIgnoreMe = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var setIgnoreMe = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, io) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var user;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;

                        if (user) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 6;
                        return message.channel.send({
                          embeds: [(0, _discord.walletNotFoundMessage)(message, 'Ignore me')]
                        });

                      case 6:
                        return _context.abrupt("return");

                      case 7:
                        if (!user.ignoreMe) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 10;
                        return user.update({
                          ignoreMe: false
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 10:
                        message.channel.send({
                          embeds: [(0, _discord.unIngoreMeMessage)(message)]
                        });
                        return _context.abrupt("return");

                      case 12:
                        if (user.ignoreMe) {
                          _context.next = 17;
                          break;
                        }

                        _context.next = 15;
                        return user.update({
                          ignoreMe: true
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        message.channel.send({
                          embeds: [(0, _discord.ignoreMeMessage)(message)]
                        });
                        return _context.abrupt("return");

                      case 17:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 18:
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
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function setIgnoreMe(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.setIgnoreMe = setIgnoreMe;