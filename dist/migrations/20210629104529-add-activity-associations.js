"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

module.exports = {
  up: function () {
    var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryInterface, Sequelize) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return queryInterface.addColumn('activity', // name of Target model
              'userId', // name of the key we're adding
              {
                type: Sequelize.BIGINT,
                references: {
                  model: 'user',
                  // name of Source model
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 2:
              _context.next = 4;
              return queryInterface.addColumn('activity', 'spenderId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'user',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 4:
              _context.next = 6;
              return queryInterface.addColumn('activity', 'earnerId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'user',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 6:
              _context.next = 8;
              return queryInterface.addColumn('activity', 'transactionId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'transaction',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 8:
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
              return queryInterface.removeColumn('activity', 'userId');

            case 2:
              _context2.next = 4;
              return queryInterface.removeColumn('activity', 'spenderId');

            case 4:
              _context2.next = 6;
              return queryInterface.removeColumn('activity', 'earnerId');

            case 6:
              _context2.next = 8;
              return queryInterface.removeColumn('activity', 'transactionId');

            case 8:
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