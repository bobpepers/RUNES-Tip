"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGroup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var updateGroup = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx) {
    var group;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(ctx.update.message.chat.id === ctx.update.message.from.id)) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return");

                      case 2:
                        _context.next = 4;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "telegram-".concat(ctx.update.message.chat.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 4:
                        group = _context.sent;

                        if (group) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 8;
                        return _models["default"].group.create({
                          groupId: "telegram-".concat(ctx.update.message.chat.id),
                          groupName: ctx.update.message.chat.title,
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 8:
                        group = _context.sent;

                      case 9:
                        if (!group) {
                          _context.next = 13;
                          break;
                        }

                        _context.next = 12;
                        return group.update({
                          groupName: ctx.update.message.chat.title,
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 12:
                        group = _context.sent;

                      case 13:
                        t.afterCommit(function () {
                          console.log('done'); // ctx.reply(`done`);
                        });

                      case 14:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err.message);
            });

          case 2:
            return _context2.abrupt("return", group);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function updateGroup(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateGroup = updateGroup;