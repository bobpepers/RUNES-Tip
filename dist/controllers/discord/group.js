"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDiscordGroup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable import/prefer-default-export */
var updateDiscordGroup = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(client, message) {
    var group, guildId;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (message.guild && message.guild.id) {
              guildId = message.guild.id;
            } else {
              guildId = message.guildId;
            }

            _context2.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var guild;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!guildId) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 3;
                        return client.guilds.cache.get(guildId);

                      case 3:
                        guild = _context.sent;
                        _context.next = 6;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 6:
                        group = _context.sent;

                        if (group) {
                          _context.next = 11;
                          break;
                        }

                        _context.next = 10;
                        return _models["default"].group.create({
                          groupId: "discord-".concat(guildId),
                          groupName: guild.name,
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 10:
                        group = _context.sent;

                      case 11:
                        if (!group) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 14;
                        return group.update({
                          groupName: guild.name,
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        group = _context.sent;

                      case 15:
                        t.afterCommit(function () {
                          console.log('Update Group transaction done');
                        });

                      case 16:
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
              console.log(err.message);
            });

          case 3:
            return _context2.abrupt("return", group);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function updateDiscordGroup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateDiscordGroup = updateDiscordGroup;