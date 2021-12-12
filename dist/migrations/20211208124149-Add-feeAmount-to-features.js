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
              return queryInterface.addColumn('flood', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 2:
              _context.next = 4;
              return queryInterface.addColumn('hurricane', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 4:
              _context.next = 6;
              return queryInterface.addColumn('rain', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 6:
              _context.next = 8;
              return queryInterface.addColumn('reactdrop', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 8:
              _context.next = 10;
              return queryInterface.addColumn('sleet', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 10:
              _context.next = 12;
              return queryInterface.addColumn('soak', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 12:
              _context.next = 14;
              return queryInterface.addColumn('thunder', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 14:
              _context.next = 16;
              return queryInterface.addColumn('thunderstorm', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 16:
              _context.next = 18;
              return queryInterface.addColumn('tip', // name of Target model
              'feeAmount', // name of the key we're adding
              {
                type: DataTypes.BIGINT,
                allowNull: false
              });

            case 18:
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
              return queryInterface.removeColumn('flood', 'feeAmount');

            case 2:
              _context2.next = 4;
              return queryInterface.removeColumn('hurricane', 'feeAmount');

            case 4:
              _context2.next = 6;
              return queryInterface.removeColumn('rain', 'feeAmount');

            case 6:
              _context2.next = 8;
              return queryInterface.removeColumn('reactdrop', 'feeAmount');

            case 8:
              _context2.next = 10;
              return queryInterface.removeColumn('sleet', 'feeAmount');

            case 10:
              _context2.next = 12;
              return queryInterface.removeColumn('soak', 'feeAmount');

            case 12:
              _context2.next = 14;
              return queryInterface.removeColumn('thunder', 'feeAmount');

            case 14:
              _context2.next = 16;
              return queryInterface.removeColumn('thunderstorm', 'feeAmount');

            case 16:
              _context2.next = 18;
              return queryInterface.removeColumn('tip', 'feeAmount');

            case 18:
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