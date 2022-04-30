"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

// LEGENDE
// _i = insufficient balance
// _s = Success
// _f = fail
//
module.exports = {
  up: function () {
    var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryInterface, DataTypes) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return queryInterface.changeColumn('activity', 'type', {
                type: DataTypes.ENUM('depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'help', 'balance', 'deposit', 'info', 'tip_i', 'tip_f', 'tip_s', 'rain_i', 'rain_f', 'rain_s', 'raintip_f', 'raintip_s', 'soak_i', 'soak_f', 'soak_s', 'soaktip_f', 'soaktip_s', 'flood_i', 'flood_f', 'flood_s', 'floodtip_f', 'floodtip_s', 'sleet_i', 'sleet_f', 'sleet_s', 'sleettip_f', 'sleettip_s', 'thunder_i', 'thunder_f', 'thunder_s', 'thundertip_f', 'thundertip_s', 'thunderstorm_i', 'thunderstorm_f', 'thunderstorm_s', 'reactdrop_i', 'reactdrop_f', 'reactdrop_s', 'reactdroptip_f', 'reactdroptip_s', 'thunderstormtip_s', 'thunderstormtip_f', 'ignore', 'price', 'hurricane_f', 'hurricane_i', 'hurricane_s', 'hurricanetip_s', 'faucet_add', 'faucettip_s', 'faucettip_f', 'faucettip_i', 'faucettip_t', 'voicerain_s', 'voicerain_i', 'voicerain_f', 'voiceraintip_s', 'withdraw_i', 'withdraw_f', 'waterFaucet', 'tiptip_s', 'fees_s', 'fees_f', 'ignoreme_s', 'ignoreme_f', 'publicstats_s', 'publicstats_f', 'stats_i', 'stats_f', 'stats_s', 'tip_faucet_s', 'tiptip_faucet_s', 'trivia_s', 'trivia_i', 'trivia_f', 'triviatip_s', 'listtransactions_f', 'listtransactions_s', 'balance_s', 'balance_f', 'help_s', 'help_f', 'deposit_s', 'deposit_f', 'info_s', 'info_f', 'price_s', 'price_f', 'halving_s', 'halving_f', 'mining_s', 'mining_f', 'login_s', 'login_f', 'logout_s')
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
              return queryInterface.changeColumn('activity', 'type', {
                type: DataTypes.ENUM('depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'help', 'balance', 'deposit', 'info', 'tip_i', 'tip_f', 'tip_s', 'rain_i', 'rain_f', 'rain_s', 'raintip_f', 'raintip_s', 'soak_i', 'soak_f', 'soak_s', 'soaktip_f', 'soaktip_s', 'flood_i', 'flood_f', 'flood_s', 'floodtip_f', 'floodtip_s', 'sleet_i', 'sleet_f', 'sleet_s', 'sleettip_f', 'sleettip_s', 'thunder_i', 'thunder_f', 'thunder_s', 'thundertip_f', 'thundertip_s', 'thunderstorm_i', 'thunderstorm_f', 'thunderstorm_s', 'reactdrop_i', 'reactdrop_f', 'reactdrop_s', 'reactdroptip_f', 'reactdroptip_s', 'thunderstormtip_s', 'thunderstormtip_f', 'ignore', 'price', 'hurricane_f', 'hurricane_i', 'hurricane_s', 'hurricanetip_s', 'faucet_add', 'faucettip_s', 'faucettip_f', 'faucettip_i', 'faucettip_t', 'voicerain_s', 'voicerain_i', 'voicerain_f', 'voiceraintip_s', 'withdraw_i', 'withdraw_f', 'waterFaucet', 'tiptip_s', 'fees_s', 'fees_f', 'ignoreme_s', 'ignoreme_f', 'publicstats_s', 'publicstats_f', 'stats_i', 'stats_f', 'stats_s', 'tip_faucet_s', 'tiptip_faucet_s', 'trivia_s', 'trivia_i', 'trivia_f', 'triviatip_s', 'listtransactions_f', 'listtransactions_s', 'balance_s', 'balance_f', 'help_s', 'help_f', 'deposit_s', 'deposit_f', 'info_s', 'info_f', 'price_s', 'price_f', 'halving_s', 'halving_f', 'mining_s', 'mining_f', 'login_s', 'login_f')
              });

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