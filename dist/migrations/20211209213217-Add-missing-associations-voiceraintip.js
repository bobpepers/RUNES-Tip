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
              return queryInterface.addColumn('voiceraintip', // name of Target model
              'groupId', // name of the key we're adding
              {
                type: Sequelize.BIGINT,
                references: {
                  model: 'group',
                  // name of Source model
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 2:
              _context.next = 4;
              return queryInterface.addColumn('voiceraintip', // name of Target model
              'channelId', // name of the key we're adding
              {
                type: Sequelize.BIGINT,
                references: {
                  model: 'channel',
                  // name of Source model
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 4:
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
              return queryInterface.removeColumn('voiceraintip', 'groupId');

            case 2:
              _context2.next = 4;
              return queryInterface.removeColumn('voiceraintip', 'channelId');

            case 4:
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