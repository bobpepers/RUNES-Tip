"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMatrixGroup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

/* eslint-disable import/prefer-default-export */
var updateMatrixGroup = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message) {
    var currentRoom, group;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return matrixClient.getRoom(message.event.room_id);

          case 3:
            currentRoom = _context3.sent;
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

          case 9:
            _context3.next = 11;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!currentRoom) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 3;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "matrix-".concat(currentRoom.roomId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 3:
                        group = _context.sent;

                        if (group) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 7;
                        return _models["default"].group.create({
                          groupId: "matrix-".concat(currentRoom.roomId),
                          groupName: currentRoom && currentRoom.name ? currentRoom.name : '',
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 7:
                        group = _context.sent;

                      case 8:
                        if (!group) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 11;
                        return group.update({
                          groupName: currentRoom && currentRoom.name ? currentRoom.name : '',
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 11:
                        group = _context.sent;

                      case 12:
                        t.afterCommit(function () {
                          console.log('Update Group transaction done');
                        });

                      case 13:
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
                          type: 'group',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error matrix: ".concat(_context2.t0));

                      case 8:
                        _logger["default"].error("matrix error: ".concat(err));

                        console.log(err.message);

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 11:
            return _context3.abrupt("return", group);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 6]]);
  }));

  return function updateMatrixGroup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateMatrixGroup = updateMatrixGroup;