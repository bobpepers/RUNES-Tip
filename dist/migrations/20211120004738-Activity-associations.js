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
              'soakId', // name of the key we're adding
              {
                type: Sequelize.BIGINT,
                references: {
                  model: 'soak',
                  // name of Source model
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 2:
              _context.next = 4;
              return queryInterface.addColumn('activity', 'rainId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'rain',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 4:
              _context.next = 6;
              return queryInterface.addColumn('activity', 'floodId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'flood',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 6:
              _context.next = 8;
              return queryInterface.addColumn('activity', 'tipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'tip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 8:
              _context.next = 10;
              return queryInterface.addColumn('activity', 'thunderId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'thunder',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 10:
              _context.next = 12;
              return queryInterface.addColumn('activity', 'thunderstormId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'thunderstorm',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 12:
              _context.next = 14;
              return queryInterface.addColumn('activity', 'reactdropId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'reactdrop',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 14:
              _context.next = 16;
              return queryInterface.addColumn('activity', 'sleetId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'sleet',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 16:
              _context.next = 18;
              return queryInterface.addColumn('activity', 'reactdroptipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'reactdroptip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 18:
              _context.next = 20;
              return queryInterface.addColumn('activity', 'sleettipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'sleettip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 20:
              _context.next = 22;
              return queryInterface.addColumn('activity', 'thunderstormtipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'thunderstormtip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 22:
              _context.next = 24;
              return queryInterface.addColumn('activity', 'thundertipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'thundertip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 24:
              _context.next = 26;
              return queryInterface.addColumn('activity', 'soaktipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'soaktip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 26:
              _context.next = 28;
              return queryInterface.addColumn('activity', 'raintipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'raintip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 28:
              _context.next = 30;
              return queryInterface.addColumn('activity', 'floodtipId', {
                type: Sequelize.BIGINT,
                references: {
                  model: 'floodtip',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              });

            case 30:
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
              return queryInterface.removeColumn('activity', 'tipId');

            case 2:
              _context2.next = 4;
              return queryInterface.removeColumn('activity', 'floodId');

            case 4:
              _context2.next = 6;
              return queryInterface.removeColumn('activity', 'rainId');

            case 6:
              _context2.next = 8;
              return queryInterface.removeColumn('activity', 'soakId');

            case 8:
              _context2.next = 10;
              return queryInterface.removeColumn('activity', 'thunderId');

            case 10:
              _context2.next = 12;
              return queryInterface.removeColumn('activity', 'thunderstormId');

            case 12:
              _context2.next = 14;
              return queryInterface.removeColumn('activity', 'reactdropId');

            case 14:
              _context2.next = 16;
              return queryInterface.removeColumn('activity', 'sleetId');

            case 16:
              _context2.next = 18;
              return queryInterface.removeColumn('activity', 'reactdroptipId');

            case 18:
              _context2.next = 20;
              return queryInterface.removeColumn('activity', 'sleettipId');

            case 20:
              _context2.next = 22;
              return queryInterface.removeColumn('activity', 'thunderstormtipId');

            case 22:
              _context2.next = 24;
              return queryInterface.removeColumn('activity', 'thundertipId');

            case 24:
              _context2.next = 26;
              return queryInterface.removeColumn('activity', 'soaktipId');

            case 26:
              _context2.next = 28;
              return queryInterface.removeColumn('activity', 'raintipId');

            case 28:
              _context2.next = 30;
              return queryInterface.removeColumn('activity', 'floodtipId');

            case 30:
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