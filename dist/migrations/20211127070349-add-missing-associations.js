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
              return queryInterface.addColumn('flood', // name of Target model
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
              return queryInterface.addColumn('flood', // name of Target model
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
              _context.next = 6;
              return queryInterface.addColumn('floodtip', // name of Target model
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

            case 6:
              _context.next = 8;
              return queryInterface.addColumn('floodtip', // name of Target model
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

            case 8:
              _context.next = 10;
              return queryInterface.addColumn('hurricane', // name of Target model
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

            case 10:
              _context.next = 12;
              return queryInterface.addColumn('hurricane', // name of Target model
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

            case 12:
              _context.next = 14;
              return queryInterface.addColumn('hurricanetip', // name of Target model
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

            case 14:
              _context.next = 16;
              return queryInterface.addColumn('hurricanetip', // name of Target model
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

            case 16:
              _context.next = 18;
              return queryInterface.addColumn('rain', // name of Target model
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

            case 18:
              _context.next = 20;
              return queryInterface.addColumn('rain', // name of Target model
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

            case 20:
              _context.next = 22;
              return queryInterface.addColumn('raintip', // name of Target model
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

            case 22:
              _context.next = 24;
              return queryInterface.addColumn('raintip', // name of Target model
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

            case 24:
              _context.next = 26;
              return queryInterface.addColumn('sleet', // name of Target model
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

            case 26:
              _context.next = 28;
              return queryInterface.addColumn('sleet', // name of Target model
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

            case 28:
              _context.next = 30;
              return queryInterface.addColumn('sleettip', // name of Target model
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

            case 30:
              _context.next = 32;
              return queryInterface.addColumn('sleettip', // name of Target model
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

            case 32:
              _context.next = 34;
              return queryInterface.addColumn('soak', // name of Target model
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

            case 34:
              _context.next = 36;
              return queryInterface.addColumn('soak', // name of Target model
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

            case 36:
              _context.next = 38;
              return queryInterface.addColumn('soaktip', // name of Target model
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

            case 38:
              _context.next = 40;
              return queryInterface.addColumn('soaktip', // name of Target model
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

            case 40:
              _context.next = 42;
              return queryInterface.addColumn('thunder', // name of Target model
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

            case 42:
              _context.next = 44;
              return queryInterface.addColumn('thunder', // name of Target model
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

            case 44:
              _context.next = 46;
              return queryInterface.addColumn('thundertip', // name of Target model
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

            case 46:
              _context.next = 48;
              return queryInterface.addColumn('thundertip', // name of Target model
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

            case 48:
              _context.next = 50;
              return queryInterface.addColumn('thunderstorm', // name of Target model
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

            case 50:
              _context.next = 52;
              return queryInterface.addColumn('thunderstorm', // name of Target model
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

            case 52:
              _context.next = 54;
              return queryInterface.addColumn('thunderstormtip', // name of Target model
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

            case 54:
              _context.next = 56;
              return queryInterface.addColumn('thunderstormtip', // name of Target model
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

            case 56:
              _context.next = 58;
              return queryInterface.addColumn('reactdroptip', // name of Target model
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

            case 58:
              _context.next = 60;
              return queryInterface.addColumn('reactdroptip', // name of Target model
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

            case 60:
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
              return queryInterface.removeColumn('flood', 'groupId');

            case 2:
              _context2.next = 4;
              return queryInterface.removeColumn('flood', 'channelId');

            case 4:
              _context2.next = 6;
              return queryInterface.removeColumn('floodtip', 'groupId');

            case 6:
              _context2.next = 8;
              return queryInterface.removeColumn('floodtip', 'channelId');

            case 8:
              _context2.next = 10;
              return queryInterface.removeColumn('hurricane', 'groupId');

            case 10:
              _context2.next = 12;
              return queryInterface.removeColumn('hurricane', 'channelId');

            case 12:
              _context2.next = 14;
              return queryInterface.removeColumn('hurricanetip', 'groupId');

            case 14:
              _context2.next = 16;
              return queryInterface.removeColumn('hurricanetip', 'channelId');

            case 16:
              _context2.next = 18;
              return queryInterface.removeColumn('rain', 'groupId');

            case 18:
              _context2.next = 20;
              return queryInterface.removeColumn('rain', 'channelId');

            case 20:
              _context2.next = 22;
              return queryInterface.removeColumn('raintip', 'groupId');

            case 22:
              _context2.next = 24;
              return queryInterface.removeColumn('raintip', 'channelId');

            case 24:
              _context2.next = 26;
              return queryInterface.removeColumn('sleet', 'groupId');

            case 26:
              _context2.next = 28;
              return queryInterface.removeColumn('sleet', 'channelId');

            case 28:
              _context2.next = 30;
              return queryInterface.removeColumn('sleettip', 'groupId');

            case 30:
              _context2.next = 32;
              return queryInterface.removeColumn('sleettip', 'channelId');

            case 32:
              _context2.next = 34;
              return queryInterface.removeColumn('soak', 'groupId');

            case 34:
              _context2.next = 36;
              return queryInterface.removeColumn('soak', 'channelId');

            case 36:
              _context2.next = 38;
              return queryInterface.removeColumn('soaktip', 'groupId');

            case 38:
              _context2.next = 40;
              return queryInterface.removeColumn('soaktip', 'channelId');

            case 40:
              _context2.next = 42;
              return queryInterface.removeColumn('thunder', 'groupId');

            case 42:
              _context2.next = 44;
              return queryInterface.removeColumn('thunder', 'channelId');

            case 44:
              _context2.next = 46;
              return queryInterface.removeColumn('thundertip', 'groupId');

            case 46:
              _context2.next = 48;
              return queryInterface.removeColumn('thundertip', 'channelId');

            case 48:
              _context2.next = 50;
              return queryInterface.removeColumn('thunderstorm', 'groupId');

            case 50:
              _context2.next = 52;
              return queryInterface.removeColumn('thunderstorm', 'channelId');

            case 52:
              _context2.next = 54;
              return queryInterface.removeColumn('thunderstormtip', 'groupId');

            case 54:
              _context2.next = 56;
              return queryInterface.removeColumn('thunderstormtip', 'channelId');

            case 56:
              _context2.next = 58;
              return queryInterface.removeColumn('reactdroptip', 'groupId');

            case 58:
              _context2.next = 60;
              return queryInterface.removeColumn('reactdroptip', 'channelId');

            case 60:
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