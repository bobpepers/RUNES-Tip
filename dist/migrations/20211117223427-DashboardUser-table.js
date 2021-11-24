"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

module.exports = {
  up: function () {
    var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryInterface, DataTypes) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return queryInterface.createTable('dashboardUser', {
                id: {
                  type: DataTypes.BIGINT,
                  allowNull: false,
                  primaryKey: true,
                  unique: true,
                  autoIncrement: true
                },
                username: {
                  type: DataTypes.STRING,
                  unique: true,
                  allowNull: false
                },
                email: {
                  type: DataTypes.STRING,
                  unique: true,
                  allowNull: false,
                  validate: {
                    isEmail: true
                  }
                },
                password: {
                  type: DataTypes.STRING,
                  allowNull: false
                },
                authtoken: {
                  type: DataTypes.STRING
                },
                authused: {
                  type: DataTypes.BOOLEAN,
                  defaultValue: 0
                },
                authexpires: {
                  type: DataTypes.DATE
                },
                resetpasstoken: {
                  type: DataTypes.STRING
                },
                resetpassused: {
                  type: DataTypes.BOOLEAN
                },
                resetpassexpires: {
                  type: DataTypes.DATE
                },
                role: {
                  type: DataTypes.TINYINT,
                  defaultValue: 0
                },
                banned: {
                  type: DataTypes.BOOLEAN,
                  defaultValue: false
                },
                tfa: {
                  type: DataTypes.BOOLEAN,
                  defaultValue: false
                },
                tfa_secret: {
                  type: DataTypes.STRING,
                  defaultValue: null
                },
                lastSeen: {
                  type: DataTypes.DATE,
                  allowNull: true
                },
                createdAt: {
                  allowNull: false,
                  type: DataTypes.DATE
                },
                updatedAt: {
                  allowNull: false,
                  type: DataTypes.DATE
                }
              });

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function up(_x, _x2) {
      return _up.apply(this, arguments);
    }

    return up;
  }(),
  down: function () {
    var _down = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(queryInterface, DataTypes) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return queryInterface.dropTable('dashboardUser');

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function down(_x3, _x4) {
      return _down.apply(this, arguments);
    }

    return down;
  }()
};